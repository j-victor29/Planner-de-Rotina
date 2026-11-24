import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { ROUTES } from './routes';
import { AppLayout } from '@/components/layout/AppLayout';
import { OnboardingPage } from '@/features/auth/OnboardingPage';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { WeekPage } from '@/features/planning/WeekPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { RoutinePage } from '@/features/routine/RoutinePage';
import { TasksPage } from '@/features/tasks/TasksPage';

/**
 * Todas as páginas ficam abertas: sem login elas mostram a demonstração,
 * e qualquer ação pede para entrar. Só o passo a passo exige conta.
 */
export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.week, element: <WeekPage /> },
      { path: ROUTES.tasks, element: <TasksPage /> },
      { path: ROUTES.routine, element: <RoutinePage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
      {
        path: ROUTES.onboarding,
        element: (
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <Navigate to={ROUTES.week} replace /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
