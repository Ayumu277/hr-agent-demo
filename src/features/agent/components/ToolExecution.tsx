import { Box, Typography, CircularProgress } from '@mui/material';
import {
  CheckCircle, Storage, Email, CalendarMonth, FolderOpen,
} from '@mui/icons-material';
import type { ChatMessage, ToolCategory } from '../scenarios/types';

interface Props {
  message: ChatMessage;
}

const categoryConfig: Record<ToolCategory, { icon: typeof Storage; color: string; bgColor: string }> = {
  db: { icon: Storage, color: '#1976d2', bgColor: '#e3f2fd' },
  email: { icon: Email, color: '#2e7d32', bgColor: '#e8f5e9' },
  calendar: { icon: CalendarMonth, color: '#ed6c02', bgColor: '#fff3e0' },
  file: { icon: FolderOpen, color: '#9c27b0', bgColor: '#f3e5f5' },
};

export default function ToolExecution({ message }: Props) {
  const isCompleted = message.toolStatus === 'completed';
  const category = message.toolCategory ?? 'db';
  const config = categoryConfig[category];
  const CategoryIcon = config.icon;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: { xs: 1, md: 1.5 }, ml: { xs: 3, md: 5 } }}>
      <Box
        sx={{
          border: 1,
          borderColor: isCompleted ? config.color : 'grey.300',
          borderRadius: 2, px: { xs: 1.5, md: 2 }, py: { xs: 0.75, md: 1 },
          bgcolor: isCompleted ? config.bgColor : 'transparent',
          minWidth: 280,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon sx={{ fontSize: { xs: 18, md: 24 }, color: config.color }} />
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: { xs: 13, md: 14 } }}>
            {message.toolName}
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isCompleted ? (
              <CheckCircle sx={{ fontSize: { xs: 18, md: 24 }, color: config.color }} />
            ) : (
              <>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">実行中...</Typography>
              </>
            )}
          </Box>
        </Box>
        {isCompleted && message.toolResult && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {message.toolResult}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
