import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export function App() {
  // Etapa 2: envolver com <ServicesProvider services={createServices(...)}>.
  return <RouterProvider router={router} />;
}
