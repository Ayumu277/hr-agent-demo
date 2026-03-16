# hr-agent-demo モバイルファースト対応 — 設計書

## 概要

手紙DMのQRコードをスマホで読み取るユーザーが主要ターゲット。現在PC専用のデモを、モバイルファーストかつPCでも使えるレスポンシブ設計に変更する。

## アプローチ

**MUIレスポンシブ方式** — 既存コンポーネントに `useMediaQuery` と `sx` レスポンシブ値を追加。モバイル専用ビューの分離は行わず、同一コンポーネントで breakpoint により表示を切り替える。

## ブレイクポイント

MUI デフォルトの `md` (900px) で分岐:
- `< md` = モバイル
- `>= md` = PC（現状維持）

## 変更対象と設計

### 1. AppLayout.tsx — レイアウト構造

**PC（変更なし）:**
```
[Sidebar 240px] [Main Content]
```

**モバイル:**
```
[Main Content（全幅）]
[BottomNav: AIエージェント | ダッシュボード]
```

#### 変更内容

- `useMediaQuery(theme.breakpoints.up('md'))` で PC/モバイル判定
- **PC時**: 現状維持（`Sidebar` + `Main Content`）
- **モバイル時**:
  - `Sidebar` を非表示
  - `BottomNavigation` を追加（`position: fixed; bottom: 0`）
  - BottomNavigationAction 2つ: SmartToy（AIエージェント）、Dashboard（ダッシュボード）
  - Main content に `pb: '56px'`（BottomNav の高さ分）を追加
  - Main content の `width` を `100%` に（Sidebar 幅の引き算を除去）

### 2. Sidebar.tsx — サイドバー

- PC時: 現状維持（`variant="permanent"`、`DRAWER_WIDTH=240`）
- モバイル時: レンダリングしない（AppLayout 側で制御）

### 3. AgentPage.tsx — AIエージェントページ

#### height 調整
- PC: `height: 'calc(100vh - 48px)'`（現状維持）
- モバイル: `height: 'calc(100dvh - 56px)'`（BottomNav 分を考慮）

#### padding 調整
- PC: `p: 3`（AppLayout 側で制御）
- モバイル: `p: 1`

#### ヘッダー
- タイトルのフォントサイズ: `{ xs: 'h6', md: 'h5' }`

### 4. ScenarioChips.tsx — シナリオ選択チップ

#### モバイル（横スクロール）
```css
overflow-x: auto;
flex-wrap: nowrap;
-webkit-overflow-scrolling: touch;
scrollbar-width: none; /* Firefox */
&::-webkit-scrollbar { display: none; } /* Chrome/Safari */
```

#### PC
- 現状維持（`flex-wrap: wrap`）

### 5. ChatInput.tsx — チャット入力

- タップターゲット: 送信ボタンを最低 44x44px に
- モバイル時の入力欄: `size="medium"`（PC時は `size="small"` 維持）

### 6. ChatMessage.tsx / ToolExecution.tsx

- フォントサイズ: `{ xs: 13, md: 14 }` 程度の微調整
- マージン/パディング: モバイル時に詰める（`{ xs: 1, md: 2 }`）
- ToolExecution のアイコンサイズ: `{ xs: 18, md: 24 }`

### 7. DashboardPage.tsx — ダッシュボード

#### PC（変更なし）
DataGrid 3つ（スタッフ・案件・契約）

#### モバイル（カード形式）

`useMediaQuery(theme.breakpoints.up('md'))` で出し分け。

**スタッフカード:**
```
┌─────────────────────────┐
│ 田中太郎          稼働中  │
│ スキル: フォークリフト, 軽作業│
│ 派遣先: 物流センターA      │
└─────────────────────────┘
```

**案件カード:**
```
┌─────────────────────────┐
│ 物流センターA    募集中    │
│ 千葉県船橋市              │
│ ████░░░  2/4名 (50%)     │
└─────────────────────────┘
```

**契約カード:**
```
┌─────────────────────────┐
│ 山田一郎 × メーカーD  更新待ち│
│ 2025/10/01 〜 2026/03/31   │
└─────────────────────────┘
```

- 各セクション: `Accordion` で折りたたみ可能
- 初期状態: スタッフ一覧のみ展開
- カードは MUI `Card` + `CardContent` で実装
- ステータスは `Chip` で表示（DataGrid 版と同じ色分け）
- 充足率は `LinearProgress` で表示

### 8. リレーページ（/go/index.html）

#### モバイル検出時
- `location.replace(DEMO_URL)` で即座にデモ本体にリダイレクト
- QR scan tracking は リダイレクト前に `sendBeacon` で送信（既存コードで対応済み）

#### PC時
- 現状維持（「デモを開始する」ボタン表示）

#### 変更内容
- 既存の `isMobile` 判定ロジックを活用
- モバイル時のリダイレクトを有効化（現在 `if (false)` で無効化されている箇所を `if (isMobile)` に変更）

## 非スコープ

- PWA 対応（オフライン、ホーム画面追加）
- タブレット専用レイアウト（md breakpoint でPCと同じ扱い）
- 横向き（landscape）専用対応
- ダッシュボードのソート・フィルター機能追加
- テスト

## ファイル変更一覧

| ファイル | 変更内容 |
|---------|---------|
| `src/components/layout/AppLayout.tsx` | BottomNav 追加、モバイル時 Sidebar 非表示 |
| `src/components/layout/Sidebar.tsx` | 変更なし（AppLayout 側で制御） |
| `src/features/agent/AgentPage.tsx` | height/padding レスポンシブ化 |
| `src/features/agent/components/ScenarioChips.tsx` | モバイル横スクロール |
| `src/features/agent/components/ChatInput.tsx` | タップターゲット拡大 |
| `src/features/agent/components/ChatMessage.tsx` | フォント/余白微調整 |
| `src/features/agent/components/ToolExecution.tsx` | フォント/余白/アイコンサイズ微調整 |
| `src/features/dashboard/DashboardPage.tsx` | カード形式追加、useMediaQuery で切替 |
| `../../public/go/index.html` (リレーページ) | モバイル時リダイレクト有効化 |
