import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

/** Menu inferior (celular). Estilo: etapa 2. */
export function BottomNav() {
  return (
    <nav data-component="BottomNav" aria-label="Menu inferior">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
