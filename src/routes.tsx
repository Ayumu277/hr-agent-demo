import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const AgentPage = lazy(() => import('./features/agent/AgentPage'));

function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );
}

const router = createBrowserRouter([
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
