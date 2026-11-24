import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { createAppRouter } from './router';
import { createServices, type DataSource } from '@/services';

const dataSource: DataSource = import.meta.env.VITE_DATA_SOURCE === 'firebase' ? 'firebase' : 'mock';

export function App() {
  const services = useMemo(() => createServices(dataSource), []);
  const router = useMemo(() => createAppRouter(), []);
  return (
    <AppProviders services={services}>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
