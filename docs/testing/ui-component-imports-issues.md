# UI Component Export & Import Issues Report

**Analysis Date**: 2026-01-23
**Analyst**: Sisyphus
**Status**: Multiple import/export inconsistencies identified

---

## Executive Summary

Significant inconsistencies exist in how UI components are exported from packages and imported in the web app. Some pages use relative imports, some use workspace package imports, and some packages are missing configuration entirely.

### Current State
- ⚠️ Mixed import patterns (relative vs workspace packages)
- ❌ Missing package.json for analytics package
- ❌ Inconsistent workspace dependencies in web app package.json
- ⚠️ Some packages have duplicate exports or missing type exports

---

## 1. Package Structure Analysis

### 1.1 Monorepo Workspace Configuration

**Root package.json**:
```json
{
  "workspaces": [
    "xboost/apps/*",
    "xboost/packages/*",
    "xboost/packages/features/*"
  ]
}
```

This is correctly configured for npm/yarn/pnpm workspaces.

### 1.2 Package Names vs Directory Structure

| Package Directory | Expected Package Name | Has package.json |
|-----------------|---------------------|------------------|
| `xboost/packages/ui` | `@xboost/ui` | ✅ Yes |
| `xboost/packages/features/automation` | `@xboost/automation` | ✅ Yes |
| `xboost/packages/features/analytics` | `@xboost/analytics` | ❌ **Missing** |
| `xboost/packages/features/scheduling` | `@xboost/scheduling` | ❌ **Missing** |
| `xboost/packages/features/ai-post-generation` | `@xboost/ai-post-generation` | ✅ Yes |
| `xboost/packages/features/ai-profile-creation` | `@xboost/ai-profile-creation` | ✅ Yes |
| `xboost/packages/features/ai-rewrite` | `@xboost/ai-rewrite` | ✅ Yes |
| `xboost/packages/features/empathy-post` | `@xboost/empathy-post` | ✅ Yes |
| `xboost/packages/features/multi-account` | `@xboost/multi-account` | ✅ Yes |
| `xboost/packages/features/personal-brand` | `@xboost/personal-brand` | ✅ Yes |
| `xboost/packages/features/post-editor` | `@xboost/post-editor` | ❌ **Missing** |
| `xboost/packages/features/profile-editing` | `@xboost/profile-editing` | ✅ Yes |

---

## 2. Import Pattern Inconsistencies

### 2.1 Current Import Patterns by Page

| Page | Import Pattern | Status |
|------|---------------|--------|
| `xboost/apps/web/app/analytics/page.tsx` | `from '../../../../packages/features/analytics'` | ⚠️ Relative |
| `xboost/apps/web/app/automation/page.tsx` | `from '@xboost/automation'` | ✅ Workspace |
| `xboost/apps/web/app/multi-account/page.tsx` | `from '@xboost/multi-account'` | ✅ Workspace |
| `xboost/apps/web/app/personal-brand/page.tsx` | `from '@xboost/personal-brand'` | ✅ Workspace |
| `xboost/apps/web/app/profile/page.tsx` | `from '@xboost/features/profile-editing'` | ⚠️ Inconsistent |
| `xboost/apps/web/app/ai-profile/page.tsx` | `from '@xboost/features/ai-profile-creation'` | ⚠️ Inconsistent |
| `xboost/apps/web/app/empathy/page.tsx` | `from '@xboost/features/empathy-post'` | ⚠️ Inconsistent |
| `xboost/apps/web/app/post-editor/page.tsx` | `from '../../../packages/features/post-editor'` | ⚠️ Relative |
| `xboost/apps/web/app/scheduling/page.tsx` | `from '../../../packages/features/scheduling'` | ⚠️ Relative |

### 2.2 Issues Identified

#### Issue 1: Mixed Import Conventions
**Severity**: MEDIUM

Some pages use workspace imports (`@xboost/package-name`), while others use relative imports (`../../../packages/...`).

