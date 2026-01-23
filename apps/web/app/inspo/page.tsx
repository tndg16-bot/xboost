'use client';

import { InspoDashboard } from '../../../../packages/features/topic-proposal';

export default function InspoPage() {
  const handleAddToDraft = (content: string) => {
    // In a real app, this would integrate with post editor
    alert(`下書きに追加されました：\n\n${content.substring(0, 100)}...`);
  };

  return (
    <div className="font-sans">
      <InspoDashboard onAddToDraft={handleAddToDraft} />
    </div>
  );
}
