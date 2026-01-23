# @xboost/utils

Xboostプロジェクトの共通ユーティリティパッケージ。

## インストール

```bash
npm install @xboost/utils
```

## 使用例

```typescript
import { formatDate, truncate, isValidEmail } from '@xboost/utils';

const date = new Date();
console.log(formatDate(date)); // 2026年01月23日

const text = 'これは長いテキストです';
console.log(truncate(text, 10)); // これは長い...

console.log(isValidEmail('test@example.com')); // true
```

## API

### 日時フォーマット
- `formatDate(date)` - 日付をフォーマット
- `formatDateTime(date)` - 日時をフォーマット
- `getTimeAgo(date)` - 相対時間（例: 2日前）
- `formatISODate(date)` - ISO形式にフォーマット

### 文字列操作
- `truncate(str, maxLength)` - 文字列を切り詰める
- `slugify(str)` - URLスラグに変換
- `capitalize(str)` - 先頭を大文字に
- `removeEmptyLines(str)` - 空行を削除

### 検証関数
- `isValidEmail(email)` - メールアドレスの検証
- `isValidUrl(url)` - URLの検証
- `isValidXHandle(handle)` - Xハンドルの検証
- `isValidDateString(str)` - 日付文字列の検証

### 配列操作
- `chunk(array, size)` - 配列を分割
- `unique(array)` - 重複を削除
- `shuffle(array)` - 配列をシャッフル
