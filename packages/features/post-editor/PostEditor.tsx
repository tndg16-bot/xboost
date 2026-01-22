import { useState, ChangeEvent } from 'react';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { CharacterCounter } from './CharacterCounter';
import { AIAssistButton } from './AIAssistButton';
import { SyntaxTemplateButton } from './SyntaxTemplateButton';
import { CTAAlert } from './CTAAlert';
import { AIReformat } from './AIReformat';
import { AIRewrite } from '../ai-rewrite';

export interface PostEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export function PostEditor({ initialContent = '', onChange }: PostEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [showCTAAlert, setShowCTAAlert] = useState(true);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  const handleSelectTemplate = (template: string) => {
    const newContent = content ? `${content}\n\n${template}` : template;
    setContent(newContent);
    onChange?.(newContent);
  };

  const handleReformat = (reformattedContent: string) => {
    setContent(reformattedContent);
    onChange?.(reformattedContent);
  };

  const handleRewrite = (rewrittenContent: string) => {
    setContent(rewrittenContent);
    onChange?.(rewrittenContent);
  };

  return (
    <div className="flex min-h-[600px] w-full flex-col gap-6 rounded-2xl bg-white p-6 shadow-lg lg:flex-row lg:gap-8">
      {/* Editor Pane */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">Create Post</h2>
          <div className="flex gap-2">
            <SyntaxTemplateButton onSelectTemplate={handleSelectTemplate} />
            <AIRewrite content={content} onRewrite={handleRewrite} />
            <AIReformat content={content} onReformat={handleReformat} />
            <AIAssistButton />
          </div>
        </div>
        {showCTAAlert && <CTAAlert content={content} onDismiss={() => setShowCTAAlert(false)} />}
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
        <PreviewPane content={content} />
      </div>
    </div>
  );
}
