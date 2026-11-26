/** Mensagens em português para os códigos de erro do Firebase. */
const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'E-mail ou senha inválidos.',
  'auth/invalid-login-credentials': 'E-mail ou senha inválidos.',
  'auth/wrong-password': 'E-mail ou senha inválidos.',
  'auth/user-not-found': 'E-mail ou senha inválidos.',
  'auth/invalid-email': 'Informe um e-mail válido.',
  'auth/email-already-in-use': 'Já existe uma conta com este e-mail.',
  'auth/account-exists-with-different-credential':
    'Este e-mail já está cadastrado com senha. Entre com e-mail e senha.',
  'auth/weak-password': 'A senha precisa ter pelo menos 8 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  'auth/network-request-failed': 'Sem conexão. Verifique sua internet e tente de novo.',
  'auth/popup-closed-by-user': 'O login com Google foi cancelado.',
  'auth/cancelled-popup-request': 'O login com Google foi cancelado.',
  'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Libere pop-ups para este site.',
  'auth/user-mismatch': 'Entre com a mesma conta Google para confirmar.',
  'auth/requires-recent-login': 'Por segurança, confirme sua identidade e tente de novo.',
  'auth/operation-not-allowed': 'Este tipo de login não está ativado no Firebase.',
  'auth/unauthorized-domain': 'Este domínio não está autorizado no Firebase.',
  'permission-denied': 'Você não tem permissão para acessar esses dados.',
  unavailable: 'Sem conexão com o servidor. Tente novamente.',
  'deadline-exceeded': 'O servidor demorou para responder. Tente novamente.',
};

export function translateFirebaseError(error: unknown): string {
  const code = (error as { code?: unknown } | null)?.code;
  if (typeof code === 'string') {
    const message = MESSAGES[code] ?? MESSAGES[code.replace(/^firestore\//, '')];
    if (message) return message;
  }
  if (error instanceof Error && error.message && !/firebase/i.test(error.message)) return error.message;
  return 'Algo deu errado. Tente novamente.';
}

/** Executa a operação e troca erros do Firebase por mensagens em português. */
export async function withFriendlyErrors<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw new Error(translateFirebaseError(error), { cause: error });
  }
}
