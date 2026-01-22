'use client';

import { TrendingUp, Check, AlertOctagon } from 'lucide-react';

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
}

export function StrengthsWeaknesses({
  strengths,
  weaknesses,
}: StrengthsWeaknessesProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            良い点 ({strengths.length})
          </h3>
        </div>

        {strengths.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            特に記載なし
          </p>
        ) : (
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            改善点 ({weaknesses.length})
          </h3>
        </div>

        {weaknesses.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            特に記載なし
          </p>
        ) : (
          <ul className="space-y-2">
            {weaknesses.map((weakness, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                {weakness}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
