/**
 * AI Pattern Analyzer Service
 * Uses OpenAI/Claude API to extract actionable insights from post patterns
 */

// Types for AI analysis results
export interface AIContentAnalysis {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topics: string[];
  themes: string[];
  emotionalTone: 'analytical' | 'emotional' | 'controversial';
  sarcasm: boolean;
}

export interface AIFormatAnalysis {
  postType: 'single' | 'thread' | 'poll' | 'quote' | 'reply';
  characterCount: number;
  hashtagCount: number;
  mediaType: 'image' | 'video' | 'text_only';
  complexity: 'simple' | 'medium' | 'complex';
}

export interface AIEngagementPrediction {
  predictedScore: number; // 0-1 scale
  confidence: number; // 0-1 scale
  keyFactors: string[];
  riskFactors: string[];
}

export interface AIReproduciblePattern {
  patternId: string;
  patternName: string;
  description: string;
  successRate: number;
  avgEngagement: number;
  examples: string[];
  actionability: 'high' | 'medium' | 'low';
}

export interface AIAnalysisResult {
  contentAnalysis: AIContentAnalysis;
  formatAnalysis: AIFormatAnalysis;
  engagementPrediction: AIEngagementPrediction;
  reproduciblePatterns: AIReproduciblePattern[];
  actionableRecommendations: string[];
  confidence: number;
}

/**
 * Analyze post using AI for content, format, and engagement insights
 */
export const analyzePostWithAI = async (
  postContent: string,
  historicalMetrics?: {
    avgEngagement: number;
    topPerformingTopics: string[];
    bestFormats: string[];
  }
): Promise<AIAnalysisResult> => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('AI API key not configured');
  }

  // Determine which API to use
  const useOpenAI = !!process.env.OPENAI_API_KEY;

  const prompt = buildAnalysisPrompt(postContent, historicalMetrics);

  if (useOpenAI) {
    return await analyzeWithOpenAI(prompt, apiKey);
  } else {
    return await analyzeWithClaude(prompt, apiKey);
  }
};

/**
 * Build comprehensive analysis prompt
 */
const buildAnalysisPrompt = (
  postContent: string,
  historicalMetrics?: {
    avgEngagement: number;
    topPerformingTopics: string[];
    bestFormats: string[];
  }
): string => {
  const context = historicalMetrics
    ? `
Historical Context:
- Average engagement rate: ${historicalMetrics.avgEngagement}%
- Top performing topics: ${historicalMetrics.topPerformingTopics.join(', ')}
- Best performing formats: ${historicalMetrics.bestFormats.join(', ')}

Use this context to compare the new post against what has worked historically.
`
    : '';

  return `You are a social media analytics expert specializing in Twitter/X. Your task: analyze a post to extract actionable insights.

${context}

**Post to Analyze:**
${postContent}

**Analysis Tasks:**

1. CONTENT ANALYSIS
- Sentiment (positive/neutral/negative with 0.0-1.0 scores)
- Topics: Extract 3-5 relevant topics/hashtags
- Themes: Identify 2-3 thematic patterns (e.g., education, entertainment, personal, opinion)
- Emotional tone: analytical/emotional/controversial
- Sarcasm detection: boolean

2. FORMAT ANALYSIS
- Post type: single/thread/poll/quote/reply
- Character count: integer
- Hashtag count: integer (0, 1-2, 3+)
- Media type: image/video/text_only
- Complexity: simple/medium/complex

3. ENGAGEMENT PREDICTION
- Predicted engagement score: 0.0-1.0 (probability of high engagement)
- Confidence: 0.0-1.0 (how confident are you)
- Key success factors: list 3-5 factors that would help
- Risk factors: list 2-3 factors that might reduce engagement

4. REPRODUCIBLE PATTERNS
Identify 2-3 actionable, reproducible patterns from this post:
- Pattern ID: unique identifier (e.g., "strong_hook_with_number")
- Pattern name: descriptive name
- Description: what the pattern is
- Success rate: estimated 0.0-1.0 (probability this pattern succeeds)
- Average engagement: expected engagement % if this pattern works
- Examples: 2-3 concrete examples of this pattern
- Actionability: high/medium/low (how easy to replicate)

5. ACTIONABLE RECOMMENDATIONS
Provide 3-5 specific, actionable recommendations based on analysis.

**OUTPUT FORMAT (JSON only):**
{
  "contentAnalysis": {
    "sentiment": {"positive": 0.0-1.0, "negative": 0.0-1.0, "neutral": 0.0-1.0},
    "topics": ["string array"],
    "themes": ["string array"],
    "emotionalTone": "analytical|emotional|controversial",
    "sarcasm": boolean
  },
  "formatAnalysis": {
    "postType": "single|thread|poll|quote|reply",
    "characterCount": integer,
    "hashtagCount": integer,
    "mediaType": "image|video|text_only",
    "complexity": "simple|medium|complex"
  },
  "engagementPrediction": {
    "predictedScore": 0.0-1.0,
    "confidence": 0.0-1.0,
    "keyFactors": ["string array"],
    "riskFactors": ["string array"]
  },
  "reproduciblePatterns": [
    {
      "patternId": "string",
      "patternName": "string",
      "description": "string",
      "successRate": 0.0-1.0,
      "avgEngagement": number,
      "examples": ["string array"],
      "actionability": "high|medium|low"
    }
  ],
  "actionableRecommendations": ["string array"]
}

**CONSTRAINTS:**
- Use data provided only (don't invent)
- Be specific and evidence-based
- Output valid JSON only
- Ensure all patterns are actionable and reproducible`;
};

