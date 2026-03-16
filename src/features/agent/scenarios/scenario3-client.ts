import type { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'client',
  label: 'クライアント対応',
  trigger: '新着メールの依頼を確認して、候補スタッフの提案書を作って',
  keywords: ['依頼', '提案書', '新着メール'],
  steps: [
    { type: 'assistant', delay: 1000, content: '新着メールを確認します。' },
    { type: 'tool_call', delay: 1500, toolName: 'email_read_inbox', toolResult: '未読メール3件。うち人材依頼が1件' },
    { type: 'assistant', delay: 1000, content: '株式会社ABCから経理スタッフ2名の依頼です。条件にマッチするスタッフを検索します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_staff', toolResult: '経理経験のある待機中スタッフ4名を抽出' },
    { type: 'tool_call', delay: 1500, toolName: 'file_save_proposal', toolResult: '提案書を作成し共有フォルダに保存' },
    {
      type: 'assistant',
      delay: 1000,
      content: `候補スタッフの提案書を作成しました。

■ 依頼内容（株式会社ABC 人事部 佐々木様）
  「経理スタッフ2名、4月1日から6ヶ月、簿記2級以上希望」

■ 候補スタッフ
  1. 小林直子（簿記2級・経理3年）★おすすめ
  2. 伊藤恵（簿記1級・経理5年）★おすすめ
  3. 松本翔太（簿記2級・経理1年）
  4. 加藤裕子（簿記2級・一般事務3年→経理半年）

■ 提案書を保存しました
  → //shared/proposals/ABC_経理スタッフ提案書_20260316.pdf`,
    },
  ],
};

export default scenario;
