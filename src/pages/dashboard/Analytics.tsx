import React, { useState, useEffect } from 'react';
import LineChart from '../../components/charts/LineChart';
import { BarChart } from '../../components/charts/BarChart';
import { PieChart } from '../../components/charts/PieChart';
import { AreaChart } from '../../components/charts/AreaChart';
import { Heatmap } from '../../components/charts/Heatmap';
import {
  accountStatsApi,
  jobStatsApi,
} from '../../services/statisticsApi';

interface AnalyticsData {
  userRegistrationTrend: Array<{ label: string; value: number }>;
  jobPostingActivity: Array<{ label: string; value: number }>;
  applicationConversionRate: Array<{ date: string; applications: number; conversions: number }>;
  revenueTrend: Array<{ label: string; value: number }>;
  serviceUptime: Array<{ name: string; value: number }>;
  activityHeatmap: Array<{ day: string; hour: number; value: number }>;
  userDistribution: Array<{ name: string; value: number }>;
  jobCategoryDistribution: Array<{ name: string; value: number }>;
}

export const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real statistics from new INSA-compliant endpoints
      let accountStats = { activeUsers: 150, totalUsers: 250, suspendedUsers: 10 };
      let jobCategoryDist: Array<{ name: string; value: number }> = [];

      try {
        // Use new statistics API endpoints
        const [accounts, jobs] = await Promise.all([
          accountStatsApi.getStats().catch(() => null),
          jobStatsApi.getStats().catch(() => null)
        ]);

        if (accounts) {
          accountStats = {
            activeUsers: accounts.activeUsers || accounts.totalAccounts || 150,
            totalUsers: accounts.totalAccounts || accounts.totalUsers || 250,
            suspendedUsers: accounts.suspendedUsers || accounts.suspendedAccounts || 10
          };
        }

        if (jobs) {
          // jobStats usage was removed but we keep the fetch for now if needed in future
        }

        // Fetch job category distribution
        try {
          const categoryDist = await jobStatsApi.getCategoryDistribution();
          if (categoryDist && Array.isArray(categoryDist)) {
            jobCategoryDist = categoryDist.map((cat: any) => ({
              name: cat.category || cat.name || 'Unknown',
              value: cat.count || cat.value || 0
            }));
          }
        } catch (err) {
          console.warn('Job category distribution not available:', err);
        }

      } catch (err) {
        console.warn('Statistics endpoints not fully available, using fallback data:', err);
      }

      // Generate trend data (in production, this would come from backend)
      const userRegistrationTrend = generateTrendData(timeRange, 50, 200);
      const jobPostingActivity = generateTrendData(timeRange, 10, 50);
      const revenueTrend = generateRevenueTrend(timeRange);
      const applicationConversionRate = generateConversionData(timeRange);
      const activityHeatmap = generateHeatmapData();

      setData({
        userRegistrationTrend,
        jobPostingActivity,
        applicationConversionRate,
        revenueTrend,
        serviceUptime: [
          { name: 'Account', value: 99.9 },
          { name: 'Job', value: 99.5 },
          { name: 'Party', value: 99.8 },
          { name: 'Candidate', value: 99.7 },
          { name: 'Commission', value: 99.6 },
          { name: 'Notification', value: 99.4 },
          { name: 'Psychometric', value: 99.3 },
          { name: 'Employee', value: 99.8 },
        ],
        activityHeatmap,
        userDistribution: [
          { name: 'Active', value: accountStats.activeUsers },
          { name: 'Inactive', value: accountStats.totalUsers - accountStats.activeUsers },
          { name: 'Suspended', value: accountStats.suspendedUsers },
        ],
        jobCategoryDistribution: jobCategoryDist.length > 0 ? jobCategoryDist : [
          { name: 'Technology', value: 45 },
          { name: 'Healthcare', value: 30 },
          { name: 'Finance', value: 25 },
          { name: 'Education', value: 20 },
          { name: 'Retail', value: 15 },
          { name: 'Other', value: 10 },
        ],
      });
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to generate mock data
  const generateTrendData = (range: string, min: number, max: number) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * (max - min) + min),
      });
    }
    return data;
  };

  const generateRevenueTrend = (range: string) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * 50000 + 10000),
      });
    }
    return data;
  };

  const generateConversionData = (range: string) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const applications = Math.floor(Math.random() * 100 + 50);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications,
        conversions: Math.floor(applications * (Math.random() * 0.3 + 0.1)),
      });
    }
    return data;
  };

  const generateHeatmapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [];

    for (const day of days) {
      for (let hour = 0; hour < 24; hour++) {
        // Simulate higher activity during business hours
        let value = Math.floor(Math.random() * 20);
        if (hour >= 9 && hour <= 17 && !['Sat', 'Sun'].includes(day)) {
          value = Math.floor(Math.random() * 80 + 20);
        }
        data.push({ day, hour, value });
      }
    }
    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchAnalyticsData}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive platform analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === '7d'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === '30d'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === '90d'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* User Registration Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <LineChart
          data={data.userRegistrationTrend}
          title="User Registration Trend"
          height={300}
          color="#3B82F6"
        />
      </div>

      {/* Job Posting Activity & Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <LineChart
            data={data.jobPostingActivity}
            title="Job Posting Activity"
            height={300}
            color="#10B981"
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <LineChart
            data={data.revenueTrend}
            title="Revenue Trend"
            height={300}
            color="#F59E0B"
          />
        </div>
      </div>

      {/* Application Conversion Rate */}
      <div className="bg-white rounded-lg shadow p-6">
        <AreaChart
          data={data.applicationConversionRate}
          dataKeys={[
            { key: 'applications', color: '#3B82F6', name: 'Applications' },
            { key: 'conversions', color: '#10B981', name: 'Conversions' },
          ]}
          xAxisKey="date"
          title="Application Conversion Rate"
          height={300}
        />
      </div>

      {/* Service Uptime & Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <BarChart
            data={data.serviceUptime}
            dataKey="value"
            xAxisKey="name"
            title="Service Uptime (%)"
            height={300}
            colors={['#10B981']}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <PieChart
            data={data.userDistribution}
            title="User Distribution"
            height={300}
          />
        </div>
      </div>

      {/* Job Category Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <PieChart
          data={data.jobCategoryDistribution}
          title="Job Category Distribution"
          height={300}
          innerRadius={60}
          outerRadius={100}
        />
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white rounded-lg shadow p-6">
        <Heatmap
          data={data.activityHeatmap}
          title="Platform Activity Heatmap (Last 7 Days)"
          height={400}
        />
      </div>
    </div>
  );
};
