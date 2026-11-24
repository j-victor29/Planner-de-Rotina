import type { ReactNode } from 'react';
import { ServicesContext } from './ServicesContext';
import type { AppServices } from '@/services';

interface ServicesProviderProps {
  services: AppServices;
  children: ReactNode;
}

export function ServicesProvider({ services, children }: ServicesProviderProps) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
