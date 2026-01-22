export interface ProfileSuggestion {
  id: string;
  category: 'bio' | 'name' | 'location' | 'website';
  severity: 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
  originalText: string;
  improvedText?: string;
}

export interface ProfileAnalysisResult {
  score: number;
  suggestions: ProfileSuggestion[];
  summary: {
    strengths: string[];
    weaknesses: string[];
  };
}

export const PROFILE_CORRECTION_CATEGORIES = [
  {
    id: 'bio',
    label: '自己紹介文',
    description: 'あなたの価値提案を伝える自己紹介文',
  },
  {
    id: 'name',
    label: '表示名',
    description: '認知されやすい表示名',
  },
  {
    id: 'location',
    label: '場所',
    description: '信頼性を高める場所情報',
  },
  {
    id: 'website',
    label: 'ウェブサイト',
    description: '製品・サービスへの導線',
  },
] as const;

export const COMMON_ISSUES = {
  bio: [
    {
      issue: '自己紹介が長すぎる',
      pattern: /^.{200,}$/,
      suggestion: '自己紹介は160文字以内に収めると、全て表示されます。簡潔に要点を伝えましょう。',
    },
    {
      issue: '具体的な価値提案がない',
      pattern: /何もない|やっていること|やります|好き/,
      suggestion: '具体的に「何を提供できるか」を明確にしましょう。例：「Web制作で売上2倍にする」',
    },
    {
      issue: 'リンクがない',
      pattern: /^((?!https?:\/\/).)*$/,
      suggestion: 'ウェブサイトや製品ページへのリンクを含めましょう。直接の導線が成約率を上げます。',
    },
    {
      issue: '過度な感嘆符',
      pattern: /!{3,}/,
      suggestion: '感嘆符を3つ以上連続で使うと信頼性が下がります。最大でも1〜2つに抑えましょう。',
    },
  ],
  name: [
    {
      issue: '記号が多い',
      pattern: /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]{3,}/,
      suggestion: '記号を多用すると読みにくくなります。シンプルで覚えやすい名前が好まれます。',
    },
    {
      issue: '英字と日本語の混在が目立つ',
      pattern: /[a-zA-Z]{10,}/,
      suggestion: '長い英字は読みにくくなります。日本語メインで、必要な英字のみ含めましょう。',
    },
  ],
  location: [
    {
      issue: '場所が空白',
      pattern: /^$/,
      suggestion: '場所を記載することで信頼性が向上します。「東京」「Remote」などで構いません。',
    },
    {
      issue: '冗長な記載',
      pattern: /^.{20,}$/,
      suggestion: '場所は簡潔に。「東京」や「シリコンバレー」のように、地名のみで十分です。',
    },
  ],
  website: [
    {
      issue: 'URLが長すぎる',
      pattern: /^.{100,}$/,
      suggestion: '短縮URLを使用するか、より簡潔なURLを検討しましょう。',
    },
  ],
} as const;

function analyzeBioLength(
  bio: string,
  suggestions: ProfileSuggestion[],
  strengths: string[],
  weaknesses: string[]
): void {
  if (bio.length > 200) {
    weaknesses.push('自己紹介が長すぎます');
    suggestions.push({
      id: 'bio-length',
      category: 'bio',
      severity: 'high',
      issue: '自己紹介が長すぎる',
      suggestion: '自己紹介は160文字以内に収めると全て表示されます。簡潔に要点を伝えましょう。',
      originalText: bio,
    });
  } else if (bio.length > 100) {
    strengths.push('自己紹介に十分な情報量がある');
  } else if (bio.length < 50) {
    weaknesses.push('自己紹介が短すぎる');
    suggestions.push({
      id: 'bio-short',
      category: 'bio',
      severity: 'medium',
      issue: '自己紹介が短すぎる',
      suggestion: '自己紹介は最低でも50文字以上にしましょう。具体的な価値提案を含めてください。',
      originalText: bio,
    });
  } else {
    strengths.push('適切な長さの自己紹介');
  }
}

function analyzeBioValueProposition(
  bio: string,
  suggestions: ProfileSuggestion[],
  weaknesses: string[]
): void {
  if (!/提供|作る|作成|開発|設計|専門|プロ|専門家|エンジニア|クリエイター|起業/.test(bio)) {
    weaknesses.push('具体的な価値提案が不明確');
    suggestions.push({
      id: 'bio-no-value',
      category: 'bio',
      severity: 'high',
      issue: '具体的な価値提案がない',
      suggestion: '「何を提供できるか」を明確にしましょう。例：「Web制作で売上2倍にする」',
      originalText: bio,
    });
  }
}