/**
 * Analyze using OpenAI API
 */
const analyzeWithOpenAI = async (
  prompt: string,
  apiKey: string
): Promise<AIAnalysisResult> => {
  // Dynamic import to avoid build-time dependency
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a social media analytics expert. Return exact JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.0, // Deterministic for reproducibility
    max_tokens: 2000,
  });

  const result = JSON.parse(response.choices[0].message.content);
  result.confidence = response.choices[0].logprobs?.token_logprobs
    ? calculateConfidenceFromLogprobs(response.choices[0].logprobs.token_logprobs)
    : 0.7;

  return result as AIAnalysisResult;
};

/**
 * Analyze using Claude API
 */
const analyzeWithClaude = async (
  prompt: string,
  apiKey: string
): Promise<AIAnalysisResult> => {
  // Dynamic import to avoid build-time dependency
  const Anthropic = await import('@anthropic-ai/sdk');

  const client = new Anthropic.default({ apiKey });

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.0, // Deterministic for reproducibility
  });

  const result = JSON.parse(response.content[0].text);
  result.confidence = 0.8; // Claude typically has good confidence

  return result as AIAnalysisResult;
};

/**
 * Calculate confidence from logprobs (OpenAI)
 */
const calculateConfidenceFromLogprobs = (
  logprobs: number[][]
): number => {
  // Average of absolute logprobs gives us confidence
  const avgLogProb =
    logprobs.reduce((sum, val) => sum + Math.abs(val), 0) / logprobs.length;
  // Convert to confidence score (higher avg abs logprob = lower confidence)
  return Math.max(0, Math.min(1, 1 - avgLogProb));
};

/**
 * Analyze multiple posts for pattern discovery
 */
