import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

/** Menu lateral (desktop). Estilo: etapa 2. */
export function Sidebar() {
  return (
    <nav data-component="Sidebar" aria-label="Menu principal">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
