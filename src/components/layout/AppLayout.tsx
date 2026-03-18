import { Box, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SmartToy, Dashboard } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

export default function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isDesktop && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 3 },
          width: isDesktop ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          bgcolor: 'background.default',
          pb: isDesktop ? undefined : 'calc(56px + env(safe-area-inset-bottom))',
        }}
      >
        <Outlet />
      </Box>
      {!isDesktop && (
        <BottomNavigation
          value={location.pathname}
          onChange={(_event, newValue) => navigate(newValue)}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            pb: 'env(safe-area-inset-bottom)',
            height: 'calc(56px + env(safe-area-inset-bottom))',
            zIndex: theme.zIndex.appBar,
            boxShadow: 3,
          }}
        >
          <BottomNavigationAction label="AIエージェント" value="/" icon={<SmartToy />} />
          <BottomNavigationAction label="ダッシュボード" value="/dashboard" icon={<Dashboard />} />
        </BottomNavigation>
      )}
    </Box>
  );
}
