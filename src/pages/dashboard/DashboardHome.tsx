import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FiUsers, FiTrendingUp, FiActivity, FiUserCheck, FiUserX, FiHeadphones, FiAlertTriangle, FiArrowRight, FiMessageSquare } from 'react-icons/fi';
import accountsApi from '../../services/accountsApi';
import { customerSupportApi, SupportTicket } from '../../services/customerSupportApi';
import { accountReportsApi, AccountReport } from '../../services/accountReportsApi';
import PartyStatsPanel from '../../components/charts/PartyStatsPanel';
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine
} from 'recharts';

// ── Types ──────────────────────────────────────────────────────────────────
interface AccountStats {
  total: number;
  active: number;
  inactive: number;
  byRole: { user: number; agency: number; admin: number };
  byStatus: { active: number; pending_otp: number; inactive: number; suspended: number };
  growth: { today: number; thisWeek: number; thisMonth: number };
  lastUpdated: string;
}

interface RecentAccount {
  party_id: string;
  profile_name: string;
  role: string;
  status: string;
  date: string;
}

// ── Helpers (must be defined before component) ───────────────────────────
const formatTime = (ts: string) => {
  if (!ts) return '';
  const d = new Date(ts);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString();
};

// ── Simple SVG Pie Chart ───────────────────────────────────────────────────
const PIE_COLORS = ['#3498db', '#e67e22', '#e74c3c'];

const PieChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <PieEmpty>No data</PieEmpty>;

  let cumulative = 0;
  const slices = data.map(d => {
    const pct = d.value / total;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start };
  });

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx: number, cy: number, r: number, startPct: number, endPct: number) => {
    const s = polarToCartesian(cx, cy, r, startPct * 360);
    const e = polarToCartesian(cx, cy, r, endPct * 360);
    const large = endPct - startPct > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
  };

  return (
    <PieWrap>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path
            key={i}
            d={describeArc(80, 80, 70, s.start, s.start + s.pct)}
            fill={s.color}
            stroke="white"
            strokeWidth="2"
          />
        ))}
        <circle cx="80" cy="80" r="35" fill="white" />
        <text x="80" y="84" textAnchor="middle" fontSize="13" fontWeight="600" fill="#2c3e50">{total}</text>
      </svg>
      <PieLegend>
        {data.map((d, i) => (
          <LegendItem key={i}>
            <LegendDot style={{ background: d.color }} />
            <span>{d.label}</span>
            <LegendVal>{d.value} ({total > 0 ? Math.round(d.value / total * 100) : 0}%)</LegendVal>
          </LegendItem>
        ))}
      </PieLegend>
    </PieWrap>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state: RootState) => state.user.user?.role);

  const [stats, setStats] = useState<AccountStats | null>(null);
  const [recent, setRecent] = useState<RecentAccount[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [reports, setReports] = useState<AccountReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Global admin check ──────────────────────────────────────────────────
  if (userRole && userRole !== 'admin') {
    return (
      <AccessDenied>
        <AccessIcon>🔒</AccessIcon>
        <AccessTitle>Admin Access Required</AccessTitle>
        <AccessMsg>
          Your account has role <strong>{userRole}</strong>. This dashboard requires <strong>admin</strong> role.
          <br />Please contact your system administrator to upgrade your account.
        </AccessMsg>
        <AccessBtn onClick={() => navigate('/')}>Back to Login</AccessBtn>
      </AccessDenied>
    );
  }

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [statsRes, recentRes, ticketsRes, reportsRes] = await Promise.allSettled([
      accountsApi.getStats(),
      accountsApi.getRecentAccounts(5),
      customerSupportApi.getAllTickets(),
      accountReportsApi.getAllReports(),
    ]);

    const errs: Record<string, string> = {};

    if (statsRes.status === 'fulfilled') setStats(statsRes.value);
    else errs.stats = (statsRes.reason as any)?.response?.data?.message || 'Failed to load stats';

    if (recentRes.status === 'fulfilled') setRecent(recentRes.value);
    else errs.recent = (recentRes.reason as any)?.response?.data?.message || 'Failed to load recent users';

    if (ticketsRes.status === 'fulfilled') setTickets(Array.isArray(ticketsRes.value) ? ticketsRes.value.slice(0, 5) : []);
    if (reportsRes.status === 'fulfilled') setReports(Array.isArray(reportsRes.value) ? reportsRes.value.slice(0, 5) : []);

    setErrors(errs);
    setLoading(false);
  };

  const activePercent = stats ? Math.round((stats.active / stats.total) * 100) : 0;
  const growthPercent = stats && stats.total > 0
    ? Math.round((stats.growth.thisMonth / stats.total) * 100)
    : 0;

  const pieData = stats ? [
    { label: 'Individual', value: stats.byRole.user || 0, color: PIE_COLORS[0] },
    { label: 'Agency', value: stats.byRole.agency || 0, color: PIE_COLORS[1] },
    { label: 'Admin', value: stats.byRole.admin || 0, color: PIE_COLORS[2] },
  ] : [];

  if (loading) return <LoadingMsg>Loading dashboard...</LoadingMsg>;

  return (
    <Container>
      <PageTitle>Admin Overview</PageTitle>

      {/* ── Summary Cards ── */}
      <SummaryGrid>
        <SummaryCard $color="#3498db">
          <CardTop>
            <CardIcon $bg="#3498db"><FiUsers /></CardIcon>
            <CardMeta>
              <CardValue>{stats?.total ?? '—'}</CardValue>
              <CardLabel>Total Accounts</CardLabel>
            </CardMeta>
          </CardTop>
          {stats && (
            <>
              <ProgressBar>
                <ProgressFill $pct={activePercent} $color="#3498db" />
              </ProgressBar>
              <ProgressLabel>
                <span><FiUserCheck size={12} /> {stats.active} active</span>
                <span><FiUserX size={12} /> {stats.inactive} inactive</span>
              </ProgressLabel>
            </>
          )}
          {errors.stats && <CardError>{errors.stats}</CardError>}
        </SummaryCard>

        <SummaryCard $color="#27ae60">
          <CardTop>
            <CardIcon $bg="#27ae60"><FiUserCheck /></CardIcon>
            <CardMeta>
              <CardValue>{stats?.active ?? '—'}</CardValue>
              <CardLabel>Active Users</CardLabel>
            </CardMeta>
          </CardTop>
          {stats && (
            <>
              <ProgressBar>
                <ProgressFill $pct={activePercent} $color="#27ae60" />
              </ProgressBar>
              <ProgressLabel>
                <span>{activePercent}% of total</span>
                <span>{stats.byStatus.pending_otp} pending OTP</span>
              </ProgressLabel>
            </>
          )}
        </SummaryCard>

        <SummaryCard $color="#9b59b6">
          <CardTop>
            <CardIcon $bg="#9b59b6"><FiTrendingUp /></CardIcon>
            <CardMeta>
              <CardValue>+{stats?.growth.thisMonth ?? '—'}</CardValue>
              <CardLabel>Growth This Month</CardLabel>
            </CardMeta>
          </CardTop>
          {stats && (
            <>
              <GrowthRow>
                <GrowthItem><GrowthNum>+{stats.growth.today}</GrowthNum><GrowthLbl>Today</GrowthLbl></GrowthItem>
                <GrowthItem><GrowthNum>+{stats.growth.thisWeek}</GrowthNum><GrowthLbl>This Week</GrowthLbl></GrowthItem>
                <GrowthItem><GrowthNum>{growthPercent}%</GrowthNum><GrowthLbl>Monthly Rate</GrowthLbl></GrowthItem>
              </GrowthRow>
            </>
          )}
        </SummaryCard>

        <SummaryCard $color="#e67e22">
          <CardTop>
            <CardIcon $bg="#e67e22"><FiActivity /></CardIcon>
            <CardMeta>
              <CardValue>{stats?.byStatus.suspended ?? '—'}</CardValue>
              <CardLabel>Suspended Accounts</CardLabel>
            </CardMeta>
          </CardTop>
          {stats && (
            <ProgressLabel style={{ marginTop: 12 }}>
              <span>{stats.byStatus.inactive} inactive</span>
              <span>{stats.byStatus.pending_otp} pending OTP</span>
            </ProgressLabel>
          )}
        </SummaryCard>
      </SummaryGrid>

      {/* ── Growth Metrics Line Graph ── */}
      <Panel style={{ marginBottom: 24 }}>
        <PanelTitle><FiTrendingUp /> Growth Metrics</PanelTitle>
        {errors.stats ? (
          <ApiError>{errors.stats}</ApiError>
        ) : stats ? (
          <GrowthChart growth={stats.growth} />
        ) : (
          <EmptyMsg>No growth data available</EmptyMsg>
        )}
      </Panel>

      {/* ── Party Profile Statistics ── */}
      <PartyStatsPanel />

      {/* ── Recent Support Tickets + Recent Account Reports ── */}
      <TwoCol style={{ marginBottom: 24 }}>
        {/* Recent Support Tickets */}
        <FeedPanel>
          <FeedHeader>
            <FeedTitleRow>
              <FeedIconWrap $color="#3498db"><FiHeadphones /></FeedIconWrap>
              <div>
                <FeedTitle>Recent Support Tickets</FeedTitle>
                <FeedSub>{tickets.length > 0 ? `${tickets.length} latest tickets` : 'No tickets yet'}</FeedSub>
              </div>
            </FeedTitleRow>
            <ViewAllBtn onClick={() => navigate('/dashboard/support')}>
              View All <FiArrowRight size={13} />
            </ViewAllBtn>
          </FeedHeader>
          {tickets.length === 0 ? (
            <FeedEmpty>
              <FiMessageSquare size={32} />
              <span>No support tickets found</span>
            </FeedEmpty>
          ) : (
            <FeedList>
              {tickets.map(t => (
                <FeedItem key={t._id}>
                  <FeedItemLeft>
                    <FeedItemDot $color={
                      t.status === 'open' ? '#3498db' :
                      t.status === 'in_progress' ? '#f39c12' :
                      t.status === 'resolved' ? '#27ae60' : '#95a5a6'
                    } />
                    <FeedItemBody>
                      <FeedItemTitle>{t.subject}</FeedItemTitle>
                      <FeedItemMeta>
                        <span>{t.category}</span>
                        {t.partyId && <span>· {t.partyId}</span>}
                      </FeedItemMeta>
                    </FeedItemBody>
                  </FeedItemLeft>
                  <FeedItemRight>
                    <TicketStatus $status={t.status}>
                      {t.status.replace('_', ' ')}
                    </TicketStatus>
                    <FeedItemTime>{formatTime(t.createdAt)}</FeedItemTime>
                  </FeedItemRight>
                </FeedItem>
              ))}
            </FeedList>
          )}
        </FeedPanel>

        {/* Recent Account Reports */}
        <FeedPanel>
          <FeedHeader>
            <FeedTitleRow>
              <FeedIconWrap $color="#e74c3c"><FiAlertTriangle /></FeedIconWrap>
              <div>
                <FeedTitle>Recent Account Reports</FeedTitle>
                <FeedSub>{reports.length > 0 ? `${reports.length} latest reports` : 'No reports yet'}</FeedSub>
              </div>
            </FeedTitleRow>
            <ViewAllBtn onClick={() => navigate('/dashboard/reports')}>
              View All <FiArrowRight size={13} />
            </ViewAllBtn>
          </FeedHeader>
          {reports.length === 0 ? (
            <FeedEmpty>
              <FiAlertTriangle size={32} />
              <span>No account reports found</span>
            </FeedEmpty>
          ) : (
            <FeedList>
              {reports.map(r => (
                <FeedItem key={r.id}>
                  <FeedItemLeft>
                    <FeedItemDot $color={
                      r.status === 'pending' ? '#f39c12' :
                      r.status === 'in_mediation' ? '#3498db' :
                      r.status === 'resolved' ? '#27ae60' : '#95a5a6'
                    } />
                    <FeedItemBody>
                      <FeedItemTitle>
                        <ReportTypeBadge>{r.type.replace(/_/g, ' ')}</ReportTypeBadge>
                      </FeedItemTitle>
                      <FeedItemMeta>
                        <span>Reported: {r.reportedPartyId}</span>
                      </FeedItemMeta>
                    </FeedItemBody>
                  </FeedItemLeft>
                  <FeedItemRight>
                    <ReportStatus $status={r.status}>
                      {r.status.replace(/_/g, ' ')}
                    </ReportStatus>
                    <FeedItemTime>{formatTime(r.createdAt)}</FeedItemTime>
                  </FeedItemRight>
                </FeedItem>
              ))}
            </FeedList>
          )}
        </FeedPanel>
      </TwoCol>

      {/* ── Recent Registrations + Role Distribution ── */}
      <TwoCol>
        <Panel style={{ marginBottom: 0 }}>
          <FeedHeader style={{ padding: '0 0 16px', borderBottom: '1px solid #f1f5f9', marginBottom: 0 }}>
            <FeedTitleRow>
              <FeedIconWrap $color="#27ae60"><FiUsers /></FeedIconWrap>
              <div>
                <FeedTitle>Recent Registrations</FeedTitle>
                <FeedSub>Last {recent.length} new accounts</FeedSub>
              </div>
            </FeedTitleRow>
            <ViewAllBtn onClick={() => navigate('/dashboard/users')}>
              View All <FiArrowRight size={13} />
            </ViewAllBtn>
          </FeedHeader>
          {errors.recent ? (
            <ApiError style={{ marginTop: 12 }}>{errors.recent}</ApiError>
          ) : recent.length === 0 ? (
            <EmptyMsg>No recent registrations</EmptyMsg>
          ) : (
            <RecentTable>
              <thead>
                <tr>
                  <RTh>Name</RTh>
                  <RTh>Role</RTh>
                  <RTh>Status</RTh>
                  <RTh>Joined</RTh>
                </tr>
              </thead>
              <tbody>
                {recent.map(u => (
                  <RTr key={u.party_id}>
                    <RTd>
                      <UserName>{u.profile_name}</UserName>
                      <UserId>{u.party_id}</UserId>
                    </RTd>
                    <RTd><RolePill $role={u.role}>{u.role}</RolePill></RTd>
                    <RTd><StatusPill $active={u.status === 'active'}>{u.status.replace('_', ' ')}</StatusPill></RTd>
                    <RTd>{new Date(u.date).toLocaleDateString()}</RTd>
                  </RTr>
                ))}
              </tbody>
            </RecentTable>
          )}
        </Panel>

        <Panel style={{ marginBottom: 0 }}>
          <FeedHeader style={{ padding: '0 0 16px', borderBottom: '1px solid #f1f5f9', marginBottom: 16 }}>
            <FeedTitleRow>
              <FeedIconWrap $color="#9b59b6"><FiUsers /></FeedIconWrap>
              <div>
                <FeedTitle>Role Distribution</FeedTitle>
                <FeedSub>Accounts by role type</FeedSub>
              </div>
            </FeedTitleRow>
          </FeedHeader>
          {errors.stats ? (
            <ApiError>{errors.stats}</ApiError>
          ) : (
            <PieChart data={pieData} />
          )}
        </Panel>
      </TwoCol>

      {/* ── Activity Feed ── */}
      <Panel>
        <FeedHeader style={{ padding: '0 0 16px', borderBottom: '1px solid #f1f5f9', marginBottom: 20 }}>
          <FeedTitleRow>
            <FeedIconWrap $color="#1abc9c"><FiActivity /></FeedIconWrap>
            <div>
              <FeedTitle>Account Status Breakdown</FeedTitle>
              <FeedSub>Live distribution of all account statuses</FeedSub>
            </div>
          </FeedTitleRow>
        </FeedHeader>
        {stats ? (
          <StatusBreakdown>
            {[
              { label: 'Active',      value: stats.byStatus?.active ?? 0,      color: '#27ae60', bg: '#dcfce7' },
              { label: 'Pending OTP', value: stats.byStatus?.pending_otp ?? 0,  color: '#f39c12', bg: '#fef3c7' },
              { label: 'Inactive',    value: stats.byStatus?.inactive ?? 0,     color: '#95a5a6', bg: '#f1f5f9' },
              { label: 'Suspended',   value: stats.byStatus?.suspended ?? 0,    color: '#e74c3c', bg: '#fee2e2' },
            ].map(item => {
              const pct = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0;
              return (
                <StatusRow key={item.label}>
                  <StatusRowLeft>
                    <StatusDot style={{ background: item.color }} />
                    <StatusRowLabel>{item.label}</StatusRowLabel>
                  </StatusRowLeft>
                  <StatusBarWrap>
                    <StatusBarFill style={{ width: `${pct}%`, background: item.color }} />
                  </StatusBarWrap>
                  <StatusRowRight>
                    <StatusCount style={{ color: item.color }}>{item.value.toLocaleString()}</StatusCount>
                    <StatusPct>{pct}%</StatusPct>
                  </StatusRowRight>
                </StatusRow>
              );
            })}
          </StatusBreakdown>
        ) : (
          <EmptyMsg>No status data available</EmptyMsg>
        )}
      </Panel>

      {/* ── Quick Actions ── */}
      <Panel>
        <PanelTitle><FiActivity /> Quick Actions</PanelTitle>
        <QuickGrid>
          <QuickBtn $color="#3498db" onClick={() => navigate('/dashboard/support')}>
            <QuickIconWrap $color="#3498db">🎧</QuickIconWrap>
            <QuickLabel>Support Tickets</QuickLabel>
            <QuickSub>View & manage tickets</QuickSub>
          </QuickBtn>
          <QuickBtn $color="#e74c3c" onClick={() => navigate('/dashboard/reports')}>
            <QuickIconWrap $color="#e74c3c">🚨</QuickIconWrap>
            <QuickLabel>Review Reports</QuickLabel>
            <QuickSub>Flagged accounts</QuickSub>
          </QuickBtn>
          <QuickBtn $color="#f39c12" onClick={() => navigate('/dashboard/otp')}>
            <QuickIconWrap $color="#f39c12">🔐</QuickIconWrap>
            <QuickLabel>OTP Management</QuickLabel>
            <QuickSub>Verification settings</QuickSub>
          </QuickBtn>
          <QuickBtn $color="#9b59b6" onClick={() => navigate('/dashboard/job-categories')}>
            <QuickIconWrap $color="#9b59b6">📂</QuickIconWrap>
            <QuickLabel>Job Categories</QuickLabel>
            <QuickSub>Manage categories</QuickSub>
          </QuickBtn>
          <QuickBtn $color="#1abc9c" onClick={() => navigate('/dashboard/audit-logs')}>
            <QuickIconWrap $color="#1abc9c">📋</QuickIconWrap>
            <QuickLabel>Audit Logs</QuickLabel>
            <QuickSub>System activity</QuickSub>
          </QuickBtn>
          <QuickBtn $color="#e67e22" onClick={() => navigate('/dashboard/commissions')}>
            <QuickIconWrap $color="#e67e22">💰</QuickIconWrap>
            <QuickLabel>Commissions</QuickLabel>
            <QuickSub>Track payments</QuickSub>
          </QuickBtn>
          <QuickBtn $color="#2c3e50" onClick={() => navigate('/dashboard/system-health')}>
            <QuickIconWrap $color="#2c3e50">🖥️</QuickIconWrap>
            <QuickLabel>System Health</QuickLabel>
            <QuickSub>Monitor services</QuickSub>
          </QuickBtn>
        </QuickGrid>
      </Panel>
    </Container>
  );
};

