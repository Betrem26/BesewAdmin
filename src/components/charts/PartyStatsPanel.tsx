import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiCheckCircle, FiClock, FiXCircle, FiUsers, FiTrendingUp, FiBook, FiShield, FiRefreshCw } from 'react-icons/fi';
import partyProfileApi, { PartyStats, VerificationStats, EducationStats, RecentPartyProfile } from '../../services/partyProfileApi';

// ── Circular progress SVG ──────────────────────────────────────────────────
const CircularProgress: React.FC<{ pct: number; color: string; size?: number }> = ({ pct, color, size = 80 }) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#edf2f7" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a202c">
        {pct}%
      </text>
    </svg>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const PartyStatsPanel: React.FC = () => {
  const [partyStats, setPartyStats] = useState<PartyStats | null>(null);
  const [verStats, setVerStats] = useState<VerificationStats | null>(null);
  const [eduStats, setEduStats] = useState<EducationStats | null>(null);
  const [recent, setRecent] = useState<RecentPartyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    const [ps, vs, es, rs] = await Promise.allSettled([
      partyProfileApi.getStats(),
      partyProfileApi.getVerificationStats(),
      partyProfileApi.getEducationStats(),
      partyProfileApi.getRecentProfiles(5),
    ]);
    if (ps.status === 'fulfilled') setPartyStats(ps.value);
    if (vs.status === 'fulfilled') setVerStats(vs.value);
    if (es.status === 'fulfilled') setEduStats(es.value);
    if (rs.status === 'fulfilled') setRecent(Array.isArray(rs.value) ? rs.value : []);
    if (isRefresh) setRefreshing(false); else setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

  const byTypeEntries = partyStats?.byType
    ? Object.entries(partyStats.byType).filter(([, v]) => v > 0)
    : [];
  const byTypeTotal = byTypeEntries.reduce((s, [, v]) => s + v, 0);

  const TYPE_COLORS: Record<string, string> = {
    company: '#4299e1', startup: '#9f7aea', freelancer: '#38a169',
    individual: '#ed8936', agency: '#e53e3e', candidate: '#3182ce',
  };

  if (loading) return (
    <Panel>
      <LoadRow><Spinner /><span style={{ color: '#a0aec0', fontSize: 14 }}>Loading party statistics…</span></LoadRow>
    </Panel>
  );

  return (
    <Panel>
      <PanelHeader>
        <PanelTitleRow>
          <FiUsers size={16} color="#4299e1" />
          <PanelTitle>Party Profile Statistics</PanelTitle>
        </PanelTitleRow>
        <RefreshBtn onClick={() => load(true)} disabled={refreshing}>
          <FiRefreshCw size={13} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
          Refresh
        </RefreshBtn>
      </PanelHeader>

      <Grid>
        {/* ── Verification Rate ── */}
        <Card>
          <CardTitle><FiShield size={13} /> Verification Rate</CardTitle>
          {verStats ? (
            <VerBody>
              <CircularProgress pct={Math.round(verStats.verificationRate)} color="#38a169" size={88} />
              <VerDetails>
                <VerRow $color="#38a169"><FiCheckCircle size={12} /><span>Verified</span><VerNum>{verStats.verified.toLocaleString()}</VerNum></VerRow>
                <VerRow $color="#d69e2e"><FiClock size={12} /><span>Pending</span><VerNum>{verStats.pending.toLocaleString()}</VerNum></VerRow>
                <VerRow $color="#e53e3e"><FiXCircle size={12} /><span>Rejected</span><VerNum>{verStats.rejected.toLocaleString()}</VerNum></VerRow>
                <VerTotal>Total: {verStats.totalProfiles.toLocaleString()}</VerTotal>
              </VerDetails>
            </VerBody>
          ) : <NoData>Not available</NoData>}
        </Card>

        {/* ── By Type Breakdown ── */}
        <Card>
          <CardTitle><FiUsers size={13} /> Profile Distribution</CardTitle>
          {byTypeEntries.length > 0 ? (
            <TypeList>
              {byTypeEntries.map(([type, count]) => {
                const pct = byTypeTotal > 0 ? Math.round((count / byTypeTotal) * 100) : 0;
                const color = TYPE_COLORS[type.toLowerCase()] || '#718096';
                return (
                  <TypeRow key={type}>
                    <TypeLabel>
                      <TypeDot style={{ background: color }} />
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </TypeLabel>
                    <TypeBarWrap>
                      <TypeBarFill style={{ width: `${pct}%`, background: color }} />
                    </TypeBarWrap>
                    <TypeCount>{count.toLocaleString()} <TypePct>({pct}%)</TypePct></TypeCount>
                  </TypeRow>
                );
              })}
            </TypeList>
          ) : partyStats ? (
            <NoData>No type breakdown available</NoData>
          ) : <NoData>Not available</NoData>}
        </Card>

        {/* ── Growth ── */}
        {partyStats?.growth && (
          <Card>
            <CardTitle><FiTrendingUp size={13} /> Registration Growth</CardTitle>
            <GrowthGrid>
              <GrowthBox $color="#4299e1">
                <GrowthNum>+{partyStats.growth.today}</GrowthNum>
                <GrowthLbl>Today</GrowthLbl>
              </GrowthBox>
              <GrowthBox $color="#9f7aea">
                <GrowthNum>+{partyStats.growth.thisWeek}</GrowthNum>
                <GrowthLbl>This Week</GrowthLbl>
              </GrowthBox>
              <GrowthBox $color="#38a169">
                <GrowthNum>+{partyStats.growth.thisMonth}</GrowthNum>
                <GrowthLbl>This Month</GrowthLbl>
              </GrowthBox>
              <GrowthBox $color="#ed8936">
                <GrowthNum>{partyStats.total.toLocaleString()}</GrowthNum>
                <GrowthLbl>Total</GrowthLbl>
              </GrowthBox>
            </GrowthGrid>
          </Card>
        )}

        {/* ── Education Compliance ── */}
        <Card>
          <CardTitle><FiBook size={13} /> Education Compliance <ComplianceBadge $status={eduStats?.complianceStatus}>{eduStats?.complianceStatus || '—'}</ComplianceBadge></CardTitle>
          {eduStats ? (
            <>
              <EduRow>
                <EduLabel>Completeness Rate</EduLabel>
                <EduBarWrap>
                  <EduBarFill style={{ width: `${eduStats.completenessRate}%` }} />
                </EduBarWrap>
                <EduPct>{eduStats.completenessRate}%</EduPct>
              </EduRow>
              <EduStats>
                <EduStat><EduStatNum $color="#38a169">{eduStats.completeEducation}</EduStatNum><EduStatLbl>Complete</EduStatLbl></EduStat>
                <EduStat><EduStatNum $color="#d69e2e">{eduStats.incompleteEducation}</EduStatNum><EduStatLbl>Incomplete</EduStatLbl></EduStat>
                <EduStat><EduStatNum $color="#a0aec0">{eduStats.noEducation}</EduStatNum><EduStatLbl>None</EduStatLbl></EduStat>
              </EduStats>
              {eduStats.byRole && Object.keys(eduStats.byRole).length > 0 && (
                <RoleCompliance>
                  {Object.entries(eduStats.byRole).slice(0, 3).map(([role, data]) => (
                    <RoleRow key={role}>
                      <RoleLabel>{role.replace(/_/g, ' ')}</RoleLabel>
                      <RoleBar>
                        <RoleBarFill style={{ width: `${data.rate}%`, background: data.rate >= 90 ? '#38a169' : data.rate >= 70 ? '#d69e2e' : '#e53e3e' }} />
                      </RoleBar>
                      <RoleRate $ok={data.rate >= 90}>{data.rate}%</RoleRate>
                    </RoleRow>
                  ))}
                </RoleCompliance>
              )}
            </>
          ) : <NoData>Not available</NoData>}
        </Card>
      </Grid>

      {/* ── Recent Registrations ── */}
      <RecentSection>
        <RecentTitle><FiUsers size={13} /> Recent Party Registrations</RecentTitle>
        {recent.length === 0 ? (
          <NoData>No recent registrations</NoData>
        ) : (
          <RecentList>
            {recent.map((p, i) => (
              <RecentItem key={p.party_id || i}>
                <RecentAvatar>{(p.name || '?').charAt(0).toUpperCase()}</RecentAvatar>
                <RecentInfo>
                  <RecentName>{p.name || p.party_id}</RecentName>
                  <RecentMeta>{p.party_id} · {formatDate(p.createdAt)}</RecentMeta>
                </RecentInfo>
                <RecentRight>
                  <TypeTag style={{ background: (TYPE_COLORS[p.type?.toLowerCase()] || '#718096') + '18', color: TYPE_COLORS[p.type?.toLowerCase()] || '#718096' }}>
                    {p.type || '—'}
                  </TypeTag>
                  {p.verified
                    ? <VerBadge $ok><FiCheckCircle size={10} /> Verified</VerBadge>
                    : <VerBadge><FiClock size={10} /> Pending</VerBadge>
                  }
                </RecentRight>
              </RecentItem>
            ))}
          </RecentList>
        )}
      </RecentSection>
    </Panel>
  );
};

