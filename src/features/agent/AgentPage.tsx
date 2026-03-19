import { useRef, useEffect, useState } from 'react';
import {
  Box, Typography, Paper, IconButton, Stack, useMediaQuery, useTheme,
  Drawer, List, ListItemButton, ListItemText, ListItemIcon, Divider,
} from '@mui/material';
import { SmartToy, RestartAlt, Menu as MenuIcon, ChatBubbleOutline } from '@mui/icons-material';
import { useScenarioPlayer } from './useScenarioPlayer';
import ChatMessage from './components/ChatMessage';
import ToolExecution from './components/ToolExecution';
import ChatInput from './components/ChatInput';
import ScenarioChips from './components/ScenarioChips';
import CtaButtons from './components/CtaButtons';

const MOCK_HISTORY = [
  { id: '1', title: '案件充足の自動化について', date: '今日' },
  { id: '2', title: 'スタッフ山田さんのフォローアップ', date: '昨日' },
  { id: '3', title: 'クライアント請求確認', date: '3月14日' },
  { id: '4', title: '勤怠データの集計依頼', date: '3月13日' },
  { id: '5', title: '契約更新リマインド設定', date: '3月12日' },
];

export default function AgentPage() {
  const { messages, isPlaying, playScenario, resetChat } = useScenarioPlayer();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingText, setPendingText] = useState<string | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

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
    <>
      {/* Conversation History Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'background.default',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy color="primary" />
          <Typography variant="h6" fontWeight="bold">会話履歴</Typography>
        </Box>
        <Divider />
        <List sx={{ px: 1 }}>
          {MOCK_HISTORY.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ChatBubbleOutline fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                secondary={item.date}
                primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: isDesktop
          ? 'calc(100vh - 48px)'
          : 'calc(100vh - calc(56px + env(safe-area-inset-bottom) + 16px))',
        ...(!isDesktop && {
          '@supports (height: 100dvh)': {
            height: 'calc(100dvh - calc(56px + env(safe-area-inset-bottom) + 16px))',
          },
        }),
      }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          {!isDesktop && (
            <IconButton onClick={() => setDrawerOpen(true)} size="small" edge="start">
              <MenuIcon />
            </IconButton>
          )}
          <SmartToy color="primary" />
          <Typography variant={isDesktop ? 'h5' : 'h6'} fontWeight="bold">AIエージェント</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={resetChat} size="small" title="リセット">
            <RestartAlt />
          </IconButton>
        </Stack>

        {/* Chat area */}
        <Paper
          ref={scrollRef}
          elevation={0}
          sx={{
            flexGrow: 1, overflow: 'auto', p: 2,
            bgcolor: 'white', border: 1, borderColor: 'grey.200',
            borderRadius: 2, mb: 1,
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
              <SmartToy sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
              <Typography variant="body2">シナリオを選択するか、メッセージを入力してください</Typography>
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

        {/* CTA buttons */}
        <CtaButtons />

        {/* Scenario chips — now just above input */}
        <Box sx={{ mb: 1 }}>
          <ScenarioChips onSelect={handleChipSelect} disabled={isPlaying} />
        </Box>

        <ChatInput onSend={handleSend} disabled={isPlaying} pendingText={pendingText} />
      </Box>
    </>
  );
}
