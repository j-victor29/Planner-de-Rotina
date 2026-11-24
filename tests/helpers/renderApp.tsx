import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers/AppProviders';
import { routes } from '@/app/router';
import { createDemoServices, createMockServices, memoryStore } from '@/infra/mock';

/** Renderiza o app inteiro com dados em memória, na rota pedida. */
export function renderApp(path = '/') {
  const services = createMockServices({ store: memoryStore() });
  const demoServices = createDemoServices(new Date());
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const view = render(
    <AppProviders services={services} demoServices={demoServices}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...view, services, router };
}
