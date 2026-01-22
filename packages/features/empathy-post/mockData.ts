// 共感系ポストのパターン定義
export const empathyPatterns = [
  {
    id: 'common-enemy',
    name: '共通の敵',
    description: '皆が抱える悩みを代弁',
    icon: '⚔️',
    examples: [
      '毎朝の満員電車、辛い',
      '会議が長すぎて夕飯食べるの忘れた',
      '納期前夜、なぜか眠れない'
    ]
  },
  {
    id: 'failure',
    name: '等身大の失敗',
    description: '自分の失敗を等身大で語る',
    icon: '🤦',
    examples: [
      '昨日、盛大に失敗した',
      '本日、大失態を犯しました',
      '今日はミス連発だった...'
    ]
  },
  {
    id: 'fatigue',
    name: '脱力感',
    description: '仕事での疲れを共有',
    icon: '😫',
    examples: [
      '今週、本当に疲れた',
      '今日はもう帰りたい',
      'エネルギー切れ...'
    ]
  },
  {
    id: 'small-happiness',
    name: '小さな幸せ',
    description: '日常の小さな喜び',
    icon: '✨',
    examples: [
      '久々の休日、最高',
      'コンビニのおにぎりが美味すぎた',
      '夕焼けがきれいだった'
    ]
  },
  {
    id: 'resonance',
    name: '共鳴',
    description: '他者と同じ感情を共有',
    icon: '🤝',
    examples: [
      '〇〇さんの言う通り',
      'まさに今の私の状態',
      '完全に同意'
    ]
  }
];

// テンプレートの定義
export const empathyTemplates = [
  {
    id: 'template-1',
    patternId: 'common-enemy',
    title: '満員電車の辛さ',
    template: '毎朝の満員電車、本当しんどい...。あと15分寝たい。',
    customizations: [
      { key: 'duration', label: '何分寝たい？', type: 'text', default: '15' },
      { key: 'feeling', label: 'どう感じる？', type: 'text', default: 'しんどい' }
    ]
  },
  {
    id: 'template-2',
    patternId: 'fatigue',
    title: '仕事疲れ',
    template: '今週、本当に疲れた。でも終わった！今日は早めに寝よう。',
    customizations: [
      { key: 'weekend', label: '週末の予定', type: 'text', default: '早めに寝よう' }
    ]
  },
  {
    id: 'template-3',
    patternId: 'small-happiness',
    title: '美味しいもの',
    template: '今日の{food}、美味すぎた。小さな幸せを感じた✨',
    customizations: [
      { key: 'food', label: '何を食べた？', type: 'text', default: 'ランチ' }
    ]
  }
];

// アイデアブレインストーミングのためのキーワードマップ
export const brainstormingKeywords = {
  仕事: ['疲れ', '会議', '納期', '上司', '同僚', '残業'],
  健康: ['睡眠', '食事', '運動', 'ストレス', '病気'],
  家族: ['親', '子供', '配偶者', '同居', '別居'],
  趣味: ['ゲーム', '読書', '旅行', '音楽', '映画'],
  成長: ['学習', '失敗', '反省', '目標', '改善'],
  人間関係: ['友情', '恋愛', '喧嘩', '仲直り', '距離感']
};

// 感情語の提案
export const emotionWords = {
  ポジティブ: [
    '嬉しい', '楽しい', '最高', '幸せ', '感動',
    '安心', '充実', '達成', '満足', '元気'
  ],
  ネガティブ: [
    '辛い', '疲れた', '悲しい', '悔しい', 'イライラ',
    '不安', '焦り', '孤独', '脱力', '無理'
  ],
  中間: [
    '微妙', '普通', 'まあまあ', 'どっちでもない', 'なんとなく',
    'ふとした瞬間', '突然', '気づけば', 'いつの間にか'
  ]
};

// 状況設定のヒント
export const situationHints = {
  朝: {
    title: '朝の気分',
    hints: [
      '目覚めた瞬間の気分',
      '天気を見た感想',
      '今日の予定への不安や期待',
      'コーヒーを飲んだ時のリラックス'
    ]
  },
  昼: {
    title: '昼の出来事',
    hints: [
      'ランチでの小さな発見',
      '仕事中のふとした気づき',
      '同僚との会話',
      '窓の外の景色'
    ]
  },
  夜: {
    title: '夜の振り返り',
    hints: [
      '今日の仕事の振り返り',
      '帰宅時のリラックス',
      '明日への不安',
      '今日の小さな成果'
    ]
  },
  週末: {
    title: '週末の時間',
    hints: [
      '自由な時間の使い方',
      '趣味に没頭した時',
      '友人との会話',
      'ゆっくり過ごした心地よさ'
    ]
  }
};

// 文末のスタイル調整
export const sentenceEndingStyles = [
  { id: 'casual', label: 'カジュアル', suffix: '...', examples: ['疲れた...', '無理...', '最高...'] },
  { id: 'standard', label: '標準', suffix: '。', examples: ['疲れた。', '無理だ。', '最高だ。'] },
  { id: 'emotional', label: '感情的', suffix: '！', examples: ['疲れた！', '無理！', '最高！'] },
  { id: 'soft', label: '柔らかい', suffix: '〜', examples: ['疲れた〜', '無理〜', '最高〜'] }
];
