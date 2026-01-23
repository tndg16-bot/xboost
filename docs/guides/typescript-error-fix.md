# TypeScriptエラー修正ガイド

作成日: 2026-01-23
担当: エージェントC
PM: Sisyphus

---

## 概要

このドキュメントは、XboostプロジェクトのTypeScriptエラーを修正するための詳細ガイドです。

## 緊急度

🔴 **P0（クリティカル）**: ビルドが通らないため、最優先で修正が必要

---

## 修正対象ファイル一覧

### 1. `xboost/apps/web/app/cta-checker/page.tsx`

**エラー**: Line 189:20 `':' expected.`

**原因**: SVGパスの構文エラー

**現在のコード**:
```tsx
<path fillRule="evenodd" d="M10 18a8 8 0 100-2.83 6 6 0 001.414 6 6 0 001.414 6 6 0 00-2.83 0zM10 14a8 8 0 100-2.83 6 6 0 001.414 6 6 0 00-2.83 0zm0-6a8 8 0 11-6 0 8 8 0 01-8 8 0 001.414 6 6 0 00-8 8 8zm0 2a2 2 0 110 0v5.5a2 2 0 012-2 2 2-2 2 0 011-4.28 2 282a2 2 0 001.414 2 2 2 0 011-.72.898-.878zm-1 5 12c0-.66 0-1.2.555-2-2 0-1.792-2 2 0 00-2.83-2 2 0-00.83-37 0 .422 2 2 2 0 0 0 37-.898-.878zM12 10c0 1.66 2.83 2.83 2.83 0 01.66.417 0 2 2 2 0 00-2.83-2-2 2 0 0 0 4.796-4.696a2 2 0 00-2.83-2 2 2 0 0 11.32.676.676 0 0 1.832-1.766 2 2 0 01.766-.676-.676zM13.516 12c0-1.66-.834-3-2.5-2-5-2 0-1.792-2-2-2 0 00-2.83-2-2 2 0 0 0 4.796-4.696a2 2 0 00-2.83-2 2 2 0 0 11.32 2.676 2.676a2 2 0 0 00 2.83-2-2 2 0 0 01.766-.676-.676z" clipRule="evenodd" />
```

**問題点**:
- SVGパスが不自然に長く、壊れている
- 数値やコマンドが不正

**解決策**: 正しいSVGアイコンに置き換え

```tsx
<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
  {checkResult.hasCTA ? (
    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
  ) : (
    <path fillRule="evenodd" d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" clipRule="evenodd" />
  )}
</svg>
```

---

### 2. `xboost/apps/web/services/ai-pattern-analyzer.ts`

**複数のエラー**: Lines 196, 248, 262, 272, 300, 302-306, 315, 323, 327, 334, 339

#### エラー1: `Cannot find module 'openai'`

**場所**: Line 196

**原因**: `openai`パッケージがインストールされていない

**解決策**: パッケージをインストール
```bash
cd xboost/apps/web
npm install openai
```

#### エラー2: `Property 'text' does not exist on type 'ContentBlock'`

**場所**: Line 248

**原因**: OpenAI APIのレスポンス型の変更

**現在のコード**:
```typescript
const content = response.choices[0].message.content;
```

**解決策**:
```typescript
const content = typeof response.choices[0].message.content === 'string'
  ? response.choices[0].message.content
  : '';
```

または、以下のようになっている場合:
```typescript
if (block.type === 'text') {
  const text = block.text;  // エラー
}
```

以下のように修正:
```typescript
if ('text' in block) {
  const text = block.text as string;
}
```

#### エラー3: `Argument of type 'number[]' is not assignable to parameter of type 'number'`

**場所**: Line 262

**原因**: 配列を数値として渡そうとしている

**解決策**: 正しい値を渡す
```typescript
// 配列の場合
const values: number[] = [1, 2, 3];
const sum = values.reduce((a, b) => a + b, 0); // sumはnumber

// 関数に渡す場合
processValue(sum); // OK
// processValue(values); // エラー
```

#### エラー4: `A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value`

**場所**: Line 272

**原因**: 関数が値を返す宣言になっているが、return文がない

**解決策**: すべてのパスで値を返すようにする
```typescript
function calculateSomething(x: number): number {
  if (x > 0) {
    return x * 2;
  }
  // エラー: ここで何も返していない
  // return 0; // 追加
}
```

#### エラー5: Lines 300, 311, 359 `Declaration or statement expected`

**原因**: 構文エラー - 不適切な括弧の閉じ、または予期しない文

**現在のコード（300行目付近）**:
```typescript
    )
    );

for (const result of results) {
```

**問題点**: 括弧の数が不自然

**修正案**: 周辺コードを確認し、適切に修正
```typescript
    )
  );

for (const result of results) {
  allPatterns.push(...result.reproduciblePatterns);
  allTopics.push(...result.contentAnalysis.topics);
  allFormats.push(result.formatAnalysis.postType);
  totalConfidence += result.confidence;
}
```

#### エラー6: Lines 302-306 `Cannot find name`

**原因**: 変数が宣言されていない

**現在の使用**:
```typescript
allPatterns.push(...)
allTopics.push(...)
allFormats.push(...)
totalConfidence += ...
```

**宣言を追加**:
```typescript
// 関数の先頭で宣言
const allPatterns: Pattern[] = [];
const allTopics: string[] = [];
const allFormats: PostFormat[] = [];
let totalConfidence = 0;
```

#### エラー7: Lines 315, 323, 327, 334, 339 `Cannot find name`

**原因**: 上述の宣言が不足しているため、変数が見つからない

**解決策**: 上記の宣言を追加すれば解決

---

## 修正の手順

### ステップ1: パッケージのインストール

```bash
cd xboost/apps/web
npm install openai
```

### ステップ2: `cta-checker/page.tsx` の修正

1. ファイルを開く: `xboost/apps/web/app/cta-checker/page.tsx`
2. Line 189付近のSVGを置換
3. 保存

### ステップ3: `ai-pattern-analyzer.ts` の修正

1. ファイルを開く: `xboost/apps/web/services/ai-pattern-analyzer.ts`
2. 各エラーを順番に修正
3. 宣言不足の変数を追加
4. 保存

### ステップ4: 検証

```bash
cd xboost/apps/web
npm run typecheck
```

**期待される結果**:
```
✓ No TypeScript errors found
```

---

## 検証チェックリスト

- [ ] `openai`パッケージがインストールされている
- [ ] `cta-checker/page.tsx`のSVGが修正されている
- [ ] `ai-pattern-analyzer.ts`のすべての宣言が追加されている
- [ ] `ai-pattern-analyzer.ts`の型エラーが解消されている
- [ ] `npm run typecheck` がエラーなしで成功する

---

## 追加の注意点

### TypeScript設定の確認

`xboost/apps/web/tsconfig.json` が正しく設定されていることを確認:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Prisma Clientの再生成

もしPrisma関連のエラーがある場合:

```bash
cd xboost/apps/web
npx prisma generate
```

---

## 困ったときは

1. **OpenAI APIのドキュメントを確認**: https://platform.openai.com/docs/api-reference
2. **TypeScript Handbookを参照**: https://www.typescriptlang.org/docs/handbook/intro.html
3. **PM（Sisyphus）に連絡**: このドキュメントの更新を依頼

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2026-01-23 | 初版作成 | Sisyphus |
