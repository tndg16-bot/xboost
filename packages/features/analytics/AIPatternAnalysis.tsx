'use client';

import { useState, useEffect } from 'react';

const colors = {
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
  'gray-200': '#E5E7EB',
  'gray-500': '#6B7280',
  'gray-700': '#374151',
  'gray-900': '#111827',
  'blue-500': '#1DA1F2',
  'blue-600': '#0284C7',
  'green-500': '#17BF63',
  'green-600': '#16A34A',
  'red-500': '#EF4444',
  'yellow-500': '#F59E0B',
  'yellow-100': '#FEF3C7',
  'purple-500': '#8B5CF6',
  'purple-100': '#EDE9FE',
} as const;

interface AIReproduciblePattern {
  patternId: string;
  patternName: string;
  description: string;
  successRate: number;
  avgEngagement: number;
  examples: string[];
  actionability: 'high' | 'medium' | 'low';
}

interface PatternInsights {
  summary: string;
  topPatterns: string[];
  recommendations: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
}

interface AIAnalysisResponse {
  period: string;
  startDate: string;
  endDate: string;
  totalPosts: number;
  analyzedPosts: number;
  discoveredPatterns: AIReproduciblePattern[];
  highPerformingTopics: string[];
  bestFormats: string[];
  insights: PatternInsights;
  error?: string;
}

export const AIPatternAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [response, setResponse] = useState<AIAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'patterns' | 'topics' | 'insights'>('patterns');

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/v1/analytics/ai-patterns?period=${period}`);
      if (!res.ok) {
        throw new Error('Failed to fetch AI patterns');
      }
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    fetchAnalysis().finally(() => setAnalyzing(false));
  };

  const handlePeriodChange = (newPeriod: typeof period) => {
    setPeriod(newPeriod);
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high':
        return { bg: colors['green-500'], text: 'text-green-600' };
      case 'medium':
        return { bg: colors['yellow-500'], text: 'text-yellow-600' };
      case 'low':
        return { bg: colors['red-500'], text: 'text-red-600' };
      default:
        return { bg: colors['gray-500'], text: 'text-gray-600' };
    }
  };

  const getActionabilityBadge = (actionability: string) => {
    switch (actionability) {
      case 'high':
        return {
          bg: colors['green-500'],
          text: 'Easy to implement',
        };
      case 'medium':
        return {
          bg: colors['yellow-500'],
          text: 'Moderate effort',
        };
      case 'low':
        return {
          bg: colors['red-500'],
          text: 'Challenging',
        };
      default:
        return {
          bg: colors['gray-500'],
          text: 'Unknown',
        };
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">AI Pattern Analysis</h3>
        </div>
        <div className="p-6 text-center text-gray-500">Loading AI analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">AI Pattern Analysis</h3>
        </div>
        <div className="p-6 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const { discoveredPatterns, highPerformingTopics, bestFormats, insights } = response;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Pattern Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">
              Discover reproducible success patterns using AI
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value as typeof period)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md"
            >
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
              <option value="1y">1 year</option>
            </select>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50"
              style={{ backgroundColor: colors['blue-500'] }}
            >
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Summary */}
        <div className="mb-6">
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: `${colors['purple-100']}` }}
          >
            <p className="text-sm text-gray-700">{insights.summary}</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-gray-600">Confidence: </span>
              <span
                className="font-semibold"
                style={{
                  color:
                    getConfidenceColor(insights.confidenceLevel).bg,
                }}
              >
                {insights.confidenceLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('patterns')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'patterns'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Patterns
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'topics'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Topics
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'insights'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Insights
            </button>
          </div>
        </div>

        {activeTab === 'patterns' && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Reproducible Patterns ({discoveredPatterns.length} found)
            </h4>
            <div className="space-y-3">
              {discoveredPatterns.map((pattern, index) => (
                <div
                  key={pattern.patternId}
                  className="border border-gray-200 rounded-lg p-4"
                  style={{
                    backgroundColor: index === 0 ? `${colors['yellow-100']}` : 'transparent',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: colors['yellow-500'],
                          color: 'white',
                        }}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900">
                          {pattern.patternName}
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">
                          {pattern.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 text-xs rounded-full font-medium"
                      style={{
                        backgroundColor: `${getActionabilityBadge(pattern.actionability).bg}20`,
                        color: getActionabilityBadge(pattern.actionability).bg,
                      }}
                    >
                      {getActionabilityBadge(pattern.actionability).text}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs mb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Success Rate:</span>
                      <span
                        className="font-semibold"
                        style={{ color: colors['green-500'] }}
                      >
                        {(pattern.successRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg Engagement:</span>
                      <span
                        className="font-semibold"
                        style={{ color: colors['blue-500'] }}
                      >
                        {pattern.avgEngagement.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {pattern.examples.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2 font-medium">
                        Examples:
                      </p>
                      <div className="space-y-1">
                        {pattern.examples.map((example, i) => (
                          <p
                            key={i}
                            className="text-xs text-gray-700 italic p-2 rounded"
                            style={{ backgroundColor: colors['gray-50'] }}
                          >
                            "{example}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                High-Performing Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {highPerformingTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm rounded-full font-medium"
                    style={{
                      backgroundColor: `${colors['blue-500']}10`,
                      color: colors['blue-600'],
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Best Performing Formats
              </h4>
              <div className="flex flex-wrap gap-2">
                {bestFormats.map((format, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm rounded-full font-medium"
                    style={{
                      backgroundColor: `${colors['green-500']}10`,
                      color: colors['green-600'],
                    }}
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              AI-Generated Insights
            </h4>
            <div className="space-y-2">
              {insights.topPatterns.length > 0 && (
                <div
                  className="p-3 rounded-lg border border-gray-100"
                  style={{ backgroundColor: `${colors['green-500']}10` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: colors['green-500'] }}>🏆</span>
                    <span className="text-sm font-semibold text-gray-900">
                      Top Pattern
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-semibold">
                    {insights.topPatterns[0]}
                  </p>
                </div>
              )}

              {insights.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg border border-gray-100 text-sm"
                >
                  <span
                    className="flex-shrink-0"
                    style={{ color: colors['blue-500'] }}
                  >
                    {index + 1}.
                  </span>
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg text-xs text-gray-600">
              <p className="mb-2">
                <strong>⚠️ Disclaimer:</strong> AI analysis is based on historical data and
                patterns. Results may vary based on audience, timing, and external
                factors.
              </p>
              <p>
                <strong>💡 Tip:</strong> Test these patterns with A/B testing to validate
                their effectiveness before committing to them.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
