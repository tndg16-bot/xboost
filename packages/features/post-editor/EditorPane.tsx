import { ChangeEvent } from 'react';

export interface EditorPaneProps {
  content: string;
  onChange: (content: string) => void;
}

export function EditorPane({ content, onChange }: EditorPaneProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex-1">
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="What's happening?"
        className="h-full min-h-[300px] w-full resize-none rounded-xl border-2 border-zinc-200 bg-zinc-50 px-5 py-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-teal-500 dark:focus:bg-zinc-800"
      />
    </div>
  );
}
