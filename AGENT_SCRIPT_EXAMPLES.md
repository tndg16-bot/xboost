# エージェント起動スクリプト例

作成日: 2026-01-23

---

## 📋 目次

1. [基本起動スクリプト](#基本起動スクリプト)
2. [並列起動スクリプト](#並列起動スクリプト)
3. [タスク完了待ちスクリプト](#タスク完了待ちスクリプト)
4. [進捗監視スクリプト](#進捗監視スクリプト)

---

## 基本起動スクリプト

### シンプルなエージェント起動

```javascript
// エージェントAを起動
task({
  description: "エージェントAのタスク",
  prompt: "あなたはエージェントAです。\n\nタスク: タスクの説明\n\n1時間ごとに進捗を報告してください。",
  subagent_type: "general",
  tools: { background_task: false }
})
```

### 詳細なタスク指示付き

```javascript
task({
  description: "TypeScriptエラー修正",
  prompt: `あなたはエージェントCです。TypeScriptエラーの修正を担当します。

## タスク
以下のファイルのTypeScriptエラーを修正してください：
- app/page.tsx
- components/Header.tsx

## 手順
1. ファイルを開く
2. エラーを確認
3. 修正する
4. 検証する

## 検証
npm run typecheck

## 進捗報告
1時間ごとに以下のフォーマットで報告してください：
\`\`\`
## 進捗報告
エージェント: C
タスクID: C-1
アクション: 進捗更新
詳細: [修正したファイル、残りのエラー]
\`\`\`
`,
  subagent_type: "general",
  tools: { background_task: false }
})
```

---

## 並列起動スクリプト

### 3つのエージェントを並列で起動

```javascript
// エージェントAを起動
task({
  description: "エージェントA - API実装",
  prompt: "あなたはエージェントAです。API実装を担当します。\n\nタスク: APIエンドポイントの実装\n\n詳細: ...",
  subagent_type: "general"
})

// エージェントBを起動（並列実行）
task({
  description: "エージェントB - テスト",
  prompt: "あなたはエージェントBです。テストを担当します。\n\nタスク: ユニットテストの実装\n\n詳細: ...",
  subagent_type: "general"
})

// エージェントCを起動（並列実行）
task({
  description: "エージェントC - UI実装",
  prompt: "あなたはエージェントCです。UI実装を担当します。\n\nタスク: コンポーネントの実装\n\n詳細: ...",
  subagent_type: "general"
})
```

### 異なる種類のエージェントを起動

```javascript
// 探索エージェントを起動
task({
  description: "コードベース調査",
  prompt: "以下の機能が実装されているか調査してください：...",
  subagent_type: "explore"
})

// ライブラリアンを起動
task({
  description: "外部リソース調査",
  prompt: "Next.js 16の最新ドキュメントを調査してください...",
  subagent_type: "librarian"
})

// 一般エージェントを起動
task({
  description: "機能実装",
  prompt: "調査結果を元に機能を実装してください...",
  subagent_type: "general"
})
```

---

## タスク完了待ちスクリプト

### 背景タスクとしての起動

```javascript
// 長時間タスクを背景で実行
const backgroundResult = background_task({
  agent: "general",
  description: "長時間タスク",
  prompt: "長時間かかるタスクを実行してください...",
  run_in_background: true
})

// task_idを取得
const taskId = backgroundResult.task_id
console.log("Task ID:", taskId)
```

### 背景タスクの結果を取得

```javascript
// 背景タスクの結果を待つ
const result = background_output({
  task_id: "bg_xxx",
  block: true,  // 完了を待つ
  timeout: 60000  // タイムアウト（ミリ秒）
})

console.log("Result:", result)
```

### 背景タスクのポーリング

```javascript
// 背景タスクを定期的に確認
function checkTaskStatus(taskId) {
  const result = background_output({
    task_id: taskId,
    block: false  // 完了を待たない
  })

  if (result.status === "completed") {
    console.log("Task completed!")
    return result
  } else {
    console.log("Task still running...")
    // 1秒後に再確認
    setTimeout(() => checkTaskStatus(taskId), 1000)
  }
}

// チェックを開始
checkTaskStatus("bg_xxx")
```

---

## 進捗監視スクリプト

### 定期的な進捗確認

```javascript
// エージェントを起動
task({
  description: "エージェントAのタスク",
  prompt: "...",
  subagent_type: "general"
})

// 1時間ごとに進捗を確認
setInterval(() => {
  console.log("エージェントAの進捗を確認中...")
  // PROGRESS_DASHBOARD.mdを読み込む
  // 進捗を表示
}, 3600000)  // 1時間 = 3600000ミリ秒
```

### すべてのエージェントの進捗を監視

```javascript
// すべてのエージェントを並列で起動
task({
  description: "エージェントA",
  prompt: "...",
  subagent_type: "general"
})

task({
  description: "エージェントB",
  prompt: "...",
  subagent_type: "general"
})

task({
  description: "エージェントC",
  prompt: "...",
  subagent_type: "general"
})

// 30分ごとにすべてのエージェントの進捗を確認
setInterval(() => {
  console.log("=== 進捗レポート ===")
  console.log("エージェントA: [進捗]")
  console.log("エージェントB: [進捗]")
  console.log("エージェントC: [進捗]")
  console.log("====================")
}, 1800000)  // 30分 = 1800000ミリ秒
```

---

## 実用的なワークフロー例

### ワークフロー1: 調査 → 実装

```javascript
// Step 1: 調査
task({
  description: "コードベース調査",
  prompt: "以下の機能がどこで実装されているか調査してください：...",
  subagent_type: "explore"
})

// Step 2: 実装（調査結果に基づいて）
task({
  description: "機能実装",
  prompt: "調査結果を元に、新機能を実装してください...",
  subagent_type: "general"
})
```

### ワークフロー2: 並列開発

```javascript
// 並列で異なるモジュールを開発
task({
  description: "モジュールA実装",
  prompt: "...",
  subagent_type: "general"
})

task({
  description: "モジュールB実装",
  prompt: "...",
  subagent_type: "general"
})

task({
  description: "モジュールC実装",
  prompt: "...",
  subagent_type: "general"
})

// すべて完了後に統合
task({
  description: "統合テスト",
  prompt: "すべてのモジュールを統合し、テストしてください...",
  subagent_type: "general"
})
```

### ワークフロー3: 課題解決のサイクル

```javascript
// 課題の特定
task({
  description: "課題の調査",
  prompt: "プロジェクトの課題を特定してください...",
  subagent_type: "explore"
})

// 解決策の提案
task({
  description: "解決策の検討",
  prompt: "特定された課題に対する解決策を提案してください...",
  subagent_type: "oracle"
})

// 実装
task({
  description: "解決策の実装",
  prompt: "提案された解決策を実装してください...",
  subagent_type: "general"
})

// 検証
task({
  description: "検証",
  prompt: "実装した解決策を検証してください...",
  subagent_type: "general"
})
```

---

## エラーハンドリング

### エージェントが失敗した場合のリトライ

```javascript
function startAgentWithRetry(prompt, maxRetries = 3) {
  let retries = 0

  function tryStart() {
    task({
      description: "タスク実行",
      prompt: prompt,
      subagent_type: "general",
      onFailure: () => {
        retries++
        if (retries < maxRetries) {
          console.log(`リトライ ${retries}/${maxRetries}`)
          setTimeout(tryStart, 5000)
        } else {
          console.log("最大リトライ回数に達しました")
        }
      }
    })
  }

  tryStart()
}
```

### タイムアウトの実装

```javascript
function startAgentWithTimeout(prompt, timeout = 3600000) {
  return Promise.race([
    task({ description: "タスク", prompt, subagent_type: "general" }),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error("タイムアウト")), timeout)
    )
  ])
}
```

---

## まとめ

このスクリプト例を使用すると、以下のことができます：

1. エージェントの起動
2. 並列実行
3. タスクの監視
4. 進捗の確認
5. エラーハンドリング

---

**作成日**: 2026-01-23
**バージョン**: 1.0
