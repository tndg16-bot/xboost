# エージェント並列起動プロンプト集

---

## 1つのエージェントを起動

```javascript
task({
  description: "タスク",
  prompt: "あなたはエージェントAです。\n\nタスク: [ここにタスクを書く]\n\n1時間ごとに進捗を報告してください。",
  subagent_type: "general",
  tools: { "background_task": false }
})
```

---

## 2つのエージェントを並列起動

```javascript
// エージェントAを起動
task({
  description: "タスクA",
  prompt: "あなたはエージェントAです。\n\nタスク: [タスクAの内容]",
  subagent_type: "general",
  tools: { "background_task": false }
})

// エージェントBを起動（並列実行）
task({
  description: "タスクB",
  prompt: "あなたはエージェントBです。\n\nタスク: [タスクBの内容]",
  subagent_type: "general",
  tools: { "background_task": false }
})
```

---

## 3つのエージェントを並列起動

```javascript
// エージェントAを起動
task({
  description: "タスクA",
  prompt: "あなたはエージェントAです。\n\nタスク: [タスクAの内容]",
  subagent_type: "general",
  tools: { "background_task": false }
})

// エージェントBを起動（並列実行）
task({
  description: "タスクB",
  prompt: "あなたはエージェントBです。\n\nタスク: [タスクBの内容]",
  subagent_type: "general",
  tools: { "background_task": false }
})

// エージェントCを起動（並列実行）
task({
  description: "タスクC",
  prompt: "あなたはエージェントCです。\n\nタスク: [タスクCの内容]",
  subagent_type: "general",
  tools: { "background_task": false }
})
```

---

## 4つのエージェントを並列起動

```javascript
// エージェントA
task({
  description: "タスクA",
  prompt: "あなたはエージェントAです。\n\nタスク: [タスクAの内容]",
  subagent_type: "general"
})

// エージェントB（並列）
task({
  description: "タスクB",
  prompt: "あなたはエージェントBです。\n\nタスク: [タスクBの内容]",
  subagent_type: "general"
})

// エージェントC（並列）
task({
  description: "タスクC",
  prompt: "あなたはエージェントCです。\n\nタスク: [タスクCの内容]",
  subagent_type: "general"
})

// エージェントD（並列）
task({
  description: "タスクD",
  prompt: "あなたはエージェントDです。\n\nタスク: [タスクDの内容]",
  subagent_type: "general"
})
```

---

## 異なる種類のエージェントを並列起動

```javascript
// 探索エージェント
task({
  description: "調査",
  prompt: "以下の機能を調査してください: [内容]",
  subagent_type: "explore"
})

// 実装エージェント（並列）
task({
  description: "実装",
  prompt: "調査結果を元に実装してください: [内容]",
  subagent_type: "general"
})

// ドキュメントエージェント（並列）
task({
  description: "ドキュメント",
  prompt: "実装内容を元にドキュメントを作成: [内容]",
  subagent_type: "general"
})
```

---

## 以上

これだけです。コピペして使ってください。
