import { NavLink } from 'react-router-dom';
import { Brand } from './Brand';
import styles from './layout.module.css';
import { NAV_ITEMS } from './navItems';
import { UserArea } from './UserArea';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/utils/cx';

/** Menu lateral (desktop). */
export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Brand />
      <nav aria-label="Menu principal" className={styles.sideNav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) => cx(styles.sideLink, isActive && styles.active)}
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <UserArea />
    </aside>
  );
}
