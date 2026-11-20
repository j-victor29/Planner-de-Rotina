import { createContext, useContext } from 'react';
import type { AppServices } from '@/services';

export const ServicesContext = createContext<AppServices | null>(null);

/** Acesso aos serviços dentro de componentes. */
export function useServices(): AppServices {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('useServices precisa estar dentro de <ServicesProvider>');
  return services;
}