**Example Inconsistency**:
```typescript
// ✅ Good: Workspace import
import { AutomationDashboard } from '@xboost/automation';

// ⚠️ Bad: Relative import
import { PostEditor } from '../../../packages/features/post-editor';

// ⚠️ Inconsistent: Uses 'features' prefix
import { ProfileEditor } from '@xboost/features/profile-editing';
```

**Recommendation**: Standardize on workspace imports: `@xboost/package-name`

#### Issue 2: Missing 'features' Prefix
**Severity**: MEDIUM

The package naming is inconsistent:
- Some use `@xboost/automation` (no features prefix)
- Some use `@xboost/features/profile-editing` (with features prefix)

**Recommendation**: Remove 'features' from package names. Use `@xboost/profile-editing` instead of `@xboost/features/profile-editing`.

#### Issue 3: Missing package.json Files
**Severity**: HIGH

The following packages have code but no package.json:
1. `xboost/packages/features/analytics` - No package.json
2. `xboost/packages/features/scheduling` - No package.json
3. `xboost/packages/features/post-editor` - No package.json

**Impact**: These packages cannot be imported as workspace packages, forcing the use of relative imports.

---

## 3. Export Structure Analysis

### 3.1 Current Export Patterns

#### @xboost/ui (Good ✅)
```typescript
export * from './components';
export * from './tokens';
export { cn } from './utils/cn';
export { ToastProvider, useToast } from './Toast';
export { Skeleton, TextSkeleton, CardSkeleton, TableSkeleton, LoadingSpinner } from './Skeleton';
```
**Status**: Clean, well-organized exports

#### @xboost/automation (Issue ⚠️)
```typescript
export { AutomationDashboard } from './AutomationDashboard';
export * from './components';  // Potential duplicate exports
export * from './types';       // Missing types.ts file
export * from './mockData';
```
**Status**: Has issues - missing types.ts file

#### @xboost/analytics (No package.json ❌)
```typescript
export { AnalyticsDashboard } from './AnalyticsDashboard';
export { ImpressionChart } from './ImpressionChart';
export { FollowerGrowthChart } from './FollowerGrowthChart';
export { EngagementCard } from './EngagementCard';
export { PostRanking } from './PostRanking';
export { TimeAnalysis } from './TimeAnalysis';
export { PatternDetector } from './PatternDetector';
export * from './mockData';
```
**Status**: Cannot be imported as workspace package

#### @xboost/scheduling (No package.json ❌)
```typescript
export * from './components';
export * from './types';
export * from './mock-data';
```
**Status**: Cannot be imported as workspace package

#### @xboost/post-editor (No package.json ❌)
```typescript
export * from './PostEditor';
export * from './EditorPane';
export * from './PreviewPane';
export * from './CharacterCounter';
export * from './AIAssistButton';

export type {
  PostEditorProps,
  EditorPaneProps,
  PreviewPaneProps,
  CharacterCounterProps,
  AIAssistButtonProps,
};
```
**Status**: Cannot be imported as workspace package

---

## 4. Web App Package Dependencies

### 4.1 Current State

**xboost/apps/web/package.json**:
```json
{
  "name": "@xboost/web",
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.1",
    "@prisma/client": "^7.3.0",
    "@stripe/stripe-js": "^8.6.4",
    "next": "16.1.4",
    "next-auth": "^4.24.13",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "recharts": "^3.7.0",
    "stripe": "^20.2.0"
  }
}
```

**Problem**: No workspace dependencies listed! The app imports from `@xboost/*` packages but doesn't declare them as dependencies.

