# エージェントシステム - クイックスタート

作成日: 2026-01-23

---

## 🚀 5分で始めるエージェントシステム

### ステップ1: ドキュメントの作成（1分）

```bash
# 必要なドキュメントを作成
touch AGENT_TASKS.md
touch PROGRESS_DASHBOARD.md
touch USER_DASHBOARD.md
```

### ステップ2: エージェントの起動（1分）

```typescript
// エージェントAを起動
task({
  description: "タスクA",
  prompt: "あなたはエージェントAです。\n\nタスク: [タスク内容]\n\n進捗報告: 1時間ごとに報告してください。",
  subagent_type: "general",
  tools: { "background_task": false }
})
```

### ステップ3: 進捗の監視（継続）

- エージェントからの報告を待つ
- `PROGRESS_DASHBOARD.md` を更新
- 1時間ごとに進捗を確認

---

## 📋 基本的なワークフロー

### 1. タスクの定義

```markdown
### タスクA-1: タスク名

**優先度**: P0
**目標**: 今日18:00

**要件**:
- [要件1]
- [要件2]
```

### 2. エージェントの起動

```typescript
task({
  description: "タスクA-1",
  prompt: "...",
  subagent_type: "general",
  tools: { "background_task": false }
})
```

### 3. 進捗報告の受信

```markdown
## 進捗報告
エージェント: A
タスクID: A-1
アクション: 完了
詳細: [詳細]
```

### 4. 進捗ダッシュボードの更新

```markdown
### エージェントA

| ID | タスク | 状態 |
|----|-------|------|
| A-1 | タスクA-1 | 🟢 完了 |
```

---

## 🎯 エージェントの種類と使い分け

| 種類 | 使い道 |
|------|--------|
| `general` | ほとんどのタスク |
| `explore` | コード探索 |
| `librarian` | ドキュメント調査 |
| `oracle` | 設計・デバッグ |
| `frontend-ui-ux-engineer` | UI/UX開発 |

---

## 📊 並列稼働の例

```typescript
// エージェントAを起動
task({
  description: "タスクA",
  prompt: "...",
  subagent_type: "general"
})

// エージェントBを起動（並列）
task({
  description: "タスクB",
  prompt: "...",
  subagent_type: "general"
})

// エージェントCを起動（並列）
task({
  description: "タスクC",
  prompt: "...",
  subagent_type: "general"
})
```

---

## ⚠️ 重要なポイント

1. **明確な指示**: エージェントには具体的で明確な指示を与える
2. **定期的な確認**: 1時間ごとに進捗を確認する
3. **即座の対応**: ブロッカーには即座に対応する
4. **ドキュメント化**: すべてをドキュメント化する

---

## 💡 よくある質問

### Q: エージェントが応答しない場合どうすればいい？

A: promptを確認し、再度起動してください。それでも応答しない場合は、promptを簡略化してみてください。

### Q: 複数のエージェントを同時に起動できる？

A: はい、`task` toolを複数回呼び出すことで、並列で起動できます。

### Q: 進捗を監視する方法は？

A: エージェントからの進捗報告を受けて、`PROGRESS_DASHBOARD.md` と `USER_DASHBOARD.md` を更新してください。

### Q: タスクを分割する基準は？

A: タスクは1〜2時間で完了できるサイズに分割することをお勧めします。

---

## 📚 詳しいドキュメント

- `AGENT_SYSTEM_SETUP_GUIDE.md` - 詳細なセットアップガイド
- `AGENT_TASKS.md` - エージェントタスク割り当て
- `PROGRESS_DASHBOARD.md` - PM用進捗ダッシュボード
- `USER_DASHBOARD.md` - ユーザー用進捗ダッシュボード

---

**作成日**: 2026-01-23
**バージョン**: 1.0
