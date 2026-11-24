import { ROUTES } from '@/app/routes';
import type { IconName } from '@/components/ui/Icon';

/** Itens do menu (lateral no desktop, inferior no celular). */
export const NAV_ITEMS: { to: string; label: string; icon: IconName }[] = [
  { to: ROUTES.week, label: 'Semana', icon: 'calendar' },
  { to: ROUTES.tasks, label: 'Tarefas', icon: 'list' },
  { to: ROUTES.routine, label: 'Rotina', icon: 'repeat' },
  { to: ROUTES.profile, label: 'Perfil', icon: 'user' },
];