**Expected Dependencies** (should include):
```json
{
  "dependencies": {
    "@xboost/ui": "workspace:*",
    "@xboost/automation": "workspace:*",
    "@xboost/analytics": "workspace:*",
    "@xboost/scheduling": "workspace:*",
    "@xboost/ai-post-generation": "workspace:*",
    "@xboost/ai-profile-creation": "workspace:*",
    "@xboost/ai-rewrite": "workspace:*",
    "@xboost/empathy-post": "workspace:*",
    "@xboost/multi-account": "workspace:*",
    "@xboost/personal-brand": "workspace:*",
    "@xboost/post-editor": "workspace:*",
    "@xboost/profile-editing": "workspace:*"
  }
}
```

---

## 5. LSP Errors Found

### 5.1 Import Errors

1. **File**: `xboost/apps/web/app/personal-brand/page.tsx`
   ```
   Cannot find module '@xboost/personal-brand' or its corresponding type declarations.
   ```
   **Cause**: Package is imported but not in workspace dependencies

2. **File**: `apps/web/app/post-editor/page.tsx`
   ```
   Cannot find module '../../../packages/features/post-editor' or its corresponding type declarations.
   ```
   **Cause**: Relative import path issue

3. **File**: `apps/web/app/scheduling/page.tsx`
   ```
   Cannot find module '../../../packages/features/scheduling' or its corresponding type declarations.
   Cannot find module '../../../packages/features/scheduling/mock-data' or its corresponding type declarations.
   ```
   **Cause**: Relative import path issue

### 5.2 Export Errors

1. **File**: `packages/features/automation/index.ts`
   ```
   Cannot find module './types' or its corresponding type declarations.
   ```
   **Cause**: types.ts file doesn't exist but is exported

2. **File**: `xboost/packages/features/automation/index.ts`
   ```
   Cannot find module './types' or its corresponding type declarations.
   Module './components' has already exported a member named 'RepostHistory'. Consider explicitly re-exporting to resolve the ambiguity.
   ```
   **Cause**: Missing types.ts, duplicate exports in components

---

## 6. Recommended Fixes

### Fix 1: Create Missing package.json Files (HIGH PRIORITY)

**File**: `xboost/packages/features/analytics/package.json`
```json
{
  "name": "@xboost/analytics",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts"
  },
  "dependencies": {
    "react": "^19.0.0",
    "recharts": "^3.7.0",
    "@xboost/ui": "workspace:*"
  }
}
```

**File**: `xboost/packages/features/scheduling/package.json`
```json
{
  "name": "@xboost/scheduling",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts"
  },
  "dependencies": {
    "react": "^19.0.0",
    "@xboost/ui": "workspace:*"
  }
}
```

**File**: `xboost/packages/features/post-editor/package.json`
```json
{
  "name": "@xboost/post-editor",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts"
  },
  "dependencies": {
    "react": "^19.0.0",
    "@xboost/ui": "workspace:*"
  }
}
```

### Fix 2: Standardize Import Paths (HIGH PRIORITY)

Change all relative imports to workspace imports:

**Before**:
```typescript
import { AnalyticsDashboard } from '../../../../packages/features/analytics';
import { PostEditor } from '../../../packages/features/post-editor';
import { CalendarView, PostList } from '../../../packages/features/scheduling';
```

**After**:
```typescript
import { AnalyticsDashboard } from '@xboost/analytics';
import { PostEditor } from '@xboost/post-editor';
import { CalendarView, PostList } from '@xboost/scheduling';
```

**Files to update**:
1. `xboost/apps/web/app/analytics/page.tsx`
2. `apps/web/app/post-editor/page.tsx`
3. `apps/web/app/scheduling/page.tsx`

### Fix 3: Fix 'features' Prefix Inconsistency (MEDIUM PRIORITY)

Option A: Remove 'features' from all package names (RECOMMENDED)
- Change package names: `@xboost/features/xxx` → `@xboost/xxx`
- Update all imports accordingly

Option B: Add 'features' to all package names (NOT RECOMMENDED)
- Change package names: `@xboost/xxx` → `@xboost/features/xxx`
- Update all imports accordingly

