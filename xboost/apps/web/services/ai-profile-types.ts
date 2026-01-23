/**
 * Type definitions for AI Profile API endpoints
 * @fileoverview Request/Response types for /api/v1/ai/profile/*
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

// ============================================================================
// POST /api/v1/ai/profile/analyze
// ============================================================================

export interface AnalyzeProfileRequest {
  /** Twitter profile data to analyze */
  profile: {
    /** Display name */
    name: string;
    /** Bio/description */
    bio: string;
    /** Location */
    location: string;
    /** Website URL */
    website: string;
    /** Profile image URL */
    profileImageUrl?: string;
    /** Banner image URL */
    bannerImageUrl?: string;
    /** Follower count */
    followersCount?: number;
    /** Following count */
    followingCount?: number;
    /** Tweet count */
    tweetsCount?: number;
  };
  /** Optional context for better analysis */
  context?: {
    /** Target audience */
    targetAudience?: string;
    /** Industry/field */
    industry?: string;
    /** Primary goals */
    goals?: string[];
    /** Tone preference */
    tone?: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'controversial';
  };
}

export interface ProfileStrength {
  category: string;
  description: string;
  examples?: string[];
}

export interface ProfileWeakness {
  category: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  suggestion: string;
  exampleImprovement?: string;
}

export interface ProfileSuggestion {
  id: string;
  category: 'name' | 'bio' | 'location' | 'website' | 'images' | 'overall';
  type: 'addition' | 'modification' | 'removal' | 'replacement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentValue?: string;
  suggestedValue?: string;
  rationale: string;
  expectedImpact: 'major' | 'moderate' | 'minor';
}

export interface AnalyzeProfileResponse {
  /** Overall profile score (0-100) */
  score: number;
  /** Analysis summary */
  summary: {
    /** Overall assessment */
    assessment: string;
    /** Primary strengths */
    strengths: ProfileStrength[];
    /** Primary weaknesses */
    weaknesses: ProfileWeakness[];
  };
  /** Detailed analysis by category */
  analysis: {
    /** Bio analysis */
    bio: {
      length: { current: number; recommended: number };
      clarity: number; // 0-1 scale
      valueProposition?: string;
      tone?: string;
    };
    /** Name analysis */
    name: {
      memorability: number; // 0-1 scale
      relevance: number; // 0-1 scale
    };
    /** Overall impression */
    overall: {
      professionalism: number; // 0-1 scale
      authenticity: number; // 0-1 scale
      uniqueness: number; // 0-1 scale
    };
  };
  /** Actionable suggestions */
  suggestions: ProfileSuggestion[];
  /** AI confidence score */
  confidence: number; // 0-1 scale
}

// ============================================================================
// POST /api/v1/ai/profile/fixed-post
// ============================================================================

export interface FixedPostRequest {
  /** Current Twitter profile data */
  profile: {
    name: string;
    bio: string;
    location: string;
    website: string;
  };
  /** Target audience */
  targetAudience: string;
  /** Industry/field */
  industry?: string;
  /** Number of variations to generate */
  variations?: number;
  /** Tone preference */
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'controversial';
  /** Include hashtags */
  includeHashtags?: boolean;
  /** Max character count per post */
  maxLength?: number;
}

export interface ProfilePostVariation {
  id: string;
  /** Post content */
  content: string;
  /** Type of post */
  type: 'introduction' | 'value_proposition' | 'storytelling' | 'controversial_opinion' | 'educational';
  /** Emotional tone */
  tone: string;
  /** Hashtags (if included) */
  hashtags?: string[];
  /** Character count */
  characterCount: number;
  /** Expected engagement prediction */
  engagementPrediction: {
    score: number; // 0-1
    confidence: number; // 0-1
    reasoning: string;
  };
}

export interface FixedPostResponse {
  /** Generated post variations */
  variations: ProfilePostVariation[];
  /** Recommendations for posting strategy */
  recommendations: {
    bestTime?: string;
    frequency?: string;
    contentMix?: string[];
  };
  /** AI confidence score */
  confidence: number; // 0-1 scale
}

// ============================================================================
// POST /api/v1/ai/profile/generate
// ============================================================================

export interface GenerateProfileRequest {
  /** User's background/expertise */
  expertise: string;
  /** Target audience */
  targetAudience: string;
  /** Industry/field */
  industry: string;
  /** Primary goals (e.g., lead generation, thought leadership, networking) */
  goals: string[];
  /** Unique selling points */
  uniquePoints?: string[];
  /** Tone preference */
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'controversial';
  /** Language */
  language?: 'ja' | 'en';
}

export interface GeneratedProfileData {
  /** Suggested display name */
  name: string;
  /** Suggested bio */
  bio: string;
  /** Suggested location */
  location: string;
  /** Suggested website text (for link preview) */
  websiteText?: string;
}

export interface GeneratedProfileResponse {
  /** Generated profile data */
  profile: GeneratedProfileData;
  /** Alternative variations */
  alternatives: {
    names: string[];
    bios: string[];
  };
  /** Rationale for suggestions */
  rationale: {
    nameExplanation: string;
    bioExplanation: string;
    overallStrategy: string;
  };
  /** Next steps */
  nextSteps: string[];
  /** AI confidence score */
  confidence: number; // 0-1 scale
}
