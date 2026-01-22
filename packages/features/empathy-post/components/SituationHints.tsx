'use client';

import { useState } from 'react';
import { situationHints } from '../mockData';

export const SituationHints: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        💭 状況設定のヒント
      </h2>

      {/* Time Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          時間帯を選択
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(situationHints).map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedTime === time
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">
                {time === '朝' && '🌅'}
                {time === '昼' && '☀️'}
                {time === '夜' && '🌙'}
                {time === '週末' && '🎉'}
              </div>
              <div className="text-sm font-medium text-gray-900">{time}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Hints */}
      {selectedTime && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {situationHints[selectedTime as keyof typeof situationHints].title}
          </h3>
          <div className="space-y-2">
            {situationHints[selectedTime as keyof typeof situationHints].hints.map((hint, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(hint);
                  alert('コピーしました！');
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{hint}</span>
                  <span className="text-xs text-gray-400">クリックでコピー</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedTime && (
        <p className="text-sm text-gray-500">時間帯を選択するとヒントが表示されます</p>
      )}

      {/* Writing Examples */}
      {selectedTime && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            ✍️ 書き方の例
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm text-blue-900">
            {selectedTime === '朝' && (
              <>
                <p><strong>脱力感:</strong> 目覚ましが鳴る前に目が覚めた。今日も一日なんとかなるかな...</p>
                <p><strong>小さな幸せ:</strong> 朝起きたら外がきれいな青色だった。しばらく眺めた✨</p>
                <p><strong>共通の敵:</strong> 朝から満員電車でしんどい。15分寝たかった...</p>
              </>
            )}
            {selectedTime === '昼' && (
              <>
                <p><strong>小さな幸せ:</strong> ランチで美味しいカレー食べた。久々に幸せを感じた✨</p>
                <p><strong>等身大の失敗:</strong> 昼休みにミスして反省。午後は挽回するしか...</p>
                <p><strong>脱力感:</strong> お腹いっぱいで眠いけど、会議が続く...</p>
              </>
            )}
            {selectedTime === '夜' && (
              <>
                <p><strong>疲労感:</strong> 今日は本当によく動いた。明日は休みたい...</p>
                <p><strong>等身大の反省:</strong> 今日反省したこと。まずちゃんと休むこと...</p>
                <p><strong>小さな幸せ:</strong> 帰り道、夕焼けがきれいだった。一日の疲れ癒やされた</p>
              </>
            )}
            {selectedTime === '週末' && (
              <>
                <p><strong>小さな幸せ:</strong> 週末、久々にゆっくりできた。充実感ある✨</p>
                <p><strong>等身大の成長:</strong> 今週いろいろ学んで、少し賢くなった気がする</p>
                <p><strong>脱力感:</strong> 週末なのにやることいっぱい。ゆっくり休みたい...</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          💡 状況設定のコツ
        </h3>
        <div className="bg-purple-50 rounded-lg p-4 space-y-2 text-sm text-purple-900">
          <p>• 具体的な状況（朝起きた瞬間、帰宅時など）を描写する</p>
          <p>• 感覚的な表現（見たもの、感じたこと）を入れる</p>
          <p>• 読者が「自分もそうだ」と共感できる状況を選ぶ</p>
          <p>• その時間帯に特有の感情や出来事に焦点を当てる</p>
        </div>
      </div>
    </div>
  );
};
