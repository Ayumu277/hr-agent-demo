import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const AgentPage = lazy(() => import('./features/agent/AgentPage'));
const GoRedirectPage = lazy(() => import('./features/auth/GoRedirectPage'));

function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );
}

const router = createBrowserRouter([
  { path: '/go', element: <Suspense fallback={<Loading />}><GoRedirectPage /></Suspense> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><AgentPage /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<Loading />}><DashboardPage /></Suspense> },
    ],
  },
]);

export default router;
