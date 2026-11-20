import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { ROUTES } from './routes';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { WeekPage } from '@/features/planning/pages/WeekPage';
import { TasksPage } from '@/features/tasks/pages/TasksPage';
import { RoutinePage } from '@/features/routine/pages/RoutinePage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';

export const routes: RouteObject[] = [
  { path: ROUTES.login, element: <LoginPage /> },
  { path: ROUTES.register, element: <RegisterPage /> },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: ROUTES.week, element: <WeekPage /> },
      { path: ROUTES.tasks, element: <TasksPage /> },
      { path: ROUTES.routine, element: <RoutinePage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
