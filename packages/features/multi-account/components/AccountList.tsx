import { AccountCard } from './AccountCard';
import { mockMetrics, type Account, type AccountMetrics } from '../mockData';

interface AccountListProps {
  accounts: Account[];
  metrics: AccountMetrics[];
  activeAccountId: string;
  onAccountSelect: (accountId: string) => void;
  onOpenSettings: (account: Account) => void;
}

export const AccountList = ({
  accounts,
  metrics,
  activeAccountId,
  onAccountSelect,
  onOpenSettings,
}: AccountListProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">アカウント一覧</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const accountMetrics = metrics.find((m) => m.accountId === account.id);
          return (
            <AccountCard
              key={account.id}
              account={account}
              metrics={accountMetrics}
              isActive={account.id === activeAccountId}
              onSelect={onAccountSelect}
              onOpenSettings={onOpenSettings}
            />
          );
        })}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>アカウントが登録されていません</p>
          <p className="text-sm mt-2">右上の「アカウントを追加」から連携してください</p>
        </div>
      )}
    </div>
  );
};
