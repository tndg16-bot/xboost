import { TwitterApi } from 'twitter-api-v2';
import { prisma } from './prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/**
 * Create a Twitter API client with user OAuth 2.0 access token
 * Used for posting, reading metrics, etc.
 */
export function createUserClient(accessToken: string): TwitterApi {
  return new TwitterApi(accessToken);
}

/**
 * Create an app-only Twitter API client (Bearer token)
 * Used for reading public data (no user context)
 */
export function createAppClient(): TwitterApi {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    throw new Error('TWITTER_BEARER_TOKEN is not configured');
  }
  return new TwitterApi(bearerToken);
}

/**
 * Token refresh: exchange refresh token for new access token
 * X OAuth 2.0 access tokens expire after ~2 hours
 */
async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const clientId = process.env.AUTH_TWITTER_ID;
  const clientSecret = process.env.AUTH_TWITTER_SECRET;

  if (!clientId) {
    throw new Error('AUTH_TWITTER_ID is not configured');
  }

  const client = new TwitterApi({
    clientId,
    clientSecret,
  });

  const {
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn,
  } = await client.refreshOAuth2Token(refreshToken);

  return {
    accessToken,
    refreshToken: newRefreshToken || refreshToken,
    expiresIn,
  };
}

/**
 * Get a valid Twitter API client for a specific TwitterAccount
 * Automatically refreshes the access token if expired or expiring soon
 */
export async function getValidClient(
  twitterAccountId: string
): Promise<TwitterApi> {
  const account = await db.twitterAccount.findUnique({
    where: { id: twitterAccountId },
  });

  if (!account) {
    throw new Error(`TwitterAccount not found: ${twitterAccountId}`);
  }

  if (!account.accessToken) {
    throw new Error(
      `TwitterAccount ${twitterAccountId} has no access token. User needs to re-authenticate.`
    );
  }

  // Check if token needs refresh (expired or expiring within 5 minutes)
  const needsRefresh =
    account.tokenExpiresAt &&
    new Date(account.tokenExpiresAt).getTime() - Date.now() < 5 * 60 * 1000;

  if (needsRefresh && account.refreshToken) {
    try {
      const { accessToken, refreshToken, expiresIn } =
        await refreshAccessToken(account.refreshToken);

      // Update tokens in database
      await db.twitterAccount.update({
        where: { id: twitterAccountId },
        data: {
          accessToken,
          refreshToken,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        },
      });

      return new TwitterApi(accessToken);
    } catch (error) {
      console.error(
        `Token refresh failed for account ${twitterAccountId}:`,
        error
      );
      // If refresh fails but token hasn't expired yet, try with existing token
      if (
        account.tokenExpiresAt &&
        new Date(account.tokenExpiresAt).getTime() > Date.now()
      ) {
        return new TwitterApi(account.accessToken);
      }
      throw new Error(
        `Token refresh failed for account ${account.username}. User needs to re-authenticate.`
      );
    }
  }

  return new TwitterApi(account.accessToken);
}
