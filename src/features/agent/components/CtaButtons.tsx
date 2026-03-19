import { Stack, Button, Typography } from '@mui/material';
import { Phone, Email, OpenInNew } from '@mui/icons-material';

const PHONE_NUMBER = '070-4303-2374';

const MAILTO_HREF = [
  'mailto:takumi.sato@aice.co.jp',
  '?subject=',
  encodeURIComponent('お手紙を拝見しました'),
  '&body=',
  encodeURIComponent('お手紙を拝見しご連絡いたしました。\nぜひ一度お話しさせていただければ幸いです。'),
].join('');

const CONTACT_URL = 'https://aice.co.jp/contact';

export default function CtaButtons() {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ mb: 1 }}
    >
      {/* 電話 */}
      <Button
        component="a"
        href={`tel:${PHONE_NUMBER.replace(/-/g, '')}`}
        variant="outlined"
        startIcon={<Phone />}
        fullWidth
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          py: 1,
          borderColor: 'grey.300',
          color: 'text.primary',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
        }}
      >
        <Typography component="span" variant="body2" fontWeight={600}>
          電話する
        </Typography>
        <Typography component="span" variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
          {PHONE_NUMBER}
        </Typography>
      </Button>

      {/* メール */}
      <Button
        component="a"
        href={MAILTO_HREF}
        variant="outlined"
        startIcon={<Email />}
        fullWidth
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          py: 1,
          borderColor: 'grey.300',
          color: 'text.primary',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
        }}
      >
        <Typography component="span" variant="body2" fontWeight={600}>
          メールする
        </Typography>
      </Button>

      {/* お問い合わせ */}
      <Button
        component="a"
        href={CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        startIcon={<OpenInNew />}
        fullWidth
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          py: 1,
        }}
      >
        <Typography component="span" variant="body2" fontWeight={600}>
          お問い合わせ
        </Typography>
      </Button>
    </Stack>
  );
}
