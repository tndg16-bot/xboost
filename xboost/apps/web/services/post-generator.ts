/**
 * AI Post Generator Service
 * Uses OpenAI/Claude API to generate multiple pattern variations of posts
 */

// Types for AI post generation results
export interface PostPattern {
  id: string;
  patternType: 'empathy' | 'useful' | 'entertainment';
  content: string;
  reasoning: string;
  keyPoints: string[];
  hashtags: string[];
  estimatedEngagement: 'high' | 'medium' | 'low';
}

export interface PostGenerationOptions {
  theme: string;
  targetAudience?: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative';
  includeHashtags?: boolean;
  maxLength?: number; // Default: 280 (Twitter limit)
}

/**
 * Generate 3 pattern variations of a post
 */
export const generatePostPatterns = async (
  options: PostGenerationOptions
): Promise<PostPattern[]> => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('AI API key not configured');
  }

  const useOpenAI = !!process.env.OPENAI_API_KEY;
  const prompt = buildPostGenerationPrompt(options);

  if (useOpenAI) {
    return await generateWithOpenAI(prompt, apiKey);
  } else {
    return await generateWithClaude(prompt, apiKey);
  }
};

/**
 * Build post generation prompt
 */
const buildPostGenerationPrompt = (options: PostGenerationOptions): string => {
  const maxLength = options.maxLength || 280;
  const includeHashtags = options.includeHashtags !== false;

  return `You are a social media content expert specializing in Twitter/X posts. Your task: generate 3 distinct pattern variations of a post based on the user's input.

**User Input:**
- Theme/Topic: ${options.theme}
${options.targetAudience ? `- Target Audience: ${options.targetAudience}` : ''}
${options.tone ? `- Tone: ${options.tone}` : ''}

**Pattern Requirements:**
Generate 3 distinct posts, each with a different approach:
1. EMPATHY (共感): Appeal to emotions, share personal experiences, create relatable content
2. USEFUL (有益): Provide valuable information, actionable tips, educational content
3. ENTERTAINMENT (エンタメ): Fun, engaging, humorous, or entertaining content

**Post Requirements:**
- ${maxLength} characters or less
- Clear and scannable structure
${includeHashtags ? '- Include 2-3 relevant hashtags' : ''}

**OUTPUT FORMAT (JSON only):**
[
  {
    "id": "pattern-1",
    "patternType": "empathy",
    "content": "string (under ${maxLength} chars)",
    "reasoning": "string explaining why this approach works",
    "keyPoints": ["array of 2-3 key points"],
    "hashtags": ["array of 2-3 hashtags"],
    "estimatedEngagement": "high|medium|low"
  },
  {
    "id": "pattern-2",
    "patternType": "useful",
    "content": "string (under ${maxLength} chars)",
    "reasoning": "string explaining why this approach works",
    "keyPoints": ["array of 2-3 key points"],
    "hashtags": ["array of 2-3 hashtags"],
    "estimatedEngagement": "high|medium|low"
  },
  {
    "id": "pattern-3",
    "patternType": "entertainment",
    "content": "string (under ${maxLength} chars)",
    "reasoning": "string explaining why this approach works",
    "keyPoints": ["array of 2-3 key points"],
    "hashtags": ["array of 2-3 hashtags"],
    "estimatedEngagement": "high|medium|low"
  }
]

**CONSTRAINTS:**
- Each post must be ${maxLength} characters or less
- Each pattern must be distinctly different in approach
- Content must be relevant to the theme
- Use natural, authentic language (avoid overly corporate tone)
- Output valid JSON array only`;
};

/**
 * Generate using OpenAI API
 */
const generateWithOpenAI = async (
  prompt: string,
  apiKey: string
): Promise<PostPattern[]> => {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a social media content expert. Return exact JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8, // Higher for creativity
    max_tokens: 1500,
  });

  const result = JSON.parse(response.choices[0].message.content);
  return result as PostPattern[];
};

/**
 * Generate using Claude API
 */
const generateWithClaude = async (
  prompt: string,
  apiKey: string
): Promise<PostPattern[]> => {
  const Anthropic = await import('@anthropic-ai/sdk');
  const client = new Anthropic.default({ apiKey });

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
  });

  const contentBlock = response.content[0];
  const content = contentBlock.type === 'text' ? contentBlock.text : '';
  const result = JSON.parse(content);
  return result as PostPattern[];
};
