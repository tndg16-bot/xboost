# Technical Specification: Multi-Account Management (#101)

**Status:** Draft  
**Version:** 1.0.0  
**Priority:** Medium  
**Authors:** Technical Writer Agent

---

## 1. Overview
Multi-Account Management allows users to connect, manage, and toggle between multiple X (Twitter) accounts within a single Xboost dashboard. This is essential for social media managers, agencies, and power users running thematic "niche" accounts.

### 1.1 User Stories
- **As a Social Media Manager**, I want to manage my client's main account and their side accounts without logging out/in.
- **As a Content Creator**, I want to see a unified view of my brand accounts vs. my experimental accounts.
- **As an Agency**, I want to assign roles (Main, Sub, Niche) to accounts to organize my workflow.

---

## 2. Functional Requirements

### 2.1 Account Integration
- Support for multiple Twitter OAuth connections per Xboost User.
- Ability to label accounts by role:
  - **Main**: Primary brand account.
  - **Sub**: Secondary/Support account.
  - **Niche/Thematic**: Accounts focused on specific topics (e.g., "AI News").

### 2.2 Account Switching
- Global account switcher in the sidebar/navigation.
- State persistence: The selected account remains active across different pages (Analytics, Scheduler, etc.).
- "All Accounts" view: A unified dashboard for high-level metrics across all connected accounts.

### 2.3 Per-Account Resource Management
- **Scheduling Queues**: Independent calendars and queues for each account.
- **Metrics Tracking**: Analytics isolated by account, with optional aggregate views.
- **Drafts**: Private drafts per account or shared "Workspace Drafts" (Future consideration).

---

## 3. Data Model Enhancements

### 3.1 Database Schema (Prisma)
Update to the current `TwitterAccount` model to support richer metadata:

```prisma
model TwitterAccount {
  id                String    @id @default(cuid())
  userId            String
  role              AccountRole @default(SUB)
  isActive          Boolean   @default(true)
  
  // Existing fields...
  twitterId         String    @unique
  username          String
  // ...
  
  // Relations
  posts             Post[]
  scheduledPosts    ScheduledPost[]
}

enum AccountRole {
  MAIN
  SUB
  NICHE
}
```

### 3.2 Global Context (Frontend)
A React Context or Redux state to manage the `activeTwitterAccount`:

```typescript
interface AccountContext {
  activeAccount: TwitterAccount | null;
  accounts: TwitterAccount[];
  switchAccount: (id: string) => void;
  isAllAccountsView: boolean;
}
```

---

## 4. UI/UX Design

### 4.1 Account Switcher Component
- Located in the top-left or sidebar.
- Displays: Avatar, Display Name, Username (@handle), and Role Badge.
- Includes a "Manage Accounts" shortcut.

### 4.2 Multi-Account Dashboard
- A "Summary" view showing:
  - Total Followers (Aggregate)
  - Total Impressions (Aggregate)
  - "Health" status of all accounts (Token validity).

---

## 5. Implementation Considerations

### 5.1 Token Management
- Each `TwitterAccount` record must maintain its own `accessToken` and `refreshToken`.
- Automated token refresh logic must handle multiple accounts sequentially or in parallel without collision.

### 5.2 Permission Isolation
- API requests must always validate that the `twitterAccountId` provided in the request belongs to the authenticated `userId`.

### 5.3 Scaling
- UI must handle up to 50 accounts efficiently (using virtualization for the switcher list if necessary).

---

## 6. Success Criteria
1. User can successfully link 3+ Twitter accounts.
2. Switching accounts updates the Analytics and Scheduling views instantly.
3. Posts are never cross-posted to the wrong account.
4. The "All Accounts" view provides a correct aggregate of impressions.

---

## 7. Future Enhancements
- Team/Member access: Invite other Xboost users to manage specific accounts.
- Cross-posting: Select multiple accounts when creating a post in the editor.
- Account Grouping: Group accounts by "Client" or "Project".
