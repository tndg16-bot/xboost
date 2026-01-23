# AI Profile API Documentation

## Overview

The AI Profile API provides intelligent analysis, improvement suggestions, and generation capabilities for Twitter/X profiles using OpenAI's GPT-4o-mini model.

**Base URL:** `https://api.xboost.now/api/v1/ai/profile`

**Authentication:** NextAuth session-based authentication (user must be logged in)

**Rate Limiting:** 10 requests per minute per user per endpoint

---

## Endpoints

### 1. Analyze Profile

Analyze a Twitter profile and provide actionable insights for improvement.

#### Endpoint
```
POST /api/v1/ai/profile/analyze
```

#### Authentication
Required: NextAuth session

#### Rate Limit
10 requests per minute

#### Request Body

```typescript
{
  profile: {
    name: string;           // Display name
    bio: string;           // Bio/description
    location: string;       // Location
    website: string;        // Website URL
    profileImageUrl?: string;    // Profile image URL (optional)
    bannerImageUrl?: string;     // Banner image URL (optional)
    followersCount?: number;     // Follower count (optional)
    followingCount?: number;     // Following count (optional)
    tweetsCount?: number;        // Tweet count (optional)
  };
  context?: {
    targetAudience?: string;     // Target audience (optional)
    industry?: string;           // Industry/field (optional)
    goals?: string[];            // Primary goals (optional)
    tone?: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'controversial'; // Tone preference (optional)
  };
}
```

#### Response

**Status Codes:**
- `200 OK` - Profile analyzed successfully
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Not authenticated
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - AI service not configured

**Success Response (200):**

```json
{
  "score": 75, // Overall score (0-100)
  "summary": {
    "assessment": "Your profile has good clarity but could benefit from more specific value proposition.",
    "strengths": [
      {
        "category": "Bio",
        "description": "Clear and concise bio",
        "examples": ["Web developer | Building great products"]
      }
    ],
    "weaknesses": [
      {
        "category": "Bio",
        "issue": "Missing call-to-action",
        "severity": "medium",
        "suggestion": "Add a CTA to drive engagement",
        "exampleImprovement": "Web developer | Building great products DM me for projects"
      }
    ]
  },
  "analysis": {
    "bio": {
      "length": { "current": 45, "recommended": 120 },
      "clarity": 0.85,
      "valueProposition": "Building great products",
      "tone": "professional"
    },
    "name": {
      "memorability": 0.75,
      "relevance": 0.90
    },
    "overall": {
      "professionalism": 0.85,
      "authenticity": 0.70,
      "uniqueness": 0.65
    }
  },
  "suggestions": [
    {
      "id": "bio-cta",
      "category": "bio",
      "type": "addition",
      "priority": "high",
      "title": "Add Call-to-Action",
      "description": "Include a clear CTA to encourage engagement",
      "currentValue": "Web developer | Building great products",
      "suggestedValue": "Web developer | Building great products DM me for projects",
      "rationale": "CTAs increase engagement by 40%",
      "expectedImpact": "moderate"
    }
  ],
  "confidence": 0.82,
  "meta": {
    "userId": "user_abc123",
    "analyzedAt": "2026-01-23T16:00:00Z",
    "processingTimeMs": 1250
  }
}
```

#### Error Response Examples

**400 Bad Request:**
```json
{
  "error": "profile.name is required and must be a string",
  "code": "VALIDATION_ERROR"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "resetAt": "2026-01-23T16:01:00Z"
}
```

---

### 2. Generate Profile Posts

Generate introduction posts based on profile improvements.

#### Endpoint
```
POST /api/v1/ai/profile/fixed-post
```

#### Authentication
Required: NextAuth session

#### Rate Limit
10 requests per minute

#### Request Body

```typescript
{
  profile: {
    name: string;       // Current name
    bio: string;       // Current bio
    location: string;   // Current location
    website: string;    // Current website
  };
  targetAudience: string;    // Target audience (required)
  industry?: string;          // Industry/field (optional)
  variations?: number;       // Number of variations (default: 3, max: 10)
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'controversial'; // Tone (optional)
  includeHashtags?: boolean;  // Include hashtags (default: true)
  maxLength?: number;         // Max character count (default: 280)
}
```

#### Response

**Status Codes:**
- `200 OK` - Posts generated successfully
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Not authenticated
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - AI service not configured

**Success Response (200):**

```json
{
  "variations": [
    {
      "id": "post-1",
      "content": "👋 Hey everyone! I'm excited to announce my updated profile. As a web developer, I help businesses build products that convert.",
      "type": "introduction",
      "tone": "professional",
      "hashtags": ["#WebDev", "#Tech", "#Building"],
      "characterCount": 185,
      "engagementPrediction": {
        "score": 0.75,
        "confidence": 0.70,
        "reasoning": "Clear value proposition with relevant hashtags"
      }
    }
  ],
  "recommendations": {
    "bestTime": "9:00 AM JST",
    "frequency": "2-3 times per week",
    "contentMix": ["introduction", "value_proposition", "storytelling"]
  },
  "confidence": 0.78,
  "meta": {
    "userId": "user_abc123",
    "generatedAt": "2026-01-23T16:00:00Z",
    "processingTimeMs": 1800
  }
}
```

