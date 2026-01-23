/**
 * AI Profile Analyzer Service
 * Uses OpenAI API to analyze, improve, and generate Twitter/X profiles
 */

import type {
  AnalyzeProfileRequest,
  AnalyzeProfileResponse,
  FixedPostRequest,
  FixedPostResponse,
  GenerateProfileRequest,
  GeneratedProfileResponse,
} from './ai-profile-types';

// ============================================================================
// Profile Analysis Functions
// ============================================================================

/**
 * Analyze a Twitter profile using AI
 */
export const analyzeProfileWithAI = async (
  request: AnalyzeProfileRequest
): Promise<AnalyzeProfileResponse> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('AI API key not configured');
  }

  const prompt = buildProfileAnalysisPrompt(request);

  const response = await callOpenAI(apiKey, prompt);

  return response as AnalyzeProfileResponse;
};

/**
 * Generate improvement posts for a profile
 */
export const generateProfilePosts = async (
  request: FixedPostRequest
): Promise<FixedPostResponse> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('AI API key not configured');
  }

  const prompt = buildProfilePostsPrompt(request);

  const response = await callOpenAI(apiKey, prompt);

  return response as FixedPostResponse;
};

/**
 * Generate a complete Twitter profile from scratch
 */
export const generateProfile = async (
  request: GenerateProfileRequest
): Promise<GeneratedProfileResponse> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('AI API key not configured');
  }

  const prompt = buildProfileGenerationPrompt(request);

  const response = await callOpenAI(apiKey, prompt);

  return response as GeneratedProfileResponse;
};

// ============================================================================
// Prompt Builders
// ============================================================================

function buildProfileAnalysisPrompt(request: AnalyzeProfileRequest): string {
  const { profile, context } = request;

  const contextSection = context
    ? `
**Context:**
- Target Audience: ${context.targetAudience || 'Not specified'}
- Industry: ${context.industry || 'Not specified'}
- Goals: ${context.goals?.join(', ') || 'Not specified'}
- Tone Preference: ${context.tone || 'Not specified'}
`
    : '';

  return `You are a social media expert specializing in Twitter/X profile optimization. Your task: analyze a Twitter profile and provide actionable insights.

${contextSection}

**Profile to Analyze:**
- Name: ${profile.name}
- Bio: ${profile.bio}
- Location: ${profile.location}
- Website: ${profile.website}
- Profile Image: ${profile.profileImageUrl || 'None'}
- Banner Image: ${profile.bannerImageUrl || 'None'}
- Followers: ${profile.followersCount || 'N/A'}
- Following: ${profile.followingCount || 'N/A'}
- Tweets: ${profile.tweetsCount || 'N/A'}

**Analysis Tasks:**

1. OVERALL SCORE (0-100)
- Calculate based on completeness, clarity, professionalism, and effectiveness

2. SUMMARY
- Overall assessment (2-3 sentences)
- Primary strengths (3-5 bullet points with categories)
- Primary weaknesses (3-5 bullet points with categories and severity)

3. DETAILED ANALYSIS
- Bio analysis:
  * Length assessment (current/recommended)
  * Clarity score (0.0-1.0)
  * Value proposition (extract if present)
  * Tone (identify: professional, casual, humorous, etc.)
- Name analysis:
  * Memorability score (0.0-1.0)
  * Relevance score (0.0-1.0)
- Overall impression:
  * Professionalism score (0.0-1.0)
  * Authenticity score (0.0-1.0)
  * Uniqueness score (0.0-1.0)

4. ACTIONABLE SUGGESTIONS
Generate 5-10 specific suggestions with:
- Unique ID
- Category (name, bio, location, website, images, overall)
- Type (addition, modification, removal, replacement)
- Priority (high, medium, low)
- Title
- Detailed description
- Current value (if applicable)
- Suggested value (if applicable)
- Rationale for why this matters
- Expected impact (major, moderate, minor)

**OUTPUT FORMAT (JSON only):**
{
  "score": number (0-100),
  "summary": {
    "assessment": "string",
    "strengths": [
      {"category": "string", "description": "string", "examples": ["string"]}
    ],
    "weaknesses": [
      {"category": "string", "issue": "string", "severity": "high|medium|low", "suggestion": "string", "exampleImprovement": "string"}
    ]
  },
  "analysis": {
    "bio": {
      "length": {"current": number, "recommended": number},
      "clarity": number (0-1),
      "valueProposition": "string",
      "tone": "string"
    },
    "name": {
      "memorability": number (0-1),
      "relevance": number (0-1)
    },
    "overall": {
      "professionalism": number (0-1),
      "authenticity": number (0-1),
      "uniqueness": number (0-1)
    }
  },
  "suggestions": [
    {
      "id": "string",
      "category": "name|bio|location|website|images|overall",
      "type": "addition|modification|removal|replacement",
      "priority": "high|medium|low",
      "title": "string",
      "description": "string",
      "currentValue": "string",
      "suggestedValue": "string",
      "rationale": "string",
      "expectedImpact": "major|moderate|minor"
    }
  ],
  "confidence": number (0-1)
}

**CONSTRAINTS:**
- Be specific and evidence-based
- Prioritize high-impact improvements
- Consider Twitter's character limits
- Output valid JSON only
- Ensure all suggestions are actionable`;
}

