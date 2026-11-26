import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { ROUTES } from './routes';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { WeekPage } from '@/features/planning/WeekPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { RoutinePage } from '@/features/routine/RoutinePage';
import { TasksPage } from '@/features/tasks/TasksPage';

/**
 * As páginas do app ficam abertas: sem login mostram a demonstração.
 * O passo a passo é uma tela cheia, fora do layout, e exige login.
 */
export const routes: RouteObject[] = [
  {
    path: ROUTES.onboarding,
    element: (
      <RequireAuth>
        <OnboardingPage />
      </RequireAuth>
    ),
  },
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.week, element: <WeekPage /> },
      { path: ROUTES.tasks, element: <TasksPage /> },
      { path: ROUTES.routine, element: <RoutinePage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
      { path: '*', element: <Navigate to={ROUTES.week} replace /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
