import { useState } from 'react';
import {
  Dialog, Drawer, Box, Typography, TextField, Button,
  IconButton, CircularProgress, useMediaQuery, useTheme,
} from '@mui/material';
import { Close, CheckCircleOutline } from '@mui/icons-material';
import companiesMap from '../../../data/companies.json';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

type FormState = 'input' | 'sending' | 'done' | 'error';

const GAS_URL = import.meta.env.VITE_GAS_URL ?? '';

function getTrackingParams() {
  return {
    companyId: localStorage.getItem('qr_company_id') ?? '',
    userId: localStorage.getItem('qr_user_id') ?? '',
  };
}

function getCompanyName(companyId: string): string | null {
  return (companiesMap as Record<string, string>)[companyId] ?? null;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('input');
  const [emailError, setEmailError] = useState('');

  const { companyId, userId } = getTrackingParams();
  const companyName = getCompanyName(companyId);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('メールアドレスを入力してください');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('正しいメールアドレスを入力してください');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) return;

    setFormState('sending');

    try {
      // GASのWeb APIは302リダイレクトを経由する。
      // Content-Type: text/plain でプリフライトを回避し、redirect: 'follow' でリダイレクトに追従。
      await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        redirect: 'follow',
        body: JSON.stringify({
          email,
          message,
          companyId,
          userId,
          companyName: companyName ?? '',
          timestamp: new Date().toISOString(),
        }),
      });

      // GASのリダイレクト後のレスポンスはopaqueになる場合があるため、
      // fetchが例外を投げなければ成功とみなす。
      setFormState('done');
    } catch {
      setFormState('error');
    }
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setFormState('input');
    setEmailError('');
    onClose();
  };

  const content = (
    <Box sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h6" fontWeight="bold">お問い合わせ</Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </Box>

      {formState === 'done' ? (
        /* ── 完了画面 ── */
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleOutline sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            お問い合わせありがとうございます
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            1営業日以内にご連絡いたします
          </Typography>
          <Button variant="contained" onClick={handleClose} sx={{ borderRadius: 3 }}>
            閉じる
          </Button>
        </Box>
      ) : (
        /* ── 入力画面 ── */
        <>
          {/* 送信を促すメッセージ */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            少しでも興味があれば、そのまま送信してください。1営業日以内にご連絡します。
          </Typography>

          {/* 会社名（自動表示） */}
          {companyName && (
            <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 2, mb: 2, border: 1, borderColor: 'grey.200' }}>
              <Typography variant="caption" color="text.secondary">ご所属（お手紙の情報より）</Typography>
              <Typography variant="body2">{companyName}</Typography>
            </Box>
          )}

          {/* メールアドレス */}
          <TextField
            label="メールアドレス"
            type="email"
            required
            fullWidth
            size="small"
            placeholder="example@company.co.jp"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 2 }}
          />

          {/* フリーテキスト */}
          <TextField
            label="ご相談内容（任意）"
            multiline
            rows={3}
            fullWidth
            size="small"
            placeholder="気になっていること、聞いてみたいことなどあればお気軽に"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            helperText={`${message.length}/500`}
            sx={{ mb: 2.5 }}
          />

          {/* 送信ボタン */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={formState === 'sending'}
            sx={{ borderRadius: 3, py: 1.5, fontWeight: 600 }}
          >
            {formState === 'sending' ? <CircularProgress size={24} color="inherit" /> : '送信する'}
          </Button>

          {/* エラー表示 */}
          {formState === 'error' && (
            <Typography variant="body2" color="error" sx={{ mt: 1.5, textAlign: 'center' }}>
              送信に失敗しました。お手数ですが{' '}
              <a href="mailto:takumi.sato@aice.co.jp" style={{ color: 'inherit' }}>
                メール
              </a>
              でご連絡ください。
            </Typography>
          )}

          {/* プライバシー文言 + 会社リンク */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}>
            ご入力いただいた情報は、お問い合わせ対応のみに使用いたします
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
            <a href="https://aice.co.jp/" target="_blank" rel="noopener noreferrer"
              style={{ color: '#6366f1', textDecoration: 'none' }}>
              AICE株式会社 公式サイト
            </a>
          </Typography>
        </>
      )}
    </Box>
  );

  // モバイル: ボトムシート（Drawer）、デスクトップ: 中央ダイアログ
  if (isMobile) {
    return (
      <Drawer anchor="bottom" open={open} onClose={handleClose}
        PaperProps={{ sx: { borderRadius: '16px 16px 0 0', maxHeight: '90vh' } }}>
        {content}
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}>
      {content}
    </Dialog>
  );
}
