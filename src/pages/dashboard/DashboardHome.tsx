import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiUsers, FiHeadphones, FiAlertCircle, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import { customerSupportApi } from '../../services/customerSupportApi';
import { accountReportsApi } from '../../services/accountReportsApi';
import { jobCategoryApi } from '../../services/jobCategoryApi';

const Container = styled.div`
  max-width: 1400px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 30px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div<{ color: string }>`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${props => props.color};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StatIcon = styled.div<{ bgColor: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
`;

const StatChange = styled.div<{ positive: boolean }>`
  font-size: 12px;
  color: ${props => props.positive ? '#27ae60' : '#e74c3c'};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActivityItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #ecf0f1;

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: #95a5a6;
`;

const QuickActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const QuickActionButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #2980b9;
  }

  svg {
    font-size: 18px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c0392b;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const DashboardHome: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    tickets: { total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 },
    reports: { total: 0, pending: 0, under_review: 0, resolved: 0, dismissed: 0 },
    categories: { total: 0, adminAdded: 0 },
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ticketStats, reportStats, categoryStats] = await Promise.all([
        customerSupportApi.getTicketStats().catch(() => ({ total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 })),
        accountReportsApi.getReportStats().catch(() => ({ total: 0, pending: 0, under_review: 0, resolved: 0, dismissed: 0 })),
        jobCategoryApi.getCategoryStats().catch(() => ({ total: 0, adminAdded: 0, byCompanyType: {}, byLanguage: {} })),
      ]);

      setStats({
        tickets: ticketStats,
        reports: reportStats,
        categories: { total: categoryStats.total, adminAdded: categoryStats.adminAdded },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingMessage>Loading dashboard...</LoadingMessage>;
  }

  return (
    <Container>
      <PageTitle>Dashboard Overview</PageTitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StatsGrid>
        <StatCard color="#3498db">
          <StatHeader>
            <div>
              <StatValue>{stats.tickets.total}</StatValue>
              <StatLabel>Support Tickets</StatLabel>
              <StatChange positive={false}>
                {stats.tickets.open} open
              </StatChange>
            </div>
            <StatIcon bgColor="#3498db">
              <FiHeadphones />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard color="#e74c3c">
          <StatHeader>
            <div>
              <StatValue>{stats.reports.total}</StatValue>
              <StatLabel>Account Reports</StatLabel>
              <StatChange positive={false}>
                {stats.reports.pending} pending
              </StatChange>
            </div>
            <StatIcon bgColor="#e74c3c">
              <FiAlertCircle />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard color="#9b59b6">
          <StatHeader>
            <div>
              <StatValue>{stats.categories.total}</StatValue>
              <StatLabel>Job Categories</StatLabel>
              <StatChange positive={true}>
                {stats.categories.adminAdded} admin-added
              </StatChange>
            </div>
            <StatIcon bgColor="#9b59b6">
              <FiBriefcase />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard color="#27ae60">
          <StatHeader>
            <div>
              <StatValue>{stats.tickets.resolved}</StatValue>
              <StatLabel>Resolved Tickets</StatLabel>
              <StatChange positive={true}>
                <FiTrendingUp /> This month
              </StatChange>
            </div>
            <StatIcon bgColor="#27ae60">
              <FiUsers />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <SectionGrid>
        <Section>
          <SectionTitle>
            <FiHeadphones />
            Recent Support Tickets
          </SectionTitle>
          <ActivityItem>
            <ActivityTitle>New ticket: Login Issue</ActivityTitle>
            <ActivityTime>2 minutes ago</ActivityTime>
          </ActivityItem>
          <ActivityItem>
            <ActivityTitle>Ticket resolved: Payment Problem</ActivityTitle>
            <ActivityTime>15 minutes ago</ActivityTime>
          </ActivityItem>
          <ActivityItem>
            <ActivityTitle>New ticket: Profile Update Error</ActivityTitle>
            <ActivityTime>1 hour ago</ActivityTime>
          </ActivityItem>
        </Section>

        <Section>
          <SectionTitle>
            <FiAlertCircle />
            Recent Account Reports
          </SectionTitle>
          <ActivityItem>
            <ActivityTitle>New report: Suspicious Activity</ActivityTitle>
            <ActivityTime>5 minutes ago</ActivityTime>
          </ActivityItem>
          <ActivityItem>
            <ActivityTitle>Report reviewed: Spam Content</ActivityTitle>
            <ActivityTime>30 minutes ago</ActivityTime>
          </ActivityItem>
          <ActivityItem>
            <ActivityTitle>New report: Fraud Attempt</ActivityTitle>
            <ActivityTime>2 hours ago</ActivityTime>
          </ActivityItem>
        </Section>
      </SectionGrid>

      <Section>
        <SectionTitle>Quick Actions</SectionTitle>
        <QuickActionGrid>
          <QuickActionButton onClick={() => window.location.href = '/dashboard/support'}>
            <FiHeadphones />
            View Support Tickets
          </QuickActionButton>
          <QuickActionButton onClick={() => window.location.href = '/dashboard/reports'}>
            <FiAlertCircle />
            Review Reports
          </QuickActionButton>
          <QuickActionButton onClick={() => window.location.href = '/dashboard/otp'}>
            <FiAlertCircle />
            OTP Management
          </QuickActionButton>
          <QuickActionButton onClick={() => window.location.href = '/dashboard/job-categories'}>
            <FiBriefcase />
            Manage Categories
          </QuickActionButton>
        </QuickActionGrid>
      </Section>
    </Container>
  );
};

export default DashboardHome;
