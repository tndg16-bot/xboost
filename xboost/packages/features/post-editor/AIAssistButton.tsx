import { useState } from 'react';

export interface AIAssistButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function AIAssistButton({ onClick, disabled = false }: AIAssistButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-900"
    >
      <svg
        className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span>AI Assist</span>
    </button>
  );
}
