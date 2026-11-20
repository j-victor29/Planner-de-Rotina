import type { ReactNode } from 'react';
import type { AppServices } from '@/services';
import { ServicesContext } from './ServicesContext';

interface ServicesProviderProps {
  services: AppServices;
  children: ReactNode;
}

export function ServicesProvider({ services, children }: ServicesProviderProps) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
