import type { ReactNode } from 'react';
import { PlannerProvider } from './PlannerProvider';
import { ServicesProvider } from './ServicesProvider';
import { SessionProvider } from './SessionProvider';
import type { AppServices, DataServices } from '@/services';

interface AppProvidersProps {
  services: AppServices;
  /** Dados da demonstração (opcional; os testes passam dados fixos). */
  demoServices?: DataServices;
  children: ReactNode;
}

export function AppProviders({ services, demoServices, children }: AppProvidersProps) {
  return (
    <ServicesProvider services={services}>
      <SessionProvider>
        <PlannerProvider demoServices={demoServices}>{children}</PlannerProvider>
      </SessionProvider>
    </ServicesProvider>
  );
}