export default PartyStatsPanel;

// ── Animations ──
const spinAnim = keyframes`to { transform: rotate(360deg); }`;

// ── Styled Components ──
const Panel = styled.div`background: white; border-radius: 14px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 24px;`;
const PanelHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;`;
const PanelTitleRow = styled.div`display: flex; align-items: center; gap: 8px;`;
const PanelTitle = styled.h2`font-size: 16px; font-weight: 700; color: #1a202c; margin: 0;`;
const RefreshBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f7fafc;
  font-size: 12px; font-weight: 500; color: #718096; cursor: pointer;
  transition: all 0.15s;
  &:hover { background: #4299e1; color: white; border-color: #4299e1; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  svg { transition: none; }
`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 20px;`;
const Card = styled.div`background: #f7fafc; border-radius: 12px; padding: 16px; border: 1px solid #edf2f7;`;
const CardTitle = styled.div`display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px;`;
const NoData = styled.div`font-size: 13px; color: #cbd5e0; text-align: center; padding: 16px 0;`;
const LoadRow = styled.div`display: flex; align-items: center; justify-content: center; gap: 10px; padding: 32px;`;
const Spinner = styled.span`
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid #e2e8f0; border-top-color: #4299e1;
  display: inline-block;
  animation: ${spinAnim} 0.7s linear infinite;
`;

// Verification
const VerBody = styled.div`display: flex; align-items: center; gap: 16px;`;
const VerDetails = styled.div`display: flex; flex-direction: column; gap: 6px; flex: 1;`;
const VerRow = styled.div<{ $color: string }>`display: flex; align-items: center; gap: 6px; font-size: 12px; color: ${p => p.$color}; font-weight: 500;`;
const VerNum = styled.span`margin-left: auto; font-weight: 700; font-size: 13px;`;
const VerTotal = styled.div`font-size: 11px; color: #a0aec0; margin-top: 4px; border-top: 1px solid #edf2f7; padding-top: 6px;`;

// By Type
const TypeList = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const TypeRow = styled.div`display: flex; align-items: center; gap: 8px;`;
const TypeLabel = styled.div`display: flex; align-items: center; gap: 6px; font-size: 12px; color: #4a5568; font-weight: 500; width: 90px; flex-shrink: 0;`;
const TypeDot = styled.div`width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;`;
const TypeBarWrap = styled.div`flex: 1; height: 6px; background: #edf2f7; border-radius: 3px; overflow: hidden;`;
const TypeBarFill = styled.div`height: 100%; border-radius: 3px; transition: width 0.6s ease;`;
const TypeCount = styled.div`font-size: 12px; font-weight: 600; color: #2d3748; width: 70px; text-align: right; flex-shrink: 0;`;
const TypePct = styled.span`font-weight: 400; color: #a0aec0;`;

// Growth
const GrowthGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 8px;`;
const GrowthBox = styled.div<{ $color: string }>`
  background: white; border-radius: 8px; padding: 12px; text-align: center;
  border: 1px solid #edf2f7;
  border-top: 3px solid ${p => p.$color};
`;
const GrowthNum = styled.div`font-size: 20px; font-weight: 700; color: #1a202c;`;
const GrowthLbl = styled.div`font-size: 11px; color: #a0aec0; margin-top: 2px;`;

// Education
const ComplianceBadge = styled.span<{ $status?: string }>`
  margin-left: 6px; padding: 1px 7px; border-radius: 4px; font-size: 10px; font-weight: 700;
  background: ${p => p.$status === 'GOOD' ? '#f0fff4' : p.$status === 'WARNING' ? '#fffbeb' : '#fff5f5'};
  color: ${p => p.$status === 'GOOD' ? '#276749' : p.$status === 'WARNING' ? '#92400e' : '#9b2c2c'};
  border: 1px solid ${p => p.$status === 'GOOD' ? '#9ae6b4' : p.$status === 'WARNING' ? '#fbd38d' : '#feb2b2'};
  text-transform: uppercase;
`;
const EduRow = styled.div`display: flex; align-items: center; gap: 8px; margin-bottom: 10px;`;
const EduLabel = styled.span`font-size: 11px; color: #718096; width: 110px; flex-shrink: 0;`;
const EduBarWrap = styled.div`flex: 1; height: 6px; background: #edf2f7; border-radius: 3px; overflow: hidden;`;
const EduBarFill = styled.div`height: 100%; background: linear-gradient(90deg, #4299e1, #38a169); border-radius: 3px; transition: width 0.6s ease;`;
const EduPct = styled.span`font-size: 12px; font-weight: 700; color: #2d3748; width: 36px; text-align: right;`;
const EduStats = styled.div`display: flex; gap: 8px; margin-bottom: 12px;`;
const EduStat = styled.div`flex: 1; text-align: center; background: white; border-radius: 8px; padding: 8px; border: 1px solid #edf2f7;`;
const EduStatNum = styled.div<{ $color: string }>`font-size: 18px; font-weight: 700; color: ${p => p.$color};`;
const EduStatLbl = styled.div`font-size: 10px; color: #a0aec0; margin-top: 2px;`;
const RoleCompliance = styled.div`display: flex; flex-direction: column; gap: 6px; border-top: 1px solid #edf2f7; padding-top: 10px;`;
const RoleRow = styled.div`display: flex; align-items: center; gap: 8px;`;
const RoleLabel = styled.span`font-size: 11px; color: #4a5568; width: 110px; flex-shrink: 0; text-transform: capitalize;`;
const RoleBar = styled.div`flex: 1; height: 5px; background: #edf2f7; border-radius: 3px; overflow: hidden;`;
const RoleBarFill = styled.div`height: 100%; border-radius: 3px; transition: width 0.6s ease;`;
const RoleRate = styled.span<{ $ok: boolean }>`font-size: 11px; font-weight: 700; color: ${p => p.$ok ? '#38a169' : '#e53e3e'}; width: 32px; text-align: right;`;

// Recent
const RecentSection = styled.div`border-top: 1px solid #edf2f7; padding-top: 16px;`;
const RecentTitle = styled.div`display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;`;
const RecentList = styled.div`display: flex; flex-direction: column; gap: 0;`;
const RecentItem = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 10px 0; border-bottom: 1px solid #f7fafc;
  &:last-child { border-bottom: none; }
`;
const RecentAvatar = styled.div`
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, #4299e1, #667eea);
  color: white; font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`;
const RecentInfo = styled.div`flex: 1; min-width: 0;`;
const RecentName = styled.div`font-size: 13px; font-weight: 600; color: #1a202c;`;
const RecentMeta = styled.div`font-size: 11px; color: #a0aec0; margin-top: 1px;`;
const RecentRight = styled.div`display: flex; align-items: center; gap: 6px; flex-shrink: 0;`;
const TypeTag = styled.span`padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: capitalize;`;
const VerBadge = styled.span<{ $ok?: boolean }>`
  display: inline-flex; align-items: center; gap: 3px;
  padding: 2px 7px; border-radius: 20px; font-size: 10px; font-weight: 600;
  background: ${p => p.$ok ? '#f0fff4' : '#fffbeb'};
  color: ${p => p.$ok ? '#276749' : '#92400e'};
  border: 1px solid ${p => p.$ok ? '#9ae6b4' : '#fbd38d'};
`;
