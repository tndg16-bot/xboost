import { useState } from 'react';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { CharacterCounter } from './CharacterCounter';
import { AIAssistButton } from './AIAssistButton';
import { CTAAlert } from './CTAAlert';
import { MediaAttachment } from './MediaAttachment';

export interface PostEditorProps {
  initialContent?: string;
  initialMediaUrls?: string[];
  onChange?: (content: string, mediaUrls?: string[]) => void;
}

export function PostEditor({
  initialContent = '',
  initialMediaUrls = [],
  onChange,
}: PostEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialMediaUrls);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent, mediaUrls);
  };

  const handleMediaChange = (newMediaUrls: string[]) => {
    setMediaUrls(newMediaUrls);
    onChange?.(content, newMediaUrls);
  };

  // Paste and drag handlers are now handled by MediaAttachment component
  // No need to duplicate in EditorPane

  return (
    <div className="flex min-h-[600px] w-full flex-col gap-6 rounded-2xl bg-white p-6 shadow-lg lg:flex-row lg:gap-8">
       {/* Editor Pane */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">Create Post</h2>
          <AIAssistButton />
        </div>
        <CTAAlert content={content} />
        <MediaAttachment
          mediaUrls={mediaUrls}
          onMediaChange={handleMediaChange}
        />
        <EditorPane
          content={content}
          onChange={handleContentChange}
        />
        <div className="mt-4">
          <CharacterCounter count={content.length} />
        </div>
      </div>

      {/* Preview Pane */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-zinc-900">Preview</h2>
        </div>
        <PreviewPane content={content} mediaUrls={mediaUrls} />
      </div>
    </div>
  );
}