function buildProfilePostsPrompt(request: FixedPostRequest): string {
  const { profile, targetAudience, industry, variations = 3, tone, includeHashtags = true, maxLength = 280 } = request;

  return `You are a social media content expert. Your task: generate profile introduction posts for someone who has just updated their Twitter profile.

**Profile Information:**
- Name: ${profile.name}
- Bio: ${profile.bio}
- Location: ${profile.location}
- Website: ${profile.website}

**Target Audience:** ${targetAudience}
**Industry:** ${industry || 'Not specified'}
**Desired Tone:** ${tone || 'Not specified'}

**Requirements:**
- Generate ${variations} different post variations
- Each post should be under ${maxLength} characters
- ${includeHashtags ? 'Include relevant hashtags' : 'Do not include hashtags'}
- Vary the post types (introduction, value proposition, storytelling, etc.)

**Post Types to Include:**
1. Professional introduction
2. Value proposition/what you offer
3. Personal story or origin story
4. (Optional) Controversial opinion or strong stance
5. (Optional) Educational content snippet

For each post, provide:
- Post content
- Post type
- Emotional tone
- Hashtags (if applicable)
- Character count
- Engagement prediction with reasoning

**OUTPUT FORMAT (JSON only):**
{
  "variations": [
    {
      "id": "string",
      "content": "string",
      "type": "introduction|value_proposition|storytelling|controversial_opinion|educational",
      "tone": "string",
      "hashtags": ["string"],
      "characterCount": number,
      "engagementPrediction": {
        "score": number (0-1),
        "confidence": number (0-1),
        "reasoning": "string"
      }
    }
  ],
  "recommendations": {
    "bestTime": "string",
    "frequency": "string",
    "contentMix": ["string"]
  },
  "confidence": number (0-1)
}

**CONSTRAINTS:**
- All posts must be under ${maxLength} characters
- Be authentic and natural
- Include specific call-to-actions
- Output valid JSON only`;
}

function buildProfileGenerationPrompt(request: GenerateProfileRequest): string {
  const { expertise, targetAudience, industry, goals, uniquePoints, tone, language = 'ja' } = request;

  return `You are a personal branding expert. Your task: create a compelling Twitter/X profile from scratch.

**User Information:**
- Expertise/Background: ${expertise}
- Target Audience: ${targetAudience}
- Industry/Field: ${industry}
- Primary Goals: ${goals.join(', ')}
- Unique Selling Points: ${uniquePoints?.join(', ') || 'Not specified'}
- Desired Tone: ${tone || 'Not specified'}
- Language: ${language === 'ja' ? 'Japanese' : 'English'}

**Requirements:**
1. Create an optimized name (display name)
2. Write a compelling bio (under 160 characters for ${language === 'ja' ? 'Japanese' : 'English'} visibility)
3. Suggest a location
4. Write website text (for link preview description)
5. Provide 2-3 alternative names
6. Provide 2-3 alternative bios
7. Explain the reasoning behind your choices
8. Provide next steps for implementation

**Output Format (JSON only):**
{
  "profile": {
    "name": "string",
    "bio": "string",
    "location": "string",
    "websiteText": "string"
  },
  "alternatives": {
    "names": ["string"],
    "bios": ["string"]
  },
  "rationale": {
    "nameExplanation": "string",
    "bioExplanation": "string",
    "overallStrategy": "string"
  },
  "nextSteps": ["string"],
  "confidence": number (0-1)
}

**Profile Best Practices:**
${language === 'ja' ? `
- Name: Japanese characters preferred, readable and memorable
- Bio: Under 160 characters for full visibility, clear value proposition
- Location: Add trust and local relevance
` : `
- Name: Professional and memorable, include your role or expertise
- Bio: Under 160 characters, include what you do and for whom
- Location: Optional but adds credibility
`}

**CONSTRAINTS:**
- Bio must be under 160 characters
- Output valid JSON only
- Be specific and authentic
- Align with the user's goals and target audience`;
}

// ============================================================================
// OpenAI API Integration
// ============================================================================

async function callOpenAI(apiKey: string, prompt: string): Promise<unknown> {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert social media consultant specializing in Twitter/X profile optimization. Return exact JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7, // Balanced creativity and consistency
    max_tokens: 3000,
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error('Empty response from AI');
  }

  return JSON.parse(content);
}
