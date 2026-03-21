import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * QR code landing page: /go?c=004&u=1
 * Stores tracking params in localStorage and redirects to the main page.
 */
export default function GoRedirectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const companyId = searchParams.get('c');
    const userId = searchParams.get('u');

    if (companyId) localStorage.setItem('qr_company_id', companyId);
    if (userId) localStorage.setItem('qr_user_id', userId);
    localStorage.setItem('qr_scanned_at', new Date().toISOString());

    navigate('/', { replace: true });
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565c0 0%, #003c8f 100%)',
      }}
    >
      <CircularProgress sx={{ color: 'white', mb: 2 }} />
      <Typography sx={{ color: 'white' }}>デモ画面を読み込み中...</Typography>
    </Box>
  );
}