**Recommendation**: Use Option A. The 'features' prefix is redundant since all packages under `packages/features/` are clearly feature packages.

### Fix 4: Update Web App Dependencies (HIGH PRIORITY)

Add all workspace dependencies to `xboost/apps/web/package.json`:
```json
{
  "name": "@xboost/web",
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.1",
    "@prisma/client": "^7.3.0",
    "@stripe/stripe-js": "^8.6.4",
    "next": "16.1.4",
    "next-auth": "^4.24.13",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "recharts": "^3.7.0",
    "stripe": "^20.2.0",
    "@xboost/ui": "workspace:*",
    "@xboost/analytics": "workspace:*",
    "@xboost/automation": "workspace:*",
    "@xboost/scheduling": "workspace:*",
    "@xboost/ai-post-generation": "workspace:*",
    "@xboost/ai-profile-creation": "workspace:*",
    "@xboost/ai-rewrite": "workspace:*",
    "@xboost/empathy-post": "workspace:*",
    "@xboost/multi-account": "workspace:*",
    "@xboost/personal-brand": "workspace:*",
    "@xboost/post-editor": "workspace:*",
    "@xboost/profile-editing": "workspace:*"
  }
}
```

### Fix 5: Fix Missing Types Files (LOW PRIORITY)

**File**: `xboost/packages/features/automation/types.ts` (create if needed)
```typescript
// Add type definitions for AutomationDashboard
export interface AutomationProps {
  // ... props
}

export interface RepostRule {
  id: string;
  // ... other fields
}

// etc.
```

Or remove the export if types.ts is not needed:
```typescript
// In index.ts, remove this line:
export * from './types';
```

### Fix 6: Resolve Duplicate Exports (LOW PRIORITY)

**File**: `xboost/packages/features/automation/index.ts`
```
Module './components' has already exported a member named 'RepostHistory'.
```

**Solution**: Explicitly re-export to resolve ambiguity:
```typescript
export { RepostHistory } from './components/RepostHistory';
```

---

## 7. Implementation Priority

### Critical (Do First)
1. ✅ Create missing package.json files (analytics, scheduling, post-editor)
2. ✅ Update xboost/apps/web/package.json with workspace dependencies
3. ✅ Install dependencies: `npm install` or `pnpm install`

### High Priority
4. ✅ Standardize import paths (relative → workspace)
5. ✅ Fix 'features' prefix inconsistency

### Medium Priority
6. ✅ Fix missing types.ts in automation package
7. ✅ Resolve duplicate exports

### Low Priority
8. Verify all components render correctly
9. Update documentation to reflect package naming conventions

---

## 8. Verification Steps

After implementing fixes:

1. **Reinstall dependencies**:
   ```bash
   cd xboost
   rm -rf node_modules
   rm -rf apps/web/node_modules
   rm -rf packages/*/node_modules
   npm install
   ```

2. **Run TypeScript check**:
   ```bash
   cd xboost/apps/web
   npm run typecheck
   ```

3. **Check LSP diagnostics**:
   - All import errors should be resolved
   - All export errors should be resolved

4. **Test component rendering**:
   ```bash
   npm run dev
   ```
   - Navigate to each page
   - Verify components load without errors

---

## 9. Status Summary

| Category | Status | Progress |
|----------|--------|----------|
| Package.json Files | ⚠️ Incomplete | 8/11 packages configured |
| Import Consistency | ⚠️ Mixed | 50% workspace imports |
| Web App Dependencies | ❌ Missing | 0 workspace dependencies |
| LSP Errors | ⚠️ 7 errors | Need fixing |
| Component Exports | ✅ Good | Most packages have clean exports |

---

## 10. References

- [Monorepo Best Practices](https://github.com/lerna/lerna)
- [npm Workspaces Documentation](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

---

**Report Status**: Analysis complete, fixes ready for implementation
**Next Action**: Implement Fix 1-5, then verify
