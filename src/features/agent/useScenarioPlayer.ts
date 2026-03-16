import { useState, useRef, useCallback } from 'react';
import type { ChatMessage, ScenarioStep } from './scenarios/types';
import { getToolCategory } from './scenarios/types';
import { findScenario } from './scenarios';

export function useScenarioPlayer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const idCounterRef = useRef(0);

  const nextId = useCallback(() => `msg-${++idCounterRef.current}`, []);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const playScenario = useCallback(
    (userMessage: string) => {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), type: 'user', content: userMessage },
      ]);

      const scenario = findScenario(userMessage);
      if (!scenario) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            type: 'assistant',
            content: '申し訳ありません。以下のシナリオから選択してください。',
          },
        ]);
        return null;
      }

      setIsPlaying(true);
      clearTimeouts();

      let cumulativeDelay = 0;

      scenario.steps.forEach((step: ScenarioStep) => {
        cumulativeDelay += step.delay;

        if (step.type === 'tool_call') {
          const toolMsgId = nextId();
          const runningTimeout = setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: toolMsgId,
                type: 'tool_call',
                toolName: step.toolName,
                toolCategory: step.toolName ? getToolCategory(step.toolName) : undefined,
                toolStatus: 'running',
              },
            ]);
          }, cumulativeDelay);
          timeoutsRef.current.push(runningTimeout);

          cumulativeDelay += 1000;
          const completedTimeout = setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === toolMsgId
                  ? { ...msg, toolStatus: 'completed' as const, toolResult: step.toolResult }
                  : msg,
              ),
            );
          }, cumulativeDelay);
          timeoutsRef.current.push(completedTimeout);
        } else {
          const timeout = setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { id: nextId(), type: step.type, content: step.content },
            ]);
          }, cumulativeDelay);
          timeoutsRef.current.push(timeout);
        }
      });

      cumulativeDelay += 500;
      const doneTimeout = setTimeout(() => {
        setIsPlaying(false);
      }, cumulativeDelay);
      timeoutsRef.current.push(doneTimeout);

      return scenario;
    },
    [clearTimeouts, nextId],
  );

  const resetChat = useCallback(() => {
    clearTimeouts();
    setMessages([]);
    setIsPlaying(false);
    idCounterRef.current = 0;
  }, [clearTimeouts]);

  return { messages, isPlaying, playScenario, resetChat };
}
