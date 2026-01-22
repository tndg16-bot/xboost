import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@xboost/ui', '@xboost/multi-account', '@xboost/post-editor', '@xboost/scheduling', '@xboost/automation'],
};

export default nextConfig;
