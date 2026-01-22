'use client';

import { useState } from 'react';

interface ProfileData {
  displayName: string;
  bio: string;
  removePunctuation: boolean;
}

const colors = {
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
} as const;

// 句読点の種類定義
const PUNCTUATION_MARKS = /[。、！？.,!?！？]/g;

export const ProfileEditor: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    displayName: '',
    bio: '',
    removePunctuation: false,
  });

  const [preview, setPreview] = useState({ displayName: '', bio: '' });

  // 句読点を除去する関数
  const removePunctuationMarks = (text: string): string => {
    return text.replace(PUNCTUATION_MARKS, '');
  };

  // 入力ハンドラー
  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);

    // プレビューを更新
    if (typeof value === 'string') {
      if (profile.removePunctuation) {
        setPreview({
          ...preview,
          [field]: removePunctuationMarks(value),
        });
      } else {
        setPreview({
          ...preview,
          [field]: value,
        });
      }
    } else if (field === 'removePunctuation' && typeof value === 'boolean') {
      // 句読点除外のトグルが変更された場合
      setPreview({
        displayName: value ? removePunctuationMarks(profile.displayName) : profile.displayName,
        bio: value ? removePunctuationMarks(profile.bio) : profile.bio,
      });
    }
  };

  const handleSave = () => {
    const dataToSave = profile.removePunctuation ? {
      displayName: removePunctuationMarks(profile.displayName),
      bio: removePunctuationMarks(profile.bio),
    } : {
      displayName: profile.displayName,
      bio: profile.bio,
    };

    console.log('Saving profile:', dataToSave);
    // TODO: API call to save profile
    alert('プロフィールを保存しました！');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors['gray-50'] }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
          <p className="text-sm text-gray-500 mt-1">表示名と自己紹介を編集</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">編集</h2>

            <div className="space-y-4">
              {/* 表示名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  表示名
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="表示名を入力"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  文字数: {profile.displayName.length}
                </p>
              </div>

              {/* 自己紹介 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  自己紹介
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="自己紹介を入力"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  文字数: {profile.bio.length}
                </p>
              </div>

              {/* 句読点除外設定 */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      句読点を除く
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      。（読点）、（句点）、！（感嘆符）、？（疑問符）を除外
                    </p>
                  </div>
                  <button
                    onClick={() => handleInputChange('removePunctuation', !profile.removePunctuation)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      profile.removePunctuation ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        profile.removePunctuation ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 保存ボタン */}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={!profile.displayName && !profile.bio}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">プレビュー</h2>

            {/* アバター領域（プレースホルダー） */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {preview.displayName || <span className="text-gray-400">表示名</span>}
                </div>
                <div className="text-sm text-gray-500">@username</div>
              </div>
            </div>

            {/* 自己紹介プレビュー */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">自己紹介</h3>
              <p className="text-gray-900 whitespace-pre-wrap">
                {preview.bio || <span className="text-gray-400">自己紹介が入力されていません</span>}
              </p>
            </div>

            {/* 句読点除外のステータス表示 */}
            {profile.removePunctuation && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-900">
                    <p className="font-medium">句読点除外が有効です</p>
                    <p className="text-blue-700">保存時に句読点が除去されます</p>
                  </div>
                </div>
              </div>
            )}

            {/* 句読点除外の無効時 */}
            {!profile.removePunctuation && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100 2 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">句読点除外が無効です</p>
                    <p className="text-gray-500">入力されたまま保存されます</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 プロフィール編集のヒント
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">句読点除外について</h4>
              <p className="text-sm text-gray-700">
                句読点を除くことで、短く簡潔な印象を与えることができます。Xのハッシュタグ風に近いスタイルになります。
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">プレビューの活用</h4>
              <p className="text-sm text-gray-700">
                句読点除外をオンにすると、リアルタイムでプレビューが表示されます。実際に表示される通りを確認できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
