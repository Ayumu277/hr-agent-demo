import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton, Stack } from '@mui/material';
import { SmartToy, RestartAlt } from '@mui/icons-material';
import { useScenarioPlayer } from './useScenarioPlayer';
import ChatMessage from './components/ChatMessage';
import ToolExecution from './components/ToolExecution';
import ChatInput from './components/ChatInput';
import ScenarioChips from './components/ScenarioChips';

export default function AgentPage() {
  const { messages, isPlaying, playScenario, resetChat } = useScenarioPlayer();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingText, setPendingText] = useState<string | undefined>();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    setPendingText(undefined);
    playScenario(text);
  };

  const handleChipSelect = (trigger: string) => {
    setPendingText(undefined);
    setTimeout(() => setPendingText(trigger), 0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)' }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <SmartToy color="primary" />
        <Typography variant="h5" fontWeight="bold">AIエージェント</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={resetChat} size="small" title="リセット">
          <RestartAlt />
        </IconButton>
      </Stack>

      <Box sx={{ mb: 2 }}>
        <ScenarioChips onSelect={handleChipSelect} disabled={isPlaying} />
      </Box>

      <Paper
        ref={scrollRef}
        elevation={0}
        sx={{
          flexGrow: 1, overflow: 'auto', p: 2,
          bgcolor: 'white', border: 1, borderColor: 'grey.200',
          borderRadius: 2, mb: 2,
        }}
      >
        {messages.length === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
            <SmartToy sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
            <Typography variant="body2">上のシナリオを選択するか、メッセージを入力してください</Typography>
          </Box>
        )}
        {messages.map((msg) =>
          msg.type === 'tool_call' ? (
            <ToolExecution key={msg.id} message={msg} />
          ) : (
            <ChatMessage key={msg.id} message={msg} />
          ),
        )}
      </Paper>

      <ChatInput onSend={handleSend} disabled={isPlaying} pendingText={pendingText} />
    </Box>
  );
}
