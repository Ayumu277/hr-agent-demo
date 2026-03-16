import { useState, useEffect, type KeyboardEvent } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  pendingText?: string;
}

export default function ChatInput({ onSend, disabled, pendingText }: Props) {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (pendingText) {
      setInput(pendingText);
      const timer = setTimeout(() => {
        onSend(pendingText);
        setInput('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingText, onSend]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
      <TextField
        fullWidth multiline maxRows={4}
        placeholder="メッセージを入力..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        size="small"
      />
      <IconButton color="primary" onClick={handleSend} disabled={disabled || !input.trim()}>
        <Send />
      </IconButton>
    </Box>
  );
}
