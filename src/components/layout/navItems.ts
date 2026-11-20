import { ROUTES } from '@/app/routes';

/** Itens do menu (lateral no desktop, inferior no celular). */
export const NAV_ITEMS = [
  { to: ROUTES.week, label: 'Semana' },
  { to: ROUTES.tasks, label: 'Tarefas' },
  { to: ROUTES.routine, label: 'Rotina' },
  { to: ROUTES.profile, label: 'Perfil' },
] as const;
