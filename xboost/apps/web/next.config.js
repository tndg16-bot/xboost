/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '.'),
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@xboost/ui': path.resolve(__dirname, 'packages/ui'),
      '@xboost/ai-post-generation': path.resolve(__dirname, 'packages/features/ai-post-generation'),
      '@xboost/ai-profile-creation': path.resolve(__dirname, 'packages/features/ai-profile-creation'),
      '@xboost/ai-rewrite': path.resolve(__dirname, 'packages/features/ai-rewrite'),
      '@xboost/analytics': path.resolve(__dirname, 'packages/features/analytics'),
      '@xboost/automation': path.resolve(__dirname, 'packages/features/automation'),
      '@xboost/empathy-post': path.resolve(__dirname, 'packages/features/empathy-post'),
      '@xboost/empathy-posts': path.resolve(__dirname, 'packages/features/empathy-posts'),
      '@xboost/follower-based-suggestions': path.resolve(__dirname, 'packages/features/follower-based-suggestions'),
      '@xboost/multi-account': path.resolve(__dirname, 'packages/features/multi-account'),
      '@xboost/personal-brand': path.resolve(__dirname, 'packages/features/personal-brand'),
      '@xboost/post-editor': path.resolve(__dirname, 'packages/features/post-editor'),
      '@xboost/profile-editing': path.resolve(__dirname, 'packages/features/profile-editing'),
      '@xboost/scheduling': path.resolve(__dirname, 'packages/features/scheduling'),
      '@xboost/topic-proposal': path.resolve(__dirname, 'packages/features/topic-proposal'),
    };
    return config;
  },
  turbopack: {},
};

module.exports = nextConfig;
