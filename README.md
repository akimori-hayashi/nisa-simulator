# つみたてNISA 複利シミュレーター

毎月の積立金額・利回り・期間を入力して、つみたてNISAの複利効果をシミュレーションするWebアプリです。非課税メリットの可視化や、Claude AIによる結果解説機能も搭載しています。

## 機能

- 月々の積立金額・年間利回り・積立期間・開始年齢・現在の保有資産を入力
- リアルタイムで複利計算と結果表示
- 積み立て推移グラフ（面積グラフ）
- 元本 vs 運用益の内訳円グラフ
- 年別詳細テーブル
- Claude AIによる結果のわかりやすい解説（ストリーミング）
- URLクエリパラメータでシミュレーション設定を共有
- レスポンシブデザイン（スマホ・タブレット・PC対応）

## 使用技術

| 技術 | バージョン |
|------|-----------|
| Next.js | 14 (App Router) |
| TypeScript | 5.x |
| Tailwind CSS | 3.x |
| Recharts | 最新 |
| @anthropic-ai/sdk | 最新 |

## ローカル開発手順

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd nisa-simulator
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、APIキーを設定します。

```bash
cp .env.local.example .env.local
```

`.env.local` を編集:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Anthropic APIキーは [https://console.anthropic.com/](https://console.anthropic.com/) から取得できます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## Vercelデプロイ手順

### 1. GitHubリポジトリに接続

[Vercel Dashboard](https://vercel.com/dashboard) にアクセスし、「New Project」からGitHubリポジトリをインポートします。

### 2. 環境変数の設定

Vercelプロジェクトの「Settings」→「Environment Variables」で以下を設定します。

| 変数名 | 値 |
|--------|-----|
| `ANTHROPIC_API_KEY` | Anthropic APIキー |

### 3. デプロイ

「Deploy」ボタンをクリックするとデプロイが開始されます。

または、Vercel CLIを使用する場合:

```bash
npm install -g vercel
vercel --prod
```

## プロジェクト構成

```
/
├── app/
│   ├── layout.tsx          # ルートレイアウト（メタデータ・フォント設定）
│   ├── page.tsx            # メインページ
│   ├── globals.css         # グローバルスタイル
│   └── api/
│       └── explain/
│           └── route.ts    # Claude APIエンドポイント（ストリーミング）
├── components/
│   ├── SimulatorForm.tsx   # 入力フォーム（スライダー）
│   ├── ResultSummary.tsx   # 結果サマリーカード
│   ├── GrowthChart.tsx     # 積み立て推移グラフ（AreaChart）
│   ├── BreakdownChart.tsx  # 内訳円グラフ（PieChart）
│   ├── YearlyTable.tsx     # 年別詳細テーブル
│   ├── AiExplanation.tsx   # Claude AI解説コンポーネント
│   └── ShareButton.tsx     # URL共有ボタン
├── lib/
│   └── calculator.ts       # 複利計算ロジック
├── types/
│   └── index.ts            # TypeScript型定義
├── .env.local.example      # 環境変数サンプル
├── vercel.json             # Vercel設定
└── README.md
```

## 注意事項

このシミュレーターは参考値を提供するものであり、実際の運用成果を保証するものではありません。投資は自己責任で行い、必要に応じて専門家にご相談ください。
