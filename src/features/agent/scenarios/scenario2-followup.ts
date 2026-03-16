import type { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'followup',
  label: 'スタッフフォローアップ',
  trigger: '今月末で契約切れるスタッフのフォローお願い',
  keywords: ['フォロー', '契約切れ', '契約終了', '期限切れ', '次の案件'],
  steps: [
    { type: 'assistant', delay: 1000, content: '今月末で契約終了のスタッフを確認します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_expiring_contracts', toolResult: '3月末終了の契約4件（スタッフ4名）を検出' },
    { type: 'assistant', delay: 1000, content: '4名のスタッフの契約が今月末で終了します。次の案件候補を検索します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_jobs', toolResult: '各スタッフのスキルに合う案件候補を計8件抽出' },
    { type: 'tool_call', delay: 1500, toolName: 'email_send_draft', toolResult: '4名分のフォローメールドラフトを作成' },
    {
      type: 'assistant',
      delay: 1000,
      content: `フォロー対象のスタッフと次の案件候補をまとめました。

■ 山田一郎（3/31契約終了・フォークリフト資格）
  候補案件: 倉庫B ピッキング作業（時給1,400円）、物流C 入出庫管理（時給1,500円）
  → フォローメールを作成しました

■ 渡辺美紀（3/31契約終了・事務経験5年）
  候補案件: メーカーD 営業事務（時給1,350円）、商社E 受発注業務（時給1,400円）
  → フォローメールを作成しました

■ 木村健太（3/28契約終了・IT系スキル）
  候補案件: SIer F ヘルプデスク（時給1,600円）
  → フォローメールを作成しました

■ 中村さくら（3/31契約終了・接客経験）
  候補案件: 百貨店G 販売スタッフ（時給1,300円）、ホテルH フロント（時給1,350円）
  → フォローメールを作成しました`,
    },
  ],
};

export default scenario;
