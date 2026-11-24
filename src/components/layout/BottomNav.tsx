import { NavLink } from 'react-router-dom';
import styles from './layout.module.css';
import { NAV_ITEMS } from './navItems';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/utils/cx';

/** Menu inferior (celular). */
export function BottomNav() {
  return (
    <nav aria-label="Menu inferior" className={styles.bottomNav}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) => cx(styles.bottomLink, isActive && styles.active)}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
