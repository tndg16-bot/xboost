import { NextResponse } from 'next/server';
import { withApiAuthAndRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { getValidClient } from '@/lib/twitter-client';
import { withRetry } from '@/lib/twitter-rate-limiter';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_GIF_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_SIZE = 512 * 1024 * 1024; // 512MB

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const ALLOWED_VIDEO_TYPES = ['video/mp4'];

/**
 * POST /api/v1/media/upload
 * Upload media to Twitter and return media_id for attaching to posts
 *
 * Accepts multipart/form-data with:
 * - file: the media file
 * - twitterAccountId: which account to upload for
 */
export async function POST(request: Request) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const limitInfo = await checkRateLimit(request);
  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const twitterAccountId = formData.get('twitterAccountId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required', code: 'MISSING_FILE' },
        { status: 400 }
      );
    }

    if (!twitterAccountId) {
      return NextResponse.json(
        { error: 'twitterAccountId is required', code: 'MISSING_ACCOUNT' },
        { status: 400 }
      );
    }

    // Verify account ownership
    const account = await db.twitterAccount.findFirst({
      where: { id: twitterAccountId, userId: user!.id },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Twitter account not found', code: 'ACCOUNT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const mimeType = file.type;
    const fileSize = file.size;

    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${mimeType}. Allowed: ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(', ')}`,
          code: 'INVALID_FILE_TYPE',
        },
        { status: 400 }
      );
    }

    // Validate file size
    const isAnimatedGif = mimeType === 'image/gif';
    const maxSize = isVideo
      ? MAX_VIDEO_SIZE
      : isAnimatedGif
        ? MAX_GIF_SIZE
        : MAX_IMAGE_SIZE;

    if (fileSize > maxSize) {
      return NextResponse.json(
        {
          error: `File too large (${Math.round(fileSize / 1024 / 1024)}MB). Max: ${Math.round(maxSize / 1024 / 1024)}MB`,
          code: 'FILE_TOO_LARGE',
        },
        { status: 400 }
      );
    }

    // Get Twitter client and upload
    const client = await getValidClient(twitterAccountId);
    const buffer = Buffer.from(await file.arrayBuffer());

    const mediaId = await withRetry(
      () => client.v1.uploadMedia(buffer, { mimeType }),
      { maxRetries: 2 }
    );

    const response = NextResponse.json(
      {
        mediaId,
        type: isVideo ? 'video' : 'image',
        size: fileSize,
        mimeType,
      },
      { status: 201 }
    );
    return addRateLimitHeaders(response, limitInfo);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Media upload failed:', error);

    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}`, code: 'UPLOAD_FAILED' },
      { status: 500 }
    );
  }
}
