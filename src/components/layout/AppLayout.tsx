import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

/** Estrutura das páginas logadas: menu lateral (desktop) ou inferior (celular). */
export function AppLayout() {
  return (
    <div data-component="AppLayout">
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
