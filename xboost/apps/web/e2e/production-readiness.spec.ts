import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite for Xboost
 * Sprint 4: Production Readiness Testing
 */

// Authentication Tests
test.describe('Authentication', () => {
  test('should redirect to signin when accessing protected page', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL(/.*signin.*/);
  });

  test('should show signin page', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.getByText('Xでログイン')).toBeVisible();
  });

  test('should handle auth error page', async ({ page }) => {
    await page.goto('/auth/error');
    await expect(page.getByText('エラーが発生しました')).toBeVisible();
  });
});

// Landing Page Tests
test.describe('Landing Page', () => {
  test('should display landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('発信をプロダクトが')).toBeVisible();
    await expect(page.getByText('売れる導線に')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    const signinLink = page.getByRole('link', { name: /ログイン|始める/ });
    await expect(signinLink).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('発信をプロダクトが')).toBeVisible();
    
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByText('発信をプロダクトが')).toBeVisible();
  });
});

// Syntax Reference Page Tests
test.describe('Syntax Reference Page', () => {
  test('should display syntax reference page', async ({ page }) => {
    await page.goto('/syntax-reference');
    await expect(page.getByText('構文リファレンス')).toBeVisible();
  });

  test('should have all syntax categories', async ({ page }) => {
    await page.goto('/syntax-reference');
    
    await expect(page.getByText('基本構文')).toBeVisible();
    await expect(page.getByText('スレッド')).toBeVisible();
    await expect(page.getByText('引用・リプライ')).toBeVisible();
    await expect(page.getByText('メディア')).toBeVisible();
    await expect(page.getByText('コツ・ベストプラクティス')).toBeVisible();
  });
});

// Error Handling Tests
test.describe('Error Handling', () => {
  test('should show 404 for non-existent page', async ({ page }) => {
    await page.goto('/non-existent-page-12345');
    await expect(page.getByText(/404|Not Found|ページが見つかりません/)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('/api/health', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    await page.goto('/api/health');
    const response = await page.evaluate(() => fetch('/api/health').then(r => r.status));
    expect(response).toBe(500);
  });
});

// SEO & Meta Tests
test.describe('SEO & Metadata', () => {
  test('should have correct meta tags on homepage', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Xboost/);
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('X運用');
  });

  test('should have OG tags', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
  });
});

// Accessibility Tests
test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThanOrEqual(1);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});

// Performance Tests
test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(5000); // 5 seconds
  });
});