---

### 3. Generate Profile

Generate a complete Twitter profile from scratch.

#### Endpoint
```
POST /api/v1/ai/profile/generate
```

#### Authentication
Required: NextAuth session

#### Rate Limit
10 requests per minute

#### Request Body

```typescript
{
  expertise: string;        // Your background/expertise (required)
  targetAudience: string;   // Who you want to reach (required)
  industry: string;         // Your industry (required)
  goals: string[];           // Primary goals (required, non-empty array)
  uniquePoints?: string[];   // Unique selling points (optional)
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'controversial'; // Tone (optional)
  language?: 'ja' | 'en';  // Language (default: 'ja')
}
```

#### Response

**Status Codes:**
- `200 OK` - Profile generated successfully
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Not authenticated
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - AI service not configured

**Success Response (200):**

```json
{
  "profile": {
    "name": "John Doe | Web Developer",
    "bio": "Building web products that convert businesses 🚀 DM for projects",
    "location": "Tokyo",
    "websiteText": "Portfolio & Services"
  },
  "alternatives": {
    "names": [
      "John | Web Developer",
      "John Doe - Full Stack Dev"
    ],
    "bios": [
      "Web developer helping startups scale 📈",
      "Full-stack dev | React | Node.js | TypeScript"
    ]
  },
  "rationale": {
    "nameExplanation": "Includes both name and role for clarity",
    "bioExplanation": "Under 160 characters, includes value proposition and CTA",
    "overallStrategy": "Professional tone with clear focus on service offering"
  },
  "nextSteps": [
    "Update your Twitter display name",
    "Update your bio",
    "Add location",
    "Update website link"
  ],
  "confidence": 0.85,
  "meta": {
    "userId": "user_abc123",
    "generatedAt": "2026-01-23T16:00:00Z",
    "processingTimeMs": 2100
  }
}
```

---

## Rate Limiting

All endpoints share the following rate limit configuration:

- **Limit:** 10 requests per minute
- **Window:** 60 seconds
- **Scope:** Per user per endpoint

### Rate Limit Headers

All responses include rate limit information in headers:

```
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 2026-01-23T16:01:00Z
```

### Handling Rate Limits

When rate limit is exceeded (HTTP 429):

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "resetAt": "2026-01-23T16:01:00Z"
}
```

The `Retry-After` header will indicate the number of seconds to wait before retrying.

---

## Error Handling

All endpoints follow a consistent error response format:

```typescript
{
  error: string;        // Human-readable error message
  code: string;         // Machine-readable error code
  details?: unknown;    // Additional error details (optional)
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | User not authenticated |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `SERVICE_UNAVAILABLE` | 503 | AI service not configured |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `INVALID_REQUEST` | 400 | Invalid request format |

---

## Examples

### Example 1: Analyze a Profile

```bash
curl -X POST https://api.xboost.now/api/v1/ai/profile/analyze \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "profile": {
      "name": "John Doe",
      "bio": "Web developer",
      "location": "Tokyo",
      "website": "https://example.com"
    },
    "context": {
      "targetAudience": "Startups and SMBs",
      "industry": "Technology",
      "tone": "professional"
    }
  }'
```

### Example 2: Generate Introduction Posts

```bash
curl -X POST https://api.xboost.now/api/v1/ai/profile/fixed-post \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "profile": {
      "name": "John Doe | Web Developer",
      "bio": "Building web products that convert 🚀 DM for projects",
      "location": "Tokyo",
      "website": "https://example.com"
    },
    "targetAudience": "Startups and SMBs",
    "industry": "Technology",
    "variations": 3,
    "tone": "professional"
  }'
```

### Example 3: Generate a New Profile

```bash
curl -X POST https://api.xboost.now/api/v1/ai/profile/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "expertise": "Full-stack web developer with 5 years experience",
    "targetAudience": "Startups looking to build MVPs",
    "industry": "Technology / SaaS",
    "goals": ["Lead generation", "Build portfolio", "Find freelance work"],
    "uniquePoints": ["Fast delivery", "Full-stack expertise", "Startup background"],
    "tone": "professional",
    "language": "ja"
  }'
```

---

## Implementation Details

### AI Model
- **Model:** OpenAI GPT-4o-mini
- **Temperature:** 0.7 (balanced creativity and consistency)
- **Max Tokens:** 3000

### Rate Limiting Implementation
- Session-based in-memory rate limiting
- Stored per user per endpoint
- Automatic cleanup of expired entries

### Logging
- All requests are logged with user ID and processing time
- Errors are logged with stack traces for debugging

---

## Future Enhancements

Potential improvements for future versions:

1. **Batch Analysis** - Analyze multiple profiles in a single request
2. **A/B Testing** - Generate multiple profile versions for testing
3. **Image Analysis** - Include profile/banner image analysis
4. **Historical Tracking** - Track profile changes over time
5. **Competitor Analysis** - Compare with competitor profiles
6. **Multi-language Support** - Support more languages beyond Japanese/English

---

## Support

For issues or questions:
- GitHub Issues: [https://github.com/your-repo/issues](https://github.com/your-repo/issues)
- Documentation: [https://docs.xboost.now](https://docs.xboost.now)