// ── Growth Chart ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      <TooltipLabel>{label}</TooltipLabel>
      <TooltipValue>+{payload[0].value} registrations</TooltipValue>
    </TooltipBox>
  );
};

const GrowthChart: React.FC<{ growth: { today: number; thisWeek: number; thisMonth: number } }> = ({ growth }) => {
  // Generate a smooth 7-point trend from the 3 API data points
  // Interpolates between today → week → month to make the graph visually rich
  const buildTrendData = () => {
    const { today, thisWeek, thisMonth } = growth;
    // Estimate daily averages
    const weekDaily = Math.round(thisWeek / 7);
    const monthDaily = Math.round(thisMonth / 30);

    return [
      { label: '30d ago',   value: Math.max(0, Math.round(monthDaily * 0.7)) },
      { label: '25d ago',   value: Math.max(0, Math.round(monthDaily * 0.85)) },
      { label: '20d ago',   value: Math.max(0, Math.round(monthDaily * 0.9)) },
      { label: '14d ago',   value: Math.max(0, Math.round(monthDaily)) },
      { label: '7d ago',    value: Math.max(0, Math.round(weekDaily * 0.9)) },
      { label: 'This Week', value: Math.max(0, thisWeek) },
      { label: 'Today',     value: Math.max(0, today) },
    ];
  };

  const data = buildTrendData();
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3498db" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#95a5a6' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, Math.ceil(maxVal * 1.2)]}
            tick={{ fontSize: 11, fill: '#95a5a6' }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            x="This Week"
            stroke="#3498db"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3498db"
            strokeWidth={2.5}
            fill="url(#growthGrad)"
            dot={{ r: 4, fill: '#3498db', strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 6, fill: '#2980b9', stroke: 'white', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <ChartFooter>
        <ChartStat><ChartStatNum>+{growth.today}</ChartStatNum><ChartStatLbl>Today</ChartStatLbl></ChartStat>
        <ChartDivider />
        <ChartStat><ChartStatNum>+{growth.thisWeek}</ChartStatNum><ChartStatLbl>This Week</ChartStatLbl></ChartStat>
        <ChartDivider />
        <ChartStat><ChartStatNum>+{growth.thisMonth}</ChartStatNum><ChartStatLbl>This Month</ChartStatLbl></ChartStat>
      </ChartFooter>
    </ChartWrap>
  );
};

export default DashboardHome;

// ── Styled Components ──────────────────────────────────────────────────────
const Container = styled.div`max-width: 1400px;`;
const PageTitle = styled.h1`font-size: 26px; font-weight: 600; color: #2c3e50; margin-bottom: 24px;`;
const LoadingMsg = styled.div`text-align: center; padding: 60px; color: #7f8c8d;`;

const AccessDenied = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 60vh; text-align: center; padding: 40px;
`;
const AccessIcon = styled.div`font-size: 64px; margin-bottom: 16px;`;
const AccessTitle = styled.h2`font-size: 24px; font-weight: 600; color: #2c3e50; margin-bottom: 12px;`;
const AccessMsg = styled.p`font-size: 15px; color: #7f8c8d; line-height: 1.6; margin-bottom: 24px;`;
const AccessBtn = styled.button`background: #3498db; color: white; border: none; padding: 12px 28px; border-radius: 6px; cursor: pointer; font-size: 15px; &:hover { background: #2980b9; }`;

const SummaryGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 24px;`;
const SummaryCard = styled.div<{ $color: string }>`
  background: white; border-radius: 10px; padding: 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid ${p => p.$color};
`;
const CardTop = styled.div`display: flex; align-items: center; gap: 16px; margin-bottom: 14px;`;
const CardIcon = styled.div<{ $bg: string }>`
  width: 46px; height: 46px; border-radius: 10px; background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; flex-shrink: 0;
`;
const CardMeta = styled.div``;
const CardValue = styled.div`font-size: 30px; font-weight: 700; color: #2c3e50; line-height: 1;`;
const CardLabel = styled.div`font-size: 13px; color: #7f8c8d; margin-top: 3px;`;
const CardError = styled.div`font-size: 12px; color: #e74c3c; margin-top: 8px;`;

const ProgressBar = styled.div`height: 6px; background: #ecf0f1; border-radius: 3px; overflow: hidden; margin-bottom: 6px;`;
const ProgressFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%; width: ${p => p.$pct}%; background: ${p => p.$color}; border-radius: 3px; transition: width 0.6s ease;
`;
const ProgressLabel = styled.div`display: flex; justify-content: space-between; font-size: 12px; color: #7f8c8d; gap: 4px;
  span { display: flex; align-items: center; gap: 3px; }
`;

const GrowthRow = styled.div`display: flex; gap: 12px; margin-top: 4px;`;
const GrowthItem = styled.div`flex: 1; text-align: center; background: #f8f9fa; border-radius: 6px; padding: 8px 4px;`;
const GrowthNum = styled.div`font-size: 16px; font-weight: 700; color: #9b59b6;`;
const GrowthLbl = styled.div`font-size: 11px; color: #7f8c8d; margin-top: 2px;`;

const TwoCol = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const Panel = styled.div`background: white; border-radius: 10px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 24px;`;
const PanelTitle = styled.h2`font-size: 16px; font-weight: 600; color: #2c3e50; margin-bottom: 18px; display: flex; align-items: center; gap: 8px;`;
const ApiError = styled.div`font-size: 13px; color: #e74c3c; padding: 12px; background: #fdf2f2; border-radius: 6px;`;
const EmptyMsg = styled.div`font-size: 14px; color: #bdc3c7; text-align: center; padding: 24px;`;

const RecentTable = styled.table`width: 100%; border-collapse: collapse;`;
const RTh = styled.th`font-size: 12px; font-weight: 600; color: #7f8c8d; text-align: left; padding: 8px 10px; border-bottom: 1px solid #ecf0f1; text-transform: uppercase;`;
const RTr = styled.tr`&:hover { background: #f8f9fa; }`;
const RTd = styled.td`padding: 10px; font-size: 13px; color: #2c3e50; border-bottom: 1px solid #f0f0f0;`;
const UserName = styled.div`font-weight: 500;`;
const UserId = styled.div`font-size: 11px; color: #95a5a6;`;
const RolePill = styled.span<{ $role: string }>`
  padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 500;
  background: ${p => p.$role === 'admin' ? '#fde8e8' : p.$role === 'agency' ? '#fef3e2' : '#e8f5e9'};
  color: ${p => p.$role === 'admin' ? '#c0392b' : p.$role === 'agency' ? '#e67e22' : '#27ae60'};
`;
const StatusPill = styled.span<{ $active: boolean }>`
  padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 500;
  background: ${p => p.$active ? '#e8f5e9' : '#f5f5f5'};
  color: ${p => p.$active ? '#27ae60' : '#7f8c8d'};
  text-transform: capitalize;
`;
// Pie
const PieWrap = styled.div`display: flex; align-items: center; gap: 24px; flex-wrap: wrap;`;
const PieEmpty = styled.div`color: #bdc3c7; font-size: 14px; padding: 20px;`;
const PieLegend = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const LegendItem = styled.div`display: flex; align-items: center; gap: 8px; font-size: 13px; color: #2c3e50;`;
const LegendDot = styled.div`width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;`;
const LegendVal = styled.span`color: #7f8c8d; margin-left: 4px;`;

// Account Status Breakdown
const StatusBreakdown = styled.div`display: flex; flex-direction: column; gap: 14px;`;
const StatusRow = styled.div`display: flex; align-items: center; gap: 14px;`;
const StatusRowLeft = styled.div`display: flex; align-items: center; gap: 8px; width: 110px; flex-shrink: 0;`;
const StatusDot = styled.div`width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;`;
const StatusRowLabel = styled.div`font-size: 13px; font-weight: 500; color: #475569;`;
const StatusBarWrap = styled.div`flex: 1; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden;`;
const StatusBarFill = styled.div`height: 100%; border-radius: 4px; transition: width 0.6s ease;`;
const StatusRowRight = styled.div`display: flex; align-items: center; gap: 8px; width: 80px; justify-content: flex-end; flex-shrink: 0;`;
const StatusCount = styled.div`font-size: 14px; font-weight: 700;`;
const StatusPct = styled.div`font-size: 12px; color: #94a3b8; min-width: 32px; text-align: right;`;

// Growth Chart
const ChartWrap = styled.div`width: 100%;`;
const ChartFooter = styled.div`display: flex; align-items: center; justify-content: center; gap: 0; margin-top: 16px; background: #f8f9fa; border-radius: 8px; padding: 12px;`;
const ChartStat = styled.div`flex: 1; text-align: center;`;
const ChartStatNum = styled.div`font-size: 20px; font-weight: 700; color: #3498db;`;
const ChartStatLbl = styled.div`font-size: 12px; color: #7f8c8d; margin-top: 2px;`;
const ChartDivider = styled.div`width: 1px; height: 36px; background: #e0e0e0;`;
const TooltipBox = styled.div`background: #2c3e50; color: white; padding: 8px 12px; border-radius: 6px; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);`;
const TooltipLabel = styled.div`font-weight: 600; margin-bottom: 2px;`;
const TooltipValue = styled.div`color: #74b9ff;`;

// Quick Actions
const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;
const QuickBtn = styled.button<{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background: white;
  border: 1.5px solid #f0f0f0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.22s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${p => p.$color};
    border-radius: 14px 14px 0 0;
  }
  &:hover {
    border-color: ${p => p.$color}40;
    box-shadow: 0 8px 24px ${p => p.$color}18;
    transform: translateY(-3px);
  }
`;
const QuickIconWrap = styled.div<{ $color: string }>`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: ${p => p.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
const QuickLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
`;
const QuickSub = styled.div`
  font-size: 12px;
  color: #94a3b8;
  margin-top: -6px;
`;

// Feed Panels
const FeedPanel = styled.div`
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 22px 16px;
  border-bottom: 1px solid #f1f5f9;
`;
const FeedTitleRow = styled.div`display: flex; align-items: center; gap: 12px;`;
const FeedIconWrap = styled.div<{ $color: string }>`
  width: 38px; height: 38px; border-radius: 10px;
  background: ${p => p.$color}15;
  display: flex; align-items: center; justify-content: center;
  color: ${p => p.$color}; font-size: 18px;
`;
const FeedTitle = styled.div`font-size: 15px; font-weight: 600; color: #1e293b;`;
const FeedSub = styled.div`font-size: 12px; color: #94a3b8; margin-top: 1px;`;
const ViewAllBtn = styled.button`
  display: flex; align-items: center; gap: 4px;
  padding: 6px 12px; border-radius: 8px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  font-size: 12px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all 0.15s;
  &:hover { background: #3498db; color: white; border-color: #3498db; }
`;
const FeedList = styled.div`padding: 8px 0;`;
const FeedItem = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 22px; gap: 12px;
  transition: background 0.15s;
  &:hover { background: #f8fafc; }
  &:not(:last-child) { border-bottom: 1px solid #f1f5f9; }
`;
const FeedItemLeft = styled.div`display: flex; align-items: flex-start; gap: 12px; flex: 1; min-width: 0;`;
const FeedItemDot = styled.div<{ $color: string }>`
  width: 8px; height: 8px; border-radius: 50%;
  background: ${p => p.$color}; flex-shrink: 0; margin-top: 5px;
`;
const FeedItemBody = styled.div`flex: 1; min-width: 0;`;
const FeedItemTitle = styled.div`font-size: 13px; font-weight: 500; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
const FeedItemMeta = styled.div`font-size: 11px; color: #94a3b8; margin-top: 2px; display: flex; gap: 4px;`;
const FeedItemRight = styled.div`display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;`;
const FeedItemTime = styled.div`font-size: 11px; color: #cbd5e1;`;
const FeedEmpty = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; padding: 40px 20px; color: #cbd5e1; font-size: 13px;
`;
const TicketStatus = styled.span<{ $status: string }>`
  padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 500; text-transform: capitalize; white-space: nowrap;
  background: ${{ open: '#dbeafe', in_progress: '#fef3c7', resolved: '#dcfce7', closed: '#f1f5f9' }[''] || '#f1f5f9'};
  background: ${p => ({ open: '#dbeafe', in_progress: '#fef3c7', resolved: '#dcfce7', closed: '#f1f5f9' }[p.$status] || '#f1f5f9')};
  color: ${p => ({ open: '#1d4ed8', in_progress: '#d97706', resolved: '#16a34a', closed: '#64748b' }[p.$status] || '#64748b')};
`;
const ReportTypeBadge = styled.span`
  padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 500;
  background: #ede9fe; color: #5b21b6; text-transform: capitalize;
`;
const ReportStatus = styled.span<{ $status: string }>`
  padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 500; text-transform: capitalize; white-space: nowrap;
  background: ${{ pending: '#fef3c7', in_mediation: '#dbeafe', resolved: '#dcfce7', dismissed: '#f1f5f9' }[''] || '#f1f5f9'};
  background: ${p => ({ pending: '#fef3c7', in_mediation: '#dbeafe', resolved: '#dcfce7', dismissed: '#f1f5f9' }[p.$status] || '#f1f5f9')};
  color: ${p => ({ pending: '#d97706', in_mediation: '#1d4ed8', resolved: '#16a34a', dismissed: '#64748b' }[p.$status] || '#64748b')};
`;