export const analyzeBatchForPatterns = async (
  posts: { content: string; engagement: number; id: string }[]
): Promise<{
    patterns: AIReproduciblePattern[];
    highPerformingTopics: string[];
    bestFormats: string[];
    overallConfidence: number;
  }> => {
  const batchSize = 10;
  const batches = [];
  for (let i = 0; i < posts.length; i += batchSize) {
    batches.push(posts.slice(i, i + batchSize));
  }

  const allPatterns: AIReproduciblePattern[] = [];
  const allTopics: string[] = [];
  const allFormats: string[] = [];
  let totalConfidence = 0;

  for (const batch of batches) {
    // Analyze each post in batch (could optimize with actual batch API)
    const results = await Promise.all(
      batch.map((post) =>
        analyzePostWithAI(post.content, {
          avgEngagement: posts.reduce((sum, p) => sum + p.engagement, 0) / posts.length,
          topPerformingTopics: [],
          bestFormats: [],
        })
      )
    )
    );

    for (const result of results) {
      allPatterns.push(...result.reproduciblePatterns);
      allTopics.push(...result.contentAnalysis.topics);
      allFormats.push(result.formatAnalysis.postType);
      totalConfidence += result.confidence;
    }

    // Rate limiting delay
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Find patterns that appear frequently
  const patternFrequency = new Map<string, number>();
  for (const pattern of allPatterns) {
    const freq = patternFrequency.get(pattern.patternId) || 0;
    patternFrequency.set(pattern.patternId, freq + 1);
  }

  const recurringPatterns = Array.from(patternFrequency.entries())
    .filter(([_, count]) => count >= 2) // Pattern appears in 2+ posts
    .map(([patternId, count]) => {
      const pattern = allPatterns.find((p) => p.patternId === patternId);
      return {
        ...pattern!,
        patternId,
        successRate: count / allPatterns.length, // Based on frequency
        actionability: pattern!.actionability,
      };
    });

  // Find top topics and formats
  const topicFrequency = new Map<string, number>();
  for (const topic of allTopics) {
    topicFrequency.set(topic, (topicFrequency.get(topic) || 0) + 1);
  }

  const formatFrequency = new Map<string, number>();
  for (const format of allFormats) {
    formatFrequency.set(format, (formatFrequency.get(format) || 0) + 1);
  }

  const highPerformingTopics = Array.from(topicFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic]) => topic);

  const bestFormats = Array.from(formatFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([format]) => format);

  return {
    patterns: recurringPatterns,
    highPerformingTopics,
    bestFormats,
    overallConfidence: totalConfidence / results.length,
  };
};

/**
 * Generate insights from discovered patterns
 */
export const generatePatternInsights = (
  discoveredPatterns: {
    patterns: AIReproduciblePattern[];
    highPerformingTopics: string[];
    bestFormats: string[];
    overallConfidence: number;
  }
): {
    summary: string;
    topPatterns: string[];
    recommendations: string[];
    confidenceLevel: 'high' | 'medium' | 'low';
  } => {
  const confidenceLevel =
    discoveredPatterns.overallConfidence > 0.8
      ? 'high'
      : discoveredPatterns.overallConfidence > 0.5
        ? 'medium'
        : 'low';

  const topPatterns = discoveredPatterns.patterns
    .filter((p) => p.actionability === 'high' || p.actionability === 'medium')
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 5);

  const recommendations = [
    `Focus on these formats: ${discoveredPatterns.bestFormats.join(', ')}`,
    `Target these topics: ${discoveredPatterns.highPerformingTopics.slice(0, 5).join(', ')}`,
    `Top actionable pattern: "${topPatterns[0]?.patternName || 'N/A'}"`,
    `Pattern description: ${topPatterns[0]?.description || 'N/A'}`,
    `Success rate: ${(topPatterns[0]?.successRate * 100 || 0).toFixed(1)}%`,
    `Expected engagement: ${topPatterns[0]?.avgEngagement || 0}%`,
    'Implement these patterns in your next 5-10 posts',
    'Track performance to validate patterns',
  ];

  return {
    summary: `Analyzed ${discoveredPatterns.patterns.length} patterns across your posts. Found ${discoveredPatterns.highPerformingTopics.length} high-performing topics and ${discoveredPatterns.bestFormats.length} optimal formats.`,
    topPatterns: topPatterns.map((p) => p.patternName),
    recommendations,
    confidenceLevel,
  };
};
