import type { ScenarioDefinition } from './types';

const scenario: ScenarioDefinition = {
  id: 'contract',
  label: '契約更新業務',
  trigger: '来月期限の契約をまとめて更新手続きして',
  keywords: ['契約更新', '更新手続き', '更新書類'],
  steps: [
    { type: 'assistant', delay: 1000, content: '来月期限の契約を検索します。' },
    { type: 'tool_call', delay: 1500, toolName: 'db_search_expiring_contracts', toolResult: '4月末期限の契約5件を検出' },
    { type: 'assistant', delay: 1000, content: '5件の契約更新が必要です。更新書類を作成します。' },
    { type: 'tool_call', delay: 1500, toolName: 'file_generate_document', toolResult: '5件の契約更新書類を生成・保存' },
    { type: 'tool_call', delay: 1500, toolName: 'calendar_create_event', toolResult: '署名日程を5件登録' },
    {
      type: 'assistant',
      delay: 1000,
      content: `契約更新の手続きが完了しました。

■ 契約更新スケジュール

1. 吉田勇気 × 製造メーカーJ（4/30期限）
   更新書類: //shared/contracts/renewal_yoshida_20260401.pdf
   署名日程: 3/25(水) 15:00

2. 石井真理 × 食品工場K（4/30期限）
   更新書類: //shared/contracts/renewal_ishii_20260401.pdf
   署名日程: 3/26(木) 10:00

3. 藤田浩二 × 物流センターL（4/15期限）
   更新書類: //shared/contracts/renewal_fujita_20260401.pdf
   署名日程: 3/24(月) 13:00

4. 西村あかり × アパレルM（4/30期限）
   更新書類: //shared/contracts/renewal_nishimura_20260401.pdf
   署名日程: 3/27(金) 11:00

5. 岡田拓也 × IT企業N（4/30期限）
   更新書類: //shared/contracts/renewal_okada_20260401.pdf
   署名日程: 3/26(木) 14:00`,
    },
  ],
};

export default scenario;
