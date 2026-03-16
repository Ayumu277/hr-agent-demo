import { Box, Paper, Avatar, Typography } from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';
import type { ChatMessage as ChatMessageType } from '../scenarios/types';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.type === 'user';
  return (
    <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', mb: 1.5 }}>
      {!isUser && (
        <Avatar sx={{ bgcolor: 'grey.400', mr: 1, width: 32, height: 32 }}>
          <SmartToy fontSize="small" />
        </Avatar>
      )}
      <Paper
        elevation={1}
        sx={{
          px: 2, py: 1, maxWidth: '75%',
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'white' : 'text.primary',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          {message.content}
        </Typography>
      </Paper>
      {isUser && (
        <Avatar sx={{ bgcolor: 'primary.main', ml: 1, width: 32, height: 32 }}>
          <Person fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
}
