import { Stack, Button, IconButton, Tooltip } from '@mui/material';
import { Phone, Email, OpenInNew } from '@mui/icons-material';

const PHONE_NUMBER = '070-4303-2374';

const MAILTO_HREF =
  'mailto:takumi.sato@aice.co.jp?subject=' +
  encodeURIComponent('手紙デモ お問い合わせ') +
  '&body=' +
  encodeURIComponent('ご興味がありましたら、このままご送信ください。折り返しご連絡いたします。');

const CONTACT_URL = 'https://aice.co.jp/contact';

export default function CtaButtons() {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Tooltip title={`電話する ${PHONE_NUMBER}`}>
        <IconButton
          component="a"
          href={`tel:${PHONE_NUMBER.replace(/-/g, '')}`}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <Phone fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="メールする">
        <IconButton
          component="a"
          href={MAILTO_HREF}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <Email fontSize="small" />
        </IconButton>
      </Tooltip>

      <Button
        component="a"
        href={CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        size="small"
        startIcon={<OpenInNew sx={{ fontSize: 16 }} />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          py: 0.25,
          px: 1.5,
          fontSize: '0.8rem',
          ml: 0.5,
        }}
      >
        お問い合わせ
      </Button>
    </Stack>
  );
}
