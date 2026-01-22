'use client';

import { PostEditor } from '@xboost/post-editor';

export default function PostEditorPage() {
  const handleChange = (content: string) => {
    console.log('Post content:', content);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 py-12 font-sans dark:from-black dark:to-zinc-900">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create Your Post
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Write engaging content with real-time preview
          </p>
        </div>

        {/* Post Editor */}
        <PostEditor onChange={handleChange} />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            Powered by Xboost • AI-assisted content creation coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
