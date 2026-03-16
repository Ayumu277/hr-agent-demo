import type { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'fulfillment',
  label: '案件充足の自動化',
  trigger: '来週充足率が低い案件を調べて、マッチするスタッフをアサインして',
  keywords: ['充足', 'アサイン', 'マッチ'],
  steps: [
    { type: 'assistant', delay: 1000, content: '承知しました。来週の案件と充足率を確認します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_jobs', toolResult: '来週の案件15件を取得。充足率50%未満が3件' },
    { type: 'assistant', delay: 1000, content: '充足率が低い3件を特定しました。条件にマッチするスタッフを検索します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_staff', toolResult: '条件に合う待機中スタッフ6名を抽出' },
    { type: 'tool_call', delay: 1500, toolName: 'db_assign_staff', toolResult: '3件の案件に4名をアサイン' },
    {
      type: 'assistant',
      delay: 1000,
      content: `以下の案件にスタッフをアサインしました。

■ 物流センターA 仕分け作業（千葉県船橋市）
  → 田中太郎をアサイン｜充足率 50% → 100%

■ コールセンター 受電業務（東京都新宿区）
  → 佐藤花子、鈴木一郎をアサイン｜充足率 33% → 100%

■ イベント会場 設営補助（神奈川県横浜市）
  → 高橋美咲をアサイン｜充足率 0% → 50%

合計3件の案件に対し、4名のスタッフをアサインしました。`,
    },
  ],
};

export default scenario;