function analyzeBioLink(
  bio: string,
  website: string,
  suggestions: ProfileSuggestion[],
  strengths: string[],
  weaknesses: string[]
): void {
  if (!/https?:\/\/|\.com|\.jp|\.co/.test(bio) && !website) {
    weaknesses.push('導線となるリンクがない');
    suggestions.push({
      id: 'bio-no-link',
      category: 'bio',
      severity: 'high',
      issue: 'リンクがない',
      suggestion: 'ウェブサイトや製品ページへのリンクを含めましょう。直接の導線が成約率を上げます。',
      originalText: bio,
    });
  } else if (website) {
    strengths.push('ウェブサイトリンクあり');
  }
}

function analyzeBioPunctuation(
  bio: string,
  suggestions: ProfileSuggestion[],
  weaknesses: string[]
): void {
  if (/!{3,}/.test(bio)) {
    weaknesses.push('感嘆符が多すぎる');
    suggestions.push({
      id: 'bio-exclamation',
      category: 'bio',
      severity: 'medium',
      issue: '過度な感嘆符',
      suggestion: '感嘆符を3つ以上連続で使うと信頼性が下がります。最大でも1〜2つに抑えましょう。',
      originalText: bio,
      improvedText: bio.replace(/!{3,}/g, '！'),
    });
  }
}

function analyzeName(
  name: string,
  suggestions: ProfileSuggestion[],
  strengths: string[],
  weaknesses: string[]
): void {
  if (/[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]{3,}/.test(name)) {
    weaknesses.push('表示名に記号が多い');
    suggestions.push({
      id: 'name-symbols',
      category: 'name',
      severity: 'low',
      issue: '記号が多い',
      suggestion: '記号を多用すると読みにくくなります。シンプルで覚えやすい名前が好まれます。',
      originalText: name,
    });
  } else {
    strengths.push('読みやすい表示名');
  }
}

function analyzeLocation(
  location: string,
  suggestions: ProfileSuggestion[],
  strengths: string[],
  weaknesses: string[]
): void {
  if (!location) {
    weaknesses.push('場所情報が記載されていない');
    suggestions.push({
      id: 'location-empty',
      category: 'location',
      severity: 'low',
      issue: '場所が空白',
      suggestion: '場所を記載することで信頼性が向上します。「東京」「Remote」などで構いません。',
      originalText: location,
    });
  } else if (location.length > 20) {
    weaknesses.push('場所情報が冗長');
    suggestions.push({
      id: 'location-long',
      category: 'location',
      severity: 'low',
      issue: '冗長な記載',
      suggestion: '場所は簡潔に。「東京」や「シリコンバレー」のように、地名のみで十分です。',
      originalText: location,
      improvedText: location.substring(0, 20),
    });
  } else {
    strengths.push('適切な場所情報');
  }
}

export function analyzeProfile(data: {
  name: string;
  bio: string;
  location: string;
  website: string;
}): ProfileAnalysisResult {
  const suggestions: ProfileSuggestion[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  analyzeBioLength(data.bio, suggestions, strengths, weaknesses);
  analyzeBioValueProposition(data.bio, suggestions, weaknesses);
  analyzeBioLink(data.bio, data.website, suggestions, strengths, weaknesses);
  analyzeBioPunctuation(data.bio, suggestions, weaknesses);
  analyzeName(data.name, suggestions, strengths, weaknesses);
  analyzeLocation(data.location, suggestions, strengths, weaknesses);

  const highSeverity = suggestions.filter(s => s.severity === 'high').length;
  const mediumSeverity = suggestions.filter(s => s.severity === 'medium').length;
  const lowSeverity = suggestions.filter(s => s.severity === 'low').length;

  let score = 100 - (highSeverity * 25) - (mediumSeverity * 10) - (lowSeverity * 5);
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    suggestions,
    summary: {
      strengths,
      weaknesses,
    },
  };
}

export function getImprovementLevel(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 80) {
    return {
      label: '優秀',
      color: 'text-green-600',
      description: 'プロフィールは完成度が高いです！',
    };
  } else if (score >= 60) {
    return {
      label: '良好',
      color: 'text-blue-600',
      description: 'いくつか改善の余地があります',
    };
  } else if (score >= 40) {
    return {
      label: '要改善',
      color: 'text-orange-600',
      description: '改善することで効果が大きく変わります',
    };
  } else {
    return {
      label: '大幅改善が必要',
      color: 'text-red-600',
      description: 'プロフィールの見直しを強く推奨します',
    };
  }
}
