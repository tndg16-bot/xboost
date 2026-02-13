import React from 'react';
import Link from 'next/link';

/**
 * Error Boundary Component
 * Sprint 4: Error Handling Improvement (Issue #132)
 */

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service (Sentry)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // TODO: Send to Sentry when SENTRY_DSN is configured
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-3xl font-bold text-gray-900">
              エラーが発生しました
            </h1>
            <p className="text-gray-600 mt-2">
              申し訳ありませんが、予期しないエラーが発生しました。
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm overflow-auto">
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            )}
            
            <div className="mt-8 space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ページを再読み込み
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors inline-block"
              >
                トップページへ
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p>問題が続く場合は、以下までご連絡ください：</p>
              <a href="mailto:support@xboost.now" className="text-blue-600 hover:underline">
                support@xboost.now
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
