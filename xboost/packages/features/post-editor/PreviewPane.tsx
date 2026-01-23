export interface PreviewPaneProps {
  content: string;
  mediaUrls?: string[];
}

export function PreviewPane({ content, mediaUrls = [] }: PreviewPaneProps) {
  // Mock user data - will be replaced with real user context
  const mockUser = {
    name: 'John Doe',
    handle: '@johndoe',
    avatar: null,
  };

  const displayTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex-1">
      <div className="flex h-full min-h-[300px] rounded-xl border-2 border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex w-full gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-lg font-semibold text-white">
              {mockUser.name.charAt(0)}
            </div>
          </div>

          {/* Post Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Header */}
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {mockUser.name}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {mockUser.handle}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">·</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {displayTime}
              </span>
            </div>

            {/* Content */}
            <div className="whitespace-pre-wrap break-words text-base leading-relaxed text-zinc-900 dark:text-zinc-50">
              {content || (
                <span className="text-zinc-400 dark:text-zinc-500">
                  Your post preview will appear here...
                </span>
              )}
            </div>

            {/* Media Attachments Preview */}
            {mediaUrls.length > 0 && (
              <div className="mt-4 grid gap-2">
                {mediaUrls.length === 1 && (
                  <div className="overflow-hidden rounded-xl">
                    {mediaUrls[0].includes('data:video') ? (
                      <video
                        src={mediaUrls[0]}
                        controls
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={mediaUrls[0]}
                        alt="Media attachment"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                )}
                {mediaUrls.length === 2 && (
                  <div className="grid grid-cols-2 gap-2">
                    {mediaUrls.map((url, index) => (
                      <div key={index} className="overflow-hidden rounded-xl">
                        {url.includes('data:video') ? (
                          <video
                            src={url}
                            controls
                            className="aspect-square h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Media ${index}`}
                            className="aspect-square h-full w-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {mediaUrls.length >= 3 && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="overflow-hidden rounded-xl">
                      {mediaUrls[0].includes('data:video') ? (
                        <video
                          src={mediaUrls[0]}
                          controls
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={mediaUrls[0]}
                          alt="Media 0"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="grid grid-rows-2 gap-2">
                      {mediaUrls.slice(1).map((url, index) => (
                        <div key={index} className="overflow-hidden rounded-xl">
                          {url.includes('data:video') ? (
                            <video
                              src={url}
                              controls
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <img
                              src={url}
                              alt={`Media ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons (Mock) */}
            <div className="mt-4 flex items-center gap-12">
              <button className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-teal-500 dark:text-zinc-400 dark:hover:text-teal-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>0</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-green-500 dark:text-zinc-400 dark:hover:text-green-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>0</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>0</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>0</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
