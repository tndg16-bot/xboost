import { NextRequest, NextResponse } from 'next/server';
import { generatePostPatterns, PostGenerationOptions } from '@/services/post-generator';

/**
 * POST /api/v1/ai/posts/generate
 * Generates 3 pattern variations of a post (empathy, useful, entertainment)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      theme,
      targetAudience,
      tone,
      includeHashtags,
      maxLength,
    } = body;

    // Validation
    if (!theme || typeof theme !== 'string') {
      return NextResponse.json(
        { error: 'theme is required and must be a string' },
        { status: 400 }
      );
    }

    if (theme.length === 0 || theme.length > 500) {
      return NextResponse.json(
        { error: 'theme must be between 1 and 500 characters' },
        { status: 400 }
      );
    }

    // Build options
    const options: PostGenerationOptions = {
      theme,
      targetAudience: targetAudience || undefined,
      tone: tone || undefined,
      includeHashtags: includeHashtags !== false,
      maxLength: maxLength || 280,
    };

    // Generate patterns
    const patterns = await generatePostPatterns(options);

    return NextResponse.json({ patterns });
  } catch (error) {
    console.error('Error generating post patterns:', error);

    // Handle AI API errors
    if (error instanceof Error) {
      if (error.message.includes('AI API key not configured')) {
        return NextResponse.json(
          { error: 'AI service not configured' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate post patterns' },
      { status: 500 }
    );
  }
}
