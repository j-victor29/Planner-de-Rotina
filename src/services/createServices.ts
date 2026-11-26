import type { AppServices } from './AppServices';
import { createFirebaseServices, type FirebaseServicesOptions } from '@/infra/firebase';
import { createMockServices } from '@/infra/mock';

export type DataSource = 'mock' | 'firebase';

/** Escolhe a implementação pela variável VITE_DATA_SOURCE (ver .env.example). */
export function createServices(source: DataSource, firebase?: FirebaseServicesOptions): AppServices {
  return source === 'firebase' ? createFirebaseServices(firebase) : createMockServices();
}
