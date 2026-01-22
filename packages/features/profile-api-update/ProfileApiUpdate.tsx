'use client';

import { useState } from 'react';

interface Profile {
  name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
  banner: string;
}

export function ProfileApiUpdate() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    avatar: '',
    banner: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual API call to X profile API
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('プロフィールの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">プロフィールAPI経由更新</h1>
      <p className="text-gray-600 mb-8">
        XのAPIを使用してプロフィール情報を更新します
      </p>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">名前</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="名前を入力"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ユーザー名</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="@username"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">プロフィール</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="自己紹介を入力"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">{profile.bio.length}/160</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">場所</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="場所を入力"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ウェブサイト</label>
            <input
              type="url"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">アバター画像URL</label>
            <input
              type="url"
              value={profile.avatar}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">バナー画像URL</label>
            <input
              type="url"
              value={profile.banner}
              onChange={(e) => setProfile({ ...profile, banner: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/banner.jpg"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          {success && (
            <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              プロフィールを更新しました
            </div>
          )}
          {error && (
            <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? '更新中...' : 'プロフィールを更新'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">💡 ヒント</h2>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• アバターとバナーは正方形の画像URLを使用してください</li>
          <li>• プロフィールは160文字以内で作成してください</li>
          <li>• ウェブサイトURLはhttps://またはhttp://から始めてください</li>
        </ul>
      </div>
    </div>
  );
}
