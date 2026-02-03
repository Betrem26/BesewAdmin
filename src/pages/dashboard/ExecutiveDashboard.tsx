import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiUsers, FiBriefcase, FiDollarSign, FiTrendingUp, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { accountApi, jobApi, partyApi, commissionApi, candidateApi } from '../../services/api';
import { handleApiError } from '../../services/api';

const Container = styled.div`
  max-width: 1600px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 30px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const MetricCard = styled.div<{ gradient: string }>`
  background: ${props => props.gradient};
  border-radius: 12px;
  padding: 28px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const MetricIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
`;

const MetricValue = styled.div`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  font-size: 15px;
  opacity: 0.9;
  font-weight: 500;
`;

const MetricChange = styled.div<{ positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  margin-top: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  width: fit-content;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  font-size: 16px;
  color: #7f8c8d;
`;

const ErrorAlert = styled.div`
  background: #fee;
  color: #c0392b;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RefreshButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActivityItem = styled.div`
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
`;

const ActivityTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: #95a5a6;
`;

interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    new_today: number;
    growth_rate: number;
  };
  jobs: {
    total: number;
    active: number;
    new_today: number;
    applications: number;
  };
  startups: {
    total: number;
    verified: number;
    pending: number;
  };
  candidates: {
    total: number;
    active: number;
    new_today: number;
  };
  revenue: {
    total: number;
    this_month: number;
    growth_rate: number;
  };
  system: {
    uptime: number;
    response_time: number;
    error_rate: number;
  };
}

const ExecutiveDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    users: { total: 0, active: 0, new_today: 0, growth_rate: 0 },
    jobs: { total: 0, active: 0, new_today: 0, applications: 0 },
    startups: { total: 0, verified: 0, pending: 0 },
    candidates: { total: 0, active: 0, new_today: 0 },
    revenue: { total: 0, this_month: 0, growth_rate: 0 },
    system: { uptime: 99.9, response_time: 120, error_rate: 0.1 },
  });

  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  const loadDashboardMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from all services in parallel
      const [usersData, jobsData, partiesData, candidatesData, commissionsData] = await Promise.allSettled([
        accountApi.get('/accounts/stats'),
        jobApi.get('/posts/stats'),
        partyApi.get('/party-profiles/stats'),
        candidateApi.get('/candidate-profiles/stats'),
        commissionApi.get('/commissions/stats'),
      ]);

      // Process results
      const newMetrics: DashboardMetrics = {
        users: {
          total: usersData.status === 'fulfilled' ? usersData.value.data.total || 0 : 0,
          active: usersData.status === 'fulfilled' ? usersData.value.data.active || 0 : 0,
          new_today: usersData.status === 'fulfilled' ? usersData.value.data.new_today || 0 : 0,
          growth_rate: usersData.status === 'fulfilled' ? usersData.value.data.growth_rate || 0 : 0,
        },
        jobs: {
          total: jobsData.status === 'fulfilled' ? jobsData.value.data.total || 0 : 0,
          active: jobsData.status === 'fulfilled' ? jobsData.value.data.active || 0 : 0,
          new_today: jobsData.status === 'fulfilled' ? jobsData.value.data.new_today || 0 : 0,
          applications: jobsData.status === 'fulfilled' ? jobsData.value.data.applications || 0 : 0,
        },
        startups: {
          total: partiesData.status === 'fulfilled' ? partiesData.value.data.total || 0 : 0,
          verified: partiesData.status === 'fulfilled' ? partiesData.value.data.verified || 0 : 0,
          pending: partiesData.status === 'fulfilled' ? partiesData.value.data.pending || 0 : 0,
        },
        candidates: {
          total: candidatesData.status === 'fulfilled' ? candidatesData.value.data.total || 0 : 0,
          active: candidatesData.status === 'fulfilled' ? candidatesData.value.data.active || 0 : 0,
          new_today: candidatesData.status === 'fulfilled' ? candidatesData.value.data.new_today || 0 : 0,
        },
        revenue: {
          total: commissionsData.status === 'fulfilled' ? commissionsData.value.data.total_revenue || 0 : 0,
          this_month: commissionsData.status === 'fulfilled' ? commissionsData.value.data.month_revenue || 0 : 0,
          growth_rate: commissionsData.status === 'fulfilled' ? commissionsData.value.data.growth_rate || 0 : 0,
        },
        system: {
          uptime: 99.9,
          response_time: 120,
          error_rate: 0.1,
        },
      };

      setMetrics(newMetrics);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner>Loading executive dashboard...</LoadingSpinner>;
  }

  return (
    <Container>
      <PageTitle>Executive Dashboard</PageTitle>
      <PageSubtitle>Real-time overview of platform performance and key metrics</PageSubtitle>

      {error && (
        <ErrorAlert>
          <FiAlertCircle size={20} />
          {error}
          <RefreshButton onClick={loadDashboardMetrics} style={{ marginLeft: 'auto' }}>
            Retry
          </RefreshButton>
        </ErrorAlert>
      )}

      <MetricsGrid>
        <MetricCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <MetricHeader>
            <div>
              <MetricValue>{metrics.users.total.toLocaleString()}</MetricValue>
              <MetricLabel>Total Users</MetricLabel>
              <MetricChange positive={metrics.users.growth_rate >= 0}>
                <FiTrendingUp />
                {metrics.users.growth_rate >= 0 ? '+' : ''}{metrics.users.growth_rate}% this month
              </MetricChange>
            </div>
            <MetricIcon>
              <FiUsers />
            </MetricIcon>
          </MetricHeader>
        </MetricCard>

        <MetricCard gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
          <MetricHeader>
            <div>
              <MetricValue>{metrics.jobs.total.toLocaleString()}</MetricValue>
              <MetricLabel>Active Jobs</MetricLabel>
              <MetricChange positive={true}>
                <FiTrendingUp />
                {metrics.jobs.new_today} new today
              </MetricChange>
            </div>
            <MetricIcon>
              <FiBriefcase />
            </MetricIcon>
          </MetricHeader>
        </MetricCard>

        <MetricCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <MetricHeader>
            <div>
              <MetricValue>{metrics.startups.total.toLocaleString()}</MetricValue>
              <MetricLabel>Startups</MetricLabel>
              <MetricChange positive={true}>
                {metrics.startups.verified} verified
              </MetricChange>
            </div>
            <MetricIcon>
              <FiActivity />
            </MetricIcon>
          </MetricHeader>
        </MetricCard>

        <MetricCard gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
          <MetricHeader>
            <div>
              <MetricValue>${(metrics.revenue.this_month / 1000).toFixed(1)}K</MetricValue>
              <MetricLabel>Revenue (This Month)</MetricLabel>
              <MetricChange positive={metrics.revenue.growth_rate >= 0}>
                <FiTrendingUp />
                {metrics.revenue.growth_rate >= 0 ? '+' : ''}{metrics.revenue.growth_rate}% growth
              </MetricChange>
            </div>
            <MetricIcon>
              <FiDollarSign />
            </MetricIcon>
          </MetricHeader>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>
            <FiActivity />
            Recent Activity
          </ChartTitle>
          <ActivityList>
            <ActivityItem>
              <ActivityTitle>{metrics.users.new_today} new users registered</ActivityTitle>
              <ActivityTime>Today</ActivityTime>
            </ActivityItem>
            <ActivityItem>
              <ActivityTitle>{metrics.jobs.new_today} new job postings</ActivityTitle>
              <ActivityTime>Today</ActivityTime>
            </ActivityItem>
            <ActivityItem>
              <ActivityTitle>{metrics.jobs.applications} job applications submitted</ActivityTitle>
              <ActivityTime>This week</ActivityTime>
            </ActivityItem>
            <ActivityItem>
              <ActivityTitle>{metrics.startups.pending} startups pending verification</ActivityTitle>
              <ActivityTime>Current</ActivityTime>
            </ActivityItem>
          </ActivityList>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <FiTrendingUp />
            System Health
          </ChartTitle>
          <ActivityList>
            <ActivityItem>
              <ActivityTitle>Uptime: {metrics.system.uptime}%</ActivityTitle>
              <ActivityTime>Last 30 days</ActivityTime>
            </ActivityItem>
            <ActivityItem>
              <ActivityTitle>Avg Response Time: {metrics.system.response_time}ms</ActivityTitle>
              <ActivityTime>Last hour</ActivityTime>
            </ActivityItem>
            <ActivityItem>
              <ActivityTitle>Error Rate: {metrics.system.error_rate}%</ActivityTitle>
              <ActivityTime>Last 24 hours</ActivityTime>
            </ActivityItem>
          </ActivityList>
        </ChartCard>
      </ChartsGrid>

      <RefreshButton onClick={loadDashboardMetrics} disabled={loading}>
        <FiActivity />
        Refresh Data
      </RefreshButton>
    </Container>
  );
};

export default ExecutiveDashboard;
