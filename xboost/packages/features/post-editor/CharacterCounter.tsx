export interface CharacterCounterProps {
  count: number;
  max?: number;
  warningThreshold?: number;
}

export function CharacterCounter({
  count,
  max = 280,
  warningThreshold = 260,
}: CharacterCounterProps) {
  const remaining = max - count;
  const isWarning = remaining <= warningThreshold && remaining > 0;
  const isError = remaining <= 0;

  const getCounterColor = () => {
    if (isError) return 'text-rose-600 dark:text-rose-400';
    if (isWarning) return 'text-amber-600 dark:text-amber-400';
    return 'text-zinc-500 dark:text-zinc-400';
  };

  const getCounterWeight = () => {
    if (isError || isWarning) return 'font-semibold';
    return 'font-normal';
  };

  const getCounterMessage = () => {
    if (isError) return 'Character limit exceeded';
    if (isWarning && remaining === 1) return '1 character remaining';
    if (isWarning) return `${remaining} characters remaining`;
    return `${remaining} characters remaining`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className={`text-sm ${getCounterColor()} ${getCounterWeight()}`}>
        {getCounterMessage()}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-32 rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className={`h-1.5 rounded-full transition-all duration-200 ${
              isError
                ? 'bg-rose-500'
                : isWarning
                  ? 'bg-amber-500'
                  : 'bg-teal-500'
            }`}
            style={{
              width: `${Math.min((count / max) * 100, 100)}%`,
            }}
          />
        </div>
        <span className={`text-sm font-mono ${getCounterColor()} ${getCounterWeight()}`}>
          {count}/{max}
        </span>
      </div>
    </div>
  );
}
