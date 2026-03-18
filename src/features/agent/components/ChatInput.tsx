import { useState, useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react';
import {
  Box, TextField, IconButton, useMediaQuery, useTheme,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import { Send, AddCircleOutline, PhotoCamera, InsertDriveFile, Description } from '@mui/icons-material';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  pendingText?: string;
}

export default function ChatInput({ onSend, disabled, pendingText }: Props) {
  const [input, setInput] = useState('');
  const [attachMenuAnchor, setAttachMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('md'));
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAttachOpen = (e: MouseEvent<HTMLElement>) => {
    setAttachMenuAnchor(e.currentTarget);
  };

  const handleAttachClose = () => {
    setAttachMenuAnchor(null);
  };

  const handleAttachSelect = (type: string) => {
    handleAttachClose();
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'photo' ? 'image/*' : '*/*';
      fileInputRef.current.capture = type === 'photo' ? 'environment' : '';
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end' }}>
      <input type="file" ref={fileInputRef} hidden />

      <IconButton
        onClick={handleAttachOpen}
        disabled={disabled}
        sx={{ minWidth: 44, minHeight: 44, color: 'text.secondary' }}
      >
        <AddCircleOutline />
      </IconButton>
      <Menu
        anchorEl={attachMenuAnchor}
        open={Boolean(attachMenuAnchor)}
        onClose={handleAttachClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={() => handleAttachSelect('photo')}>
          <ListItemIcon><PhotoCamera fontSize="small" /></ListItemIcon>
          <ListItemText>写真</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAttachSelect('file')}>
          <ListItemIcon><InsertDriveFile fontSize="small" /></ListItemIcon>
          <ListItemText>ファイル</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAttachSelect('document')}>
          <ListItemIcon><Description fontSize="small" /></ListItemIcon>
          <ListItemText>ドキュメント</ListItemText>
        </MenuItem>
      </Menu>

      <TextField
        fullWidth multiline maxRows={4}
        placeholder="メッセージを入力..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        size={isMobile ? 'medium' : 'small'}
      />
      <IconButton color="primary" onClick={handleSend} disabled={disabled || !input.trim()} sx={{ minWidth: 44, minHeight: 44 }}>
        <Send />
      </IconButton>
    </Box>
  );
}
