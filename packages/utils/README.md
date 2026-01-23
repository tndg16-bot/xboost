# @xboost/utils

Xboostプロジェクトで使用する共通ユーティリティ関数の集まりです。

## インストール

```bash
npm install @xboost/utils
```

## 使用方法

### すべてのユーティリティをインポート

```typescript
import * as utils from '@xboost/utils';

// 日時フォーマット
utils.formatDate(new Date(), 'ja-JP');

// 文字列操作
utils.truncate('長いテキスト...', 10);

// 検証
utils.isValidEmail('test@example.com');
```

### 個別モジュールをインポート

```typescript
import { formatDate, isToday } from '@xboost/utils/date';
import { truncate, capitalize } from '@xboost/utils/string';
import { isValidEmail, isValidUrl } from '@xboost/utils/validation';
```

## モジュール一覧

### date.ts

日付と時刻の操作・フォーマット関数を提供します。

| 関数 | 説明 |
|--------|------|
| `formatDateToISO(date)` | ISO形式（YYYY-MM-DD）でフォーマット |
| `formatDate(date, locale, options)` | ローカライズされた日付文字列を取得 |
| `formatDateTime(date, locale, options)` | 日時のローカライズされた文字列を取得 |
| `formatRelativeTime(date, locale)` | 相対時間（例: "5分前"）を取得 |
| `isToday(date)` | 日付が今日かどうかを判定 |
| `isWithinLastDays(date, days)` | 直近N日以内かどうかを判定 |
| `getDateRange(period)` | 期間の開始・終了日付を取得 |
| `addDays(date, days)` | 日付に日数を追加 |
| `addHours(date, hours)` | 日付に時間を追加 |
| `parseDate(dateString)` | ISO文字列からDateオブジェクトを作成 |
| `formatDuration(seconds, locale)` | 秒数を人間が読める形式に変換 |

```typescript
import { formatDate, formatRelativeTime, isToday } from '@xboost/utils/date';

const date = new Date();
formatDate(date); // "2026/01/23"
formatRelativeTime(date); // "たった今"
isToday(date); // true
```

---

### string.ts

文字列の操作・フォーマット関数を提供します。

| 関数 | 説明 |
|--------|------|
| `truncate(str, maxLength)` | 文字列を最大長に切り詰める（省略記号付き） |
| `capitalize(str)` | 最初の文字を大文字に |
| `toCamelCase(str)` | キャメルケースに変換 |
| `toKebabCase(str)` | ケバブケースに変換 |
| `toSnakeCase(str)` | スネークケースに変換 |
| `slugify(str)` | URL安全なスラグに変換 |
| `countWords(str)` | 単語数をカウント |
| `countCharacters(str)` | 文字数をカウント（絵文字対応） |
| `isEmpty(str)` | 文字列が空かどうかを判定 |
| `randomString(length)` | ランダム文字列を生成 |
| `maskEmail(email)` | メールアドレスをマスク |
| `maskPhone(phone)` | 電話番号をマスク |
| `stripHtml(html)` | HTMLタグを削除 |
| `pluralize(count, singular, plural)` | 単語を複数形に |
| `formatNumber(num, locale)` | 数値をフォーマット（カンマ区切り） |
| `formatPercentage(value, decimals)` | パーセンテージをフォーマット |
| `safeJsonParse(str, fallback)` | 安全なJSONパース |
| `normalizeWhitespace(str)` | 空白を正規化 |
| `escapeRegExp(str)` | 正規表現特殊文字をエスケープ |
| `includesCaseInsensitive(str, substring)` | 大文字小文字を区別せずに文字列を検索 |

```typescript
import { truncate, capitalize, toKebabCase, maskEmail } from '@xboost/utils/string';

truncate('長いテキストです', 10); // "長い..."
capitalize('hello'); // "Hello"
toKebabCase('HelloWorld'); // "hello-world"
maskEmail('john@example.com'); // "j***@example.com"
```

---

### validation.ts

データ検証関数を提供します。

| 関数 | 説明 |
|--------|------|
| `isValidEmail(email)` | メールアドレスのフォーマットを検証 |
| `isValidUrl(url)` | URLのフォーマットを検証 |
| `isSecureUrl(url)` | URLがHTTPSかどうかを判定 |
| `isValidTwitterUsername(username)` | Twitterユーザー名のフォーマットを検証 |
| `validatePassword(password)` | パスワードの強度を判定 |
| `isValidPhone(phone, countryCode)` | 電話番号のフォーマットを検証 |
| `isValidJapanPostalCode(code)` | 日本の郵便番号を検証 |
| `isEmpty(value)` | 文字列が空かどうかを判定 |
| `isInRange(value, min, max)` | 数値が範囲内かを判定 |
| `isNumber(value)` | 値が数値かどうかを判定 |
| `isPositiveNumber(value)` | 値が正の数値かどうかを判定 |
| `isValidDate(value)` | 値が有効な日付かどうかを判定 |
| `isFutureDate(date)` | 日付が未来かどうかを判定 |
| `isPastDate(date)` | 日付が過去かどうかを判定 |
| `isValidHexColor(color)` | 16進数カラーを検証 |
| `isValidCreditCard(cardNumber)` | クレジットカード番号を検証（Luhnアルゴリズム） |
| `isWhitespace(str)` | 文字列が空白のみかを判定 |
| `hasValidProtocol(url)` | URLが有効なプロトコルを持っているか判定 |
| `isJsonString(str)` | 文字列が有効なJSONか判定 |
| `hasNoDuplicates(arr)` | 配列に重複がないか判定 |
| `isNil(value)` | 値がnullまたはundefinedか判定 |
| `isNotNil(value)` | 値がnullまたはundefinedではないか判定 |

```typescript
import { isValidEmail, isValidUrl, validatePassword } from '@xboost/utils/validation';

isValidEmail('test@example.com'); // true
isValidUrl('https://example.com'); // true
validatePassword('StrongPass123'); // { isValid: true, strength: 'strong' }
```

## 型定義

すべての関数はTypeScriptで厳格に型付けされています。

## ロケール対応

日付・時刻関連の関数は、デフォルトで`ja-JP`（日本語）を使用していますが、他のロケールもサポートしています。

```typescript
formatDate(new Date(), 'en-US'); // "01/23/2026"
formatDateTime(new Date(), 'fr-FR'); // "23/01/2026 à 15:56"
```

## ライセンス

MIT
