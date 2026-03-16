import type { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'attendance',
  label: '勤怠異常検知→対応',
  trigger: '今週の勤怠で異常があれば対応して',
  keywords: ['勤怠', '異常', '出勤', '欠勤'],
  steps: [
    { type: 'assistant', delay: 1000, content: '今週の勤怠データを確認します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_attendance', toolResult: '今週の勤怠レコード156件をチェック。異常3件を検出' },
    { type: 'assistant', delay: 1000, content: '3件の勤怠異常を検出しました。対応を進めます。' },
    { type: 'tool_call', delay: 1500, toolName: 'email_send_notification', toolResult: '該当スタッフ3名に確認メールを送信' },
    { type: 'tool_call', delay: 1500, toolName: 'calendar_create_event', toolResult: '上長との面談予定を3件登録' },
    {
      type: 'assistant',
      delay: 1000,
      content: `勤怠異常への対応が完了しました。

■ 勤怠異常レポート

1. 田中太郎（物流センターA）
   異常: 3/13(木) 無断欠勤
   → 確認メールを送信済み
   → 面談予定: 3/17(月) 10:00 上長・鈴木マネージャー

2. 佐藤花子（コールセンター）
   異常: 3/11(火)-3/12(水) 残業時間超過（1日5時間超）
   → 確認メールを送信済み
   → 面談予定: 3/17(月) 14:00 上長・鈴木マネージャー

3. 高橋美咲（イベント会場）
   異常: 3/10(月) 打刻漏れ（退勤未記録）
   → 確認メールを送信済み
   → 面談予定: 3/18(火) 11:00 上長・山本リーダー`,
    },
  ],
};

export default scenario;
