import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { isFirebaseConfigured, readFirebaseConfig } from './config';
import { withFriendlyErrors } from './errors';
import {
  defaultSettings,
  fromJsDate,
  type FixedCommitment,
  type FixedCommitmentInput,
  type PlanBlock,
  type Task,
  type TaskInput,
  type UserProfile,
  type UserSettings,
} from '@/domain';
import type { AppServices } from '@/services/AppServices';
import type { AuthService } from '@/services/contracts';

export interface FirebaseServicesOptions {
  /** Configuração do app (padrão: variáveis VITE_FIREBASE_*). */
  config?: FirebaseOptions;
  /** Conecta aos emuladores locais (padrão: VITE_USE_FIREBASE_EMULATORS). */
  useEmulators?: boolean;
  /** Nome da instância (testes usam nomes diferentes). */
  appName?: string;
}

const connectedToEmulators = new Set<string>();

/**
 * Serviços com Firebase Authentication + Cloud Firestore.
 * Estrutura dos dados: docs/arquitetura/modelo-de-dados.md.
 */
export function createFirebaseServices(options: FirebaseServicesOptions = {}): AppServices {
  const config = options.config ?? readFirebaseConfig();
  if (!isFirebaseConfigured(config)) {
    throw new Error('Firebase não configurado: preencha as variáveis VITE_FIREBASE_* no arquivo .env.local.');
  }
  const appName = options.appName ?? '[DEFAULT]';
  const app = getApps().find((a) => a.name === appName) ?? initializeApp(config, appName);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const useEmulators = options.useEmulators ?? import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
  if (useEmulators && !connectedToEmulators.has(appName)) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectedToEmulators.add(appName);
  }

  // ---------------------------------------------------------------- caminhos
  const uid = (): string => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');
    return user.uid;
  };
  const userDoc = (id = uid()) => doc(db, 'users', id);
  const subcollection = (name: 'commitments' | 'tasks', id = uid()) => collection(db, 'users', id, name);
  const settingsDoc = () => doc(db, 'users', uid(), 'settings', 'main');
  const planDoc = () => doc(db, 'users', uid(), 'plan', 'current');

  // ---------------------------------------------------------------- autenticação
  const listeners = new Set<(user: UserProfile | null) => void>();
  const toProfile = (user: User, name?: string): UserProfile => ({
    id: user.uid,
    name: name ?? user.displayName ?? user.email?.split('@')[0] ?? 'Usuário',
    email: user.email ?? '',
    provider: user.providerData.some((p) => p.providerId === 'google.com') ? 'google' : 'password',
  });
  const emit = (profile: UserProfile | null) => listeners.forEach((listener) => listener(profile));

  /** Cria o documento do usuário na primeira entrada. */
  const ensureUserDoc = async (user: User, name: string) => {
    const ref = userDoc(user.uid);
    if (!(await getDoc(ref)).exists()) {
      await setDoc(ref, { name, email: user.email ?? '', onboardingCompleted: false, createdAt: serverTimestamp() });
    }
  };

  const deleteUserData = async (id: string) => {
    const refs = [
      ...(await getDocs(subcollection('commitments', id))).docs.map((d) => d.ref),
      ...(await getDocs(subcollection('tasks', id))).docs.map((d) => d.ref),
      doc(db, 'users', id, 'settings', 'main'),
      doc(db, 'users', id, 'plan', 'current'),
      userDoc(id),
    ];
    for (let i = 0; i < refs.length; i += 400) {
      const batch = writeBatch(db);
      refs.slice(i, i + 400).forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
  };

  const authService: AuthService = {
    getCurrentUser: () => (auth.currentUser ? toProfile(auth.currentUser) : null),
    onAuthChange(listener) {
      listeners.add(listener);
      const unsubscribe = onAuthStateChanged(auth, (user) => listener(user ? toProfile(user) : null));
      return () => {
        unsubscribe();
        listeners.delete(listener);
      };
    },
    signUp: ({ name, email, password }) =>
      withFriendlyErrors(async () => {
        const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(user, { displayName: name.trim() });
        await ensureUserDoc(user, name.trim());
        const profile = toProfile(user, name.trim());
        emit(profile);
        return profile;
      }),
    signIn: (email, password) =>
      withFriendlyErrors(async () => {
        const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
        return toProfile(user);
      }),
    signInWithGoogle: () =>
      withFriendlyErrors(async () => {
        const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
        await ensureUserDoc(user, user.displayName ?? user.email?.split('@')[0] ?? 'Usuário');
        return toProfile(user);
      }),
    sendPasswordReset: (email) => withFriendlyErrors(() => sendPasswordResetEmail(auth, email.trim())),
    signOut: () => withFriendlyErrors(() => signOut(auth)),
    deleteAccount: (reauth) =>
      withFriendlyErrors(async () => {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuário não autenticado.');
        // O Firebase exige login recente para excluir a conta.
        if (toProfile(user).provider === 'google') {
          await reauthenticateWithPopup(user, new GoogleAuthProvider());
        } else {
          if (!reauth.password) throw new Error('Digite sua senha para confirmar.');
          await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email ?? '', reauth.password));
        }
        await deleteUserData(user.uid);
        await deleteUser(user);
      }),
  };

  // ---------------------------------------------------------------- dados
  const listOf = async <T extends { id: string }>(name: 'commitments' | 'tasks'): Promise<T[]> => {
    const snapshot = await getDocs(subcollection(name));
    return snapshot.docs
      .map((d) => ({ ...(d.data() as Omit<T, 'id'>), id: d.id }) as T)
      .sort((a, b) => (a.id < b.id ? -1 : 1));
  };

  const readBlocks = async (): Promise<PlanBlock[]> =>
    ((await getDoc(planDoc())).data()?.blocks as PlanBlock[] | undefined) ?? [];

  return {
    auth: authService,
    profile: {
      get: () =>
        withFriendlyErrors(async () => ({
          onboardingCompleted: (await getDoc(userDoc())).data()?.onboardingCompleted === true,
        })),
      completeOnboarding: () =>
        withFriendlyErrors(() => setDoc(userDoc(), { onboardingCompleted: true }, { merge: true })),
    },
    commitments: {
      list: () => withFriendlyErrors(() => listOf<FixedCommitment>('commitments')),
      create: (input: FixedCommitmentInput) =>
        withFriendlyErrors(async () => {
          const ref = await addDoc(subcollection('commitments'), { ...input });
          return { ...input, id: ref.id };
        }),
      update: (id, input) =>
        withFriendlyErrors(async () => {
          await setDoc(doc(subcollection('commitments'), id), { ...input });
          return { ...input, id };
        }),
      remove: (id) => withFriendlyErrors(() => deleteDoc(doc(subcollection('commitments'), id))),
    },
    tasks: {
      list: () => withFriendlyErrors(() => listOf<Task>('tasks')),
      create: (input: TaskInput) =>
        withFriendlyErrors(async () => {
          const data = { ...input, createdAt: fromJsDate(new Date()) };
          const ref = await addDoc(subcollection('tasks'), data);
          return { ...data, id: ref.id };
        }),
      update: (id, input) =>
        withFriendlyErrors(async () => {
          const ref = doc(subcollection('tasks'), id);
          await setDoc(ref, { ...input }, { merge: true });
          return { ...((await getDoc(ref)).data() as Omit<Task, 'id'>), id };
        }),
      remove: (id) => withFriendlyErrors(() => deleteDoc(doc(subcollection('tasks'), id))),
    },
    blocks: {
      list: () => withFriendlyErrors(readBlocks),
      replaceAll: (blocks) => withFriendlyErrors(() => setDoc(planDoc(), { blocks })),
      update: (block) =>
        withFriendlyErrors(async () => {
          const blocks = await readBlocks();
          const index = blocks.findIndex((b) => b.id === block.id);
          if (index < 0) throw new Error('Bloco não encontrado.');
          blocks[index] = block;
          await setDoc(planDoc(), { blocks });
          return block;
        }),
    },
    settings: {
      get: () =>
        withFriendlyErrors(async () => ({
          ...defaultSettings(),
          ...((await getDoc(settingsDoc())).data() as Partial<UserSettings> | undefined),
        })),
      save: (settings) =>
        withFriendlyErrors(async () => {
          await setDoc(settingsDoc(), { ...settings });
          return settings;
        }),
    },
  };
}
