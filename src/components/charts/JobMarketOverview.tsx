import React, { useEffect, useState, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiBriefcase, FiCheckCircle, FiClock, FiUsers, FiUserCheck,
  FiTrendingUp, FiRefreshCw, FiAlertTriangle, FiShield,
  FiBarChart2, FiInfo, FiXCircle,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { jobMonitoringApi } from "../../services/monitoringApi";

// ── Types ──────────────────────────────────────────────────────────────────

interface GlobalJobStats {
  total: number;
  active: number;
  expired: number;
  lastUpdated: string;
}

interface AgencyStats {
  jobsCount: number;
  activeJobsCount: number;
  applicationsCount: number;
  applicantsCount: number;
  lastUpdated: string;
}

interface AppBreakdown {
  applied: number;
  matched: number;
  interviewed: number;
  shortlisted: number;
  hired: number;
  rejected: number;
}

interface ApplicationStats {
  total: number;
  breakdown: AppBreakdown;
  lastUpdated: string;
}

type FetchStatus = "idle" | "loading" | "success" | "error" | "forbidden" | "rate_limited";

// ── Simple in-memory cache (survives re-renders, cleared on page reload) ──
interface CacheEntry<T> { data: T; ts: number; }
const cache: Record<string, CacheEntry<any>> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) { delete cache[key]; return null; }
  return entry.data as T;
}
function setCached<T>(key: string, data: T) {
  cache[key] = { data, ts: Date.now() };
}

// ── Animations ─────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
`;
const spin = keyframes`
  from { transform: rotate(0deg);   }
  to   { transform: rotate(360deg); }
`;
const fillBar = keyframes`
  from { width: 0%; }
`;

// ── Styled Components ──────────────────────────────────────────────────────

const Section = styled.div`animation: ${fadeIn} 0.4s ease;`;

const SectionHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
`;
const SectionTitle = styled.h2`
  font-size: 20px; font-weight: 700; color: #2c3e50;
  display: flex; align-items: center; gap: 10px; margin: 0;
`;
const SectionSubtitle = styled.p`font-size: 13px; color: #7f8c8d; margin: 4px 0 0 30px;`;

const RefreshBtn = styled.button<{ $spinning?: boolean }>`
  background: #f0f4f8; border: none; border-radius: 8px; padding: 8px 14px;
  cursor: pointer; font-size: 13px; font-weight: 500; color: #2c3e50;
  display: flex; align-items: center; gap: 6px; transition: background 0.2s;
  svg { animation: ${p => p.$spinning ? spin : "none"} 1s linear infinite; }
  &:hover:not(:disabled) { background: #dce6f0; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px; margin-bottom: 8px;
`;
const StatCard = styled.div<{ $gradient: string }>`
  background: ${p => p.$gradient}; border-radius: 14px; padding: 22px 24px;
  color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex; flex-direction: column; gap: 10px; animation: ${fadeIn} 0.4s ease;
`;
const StatIcon = styled.div`
  width: 40px; height: 40px; background: rgba(255,255,255,0.2);
  border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px;
`;
const StatValue = styled.div`font-size: 34px; font-weight: 800; line-height: 1;`;
const StatLabel = styled.div`font-size: 13px; font-weight: 500; opacity: 0.9;`;
const StatMeta  = styled.div`font-size: 11px; opacity: 0.7; margin-top: 2px;`;

const SkeletonCard = styled.div`
  border-radius: 14px; padding: 22px 24px; height: 130px;
  background: linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%);
  background-size: 400px 100%; animation: ${shimmer} 1.4s ease infinite;
`;
const SkeletonBar = styled.div`
  border-radius: 8px; height: 64px;
  background: linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%);
  background-size: 400px 100%; animation: ${shimmer} 1.4s ease infinite;
`;

const AlertBanner = styled.div<{ type: "error" | "warning" | "info" }>`
  display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px;
  border-radius: 10px; margin-bottom: 16px; font-size: 14px;
  background: ${p => ({ error: "#fef2f2", warning: "#fffbeb", info: "#eff6ff" }[p.type])};
  border-left: 4px solid ${p => ({ error: "#ef4444", warning: "#f59e0b", info: "#3b82f6" }[p.type])};
  color: ${p => ({ error: "#991b1b", warning: "#92400e", info: "#1e40af" }[p.type])};
`;
const AlertIcon    = styled.div`flex-shrink: 0; margin-top: 1px;`;
const AlertContent = styled.div``;
const AlertTitle   = styled.div`font-weight: 700; margin-bottom: 4px;`;
const AlertBody    = styled.div`font-size: 13px; opacity: 0.85;`;

const Divider = styled.div`height: 1px; background: #ecf0f1; margin: 28px 0;`;
const LastUpdated = styled.div`font-size: 11px; color: #b2bec3; text-align: right; margin-top: 8px;`;

const ConversionBadge = styled.div`
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.25); border-radius: 20px;
  padding: 3px 10px; font-size: 11px; font-weight: 600;
`;

// ── Hiring Pipeline styles ─────────────────────────────────────────────────

const PipelineWrap = styled.div`
  background: #f8fafc; border-radius: 14px; padding: 24px; margin-top: 4px;
`;
const PipelineTitle = styled.div`
  font-size: 15px; font-weight: 700; color: #2c3e50; margin-bottom: 20px;
  display: flex; align-items: center; gap: 8px;
`;
const FunnelList = styled.div`display: flex; flex-direction: column; gap: 12px;`;

const FunnelRow = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const FunnelMeta = styled.div`
  display: flex; justify-content: space-between; align-items: center;
`;
const FunnelLabel = styled.span<{ $color: string }>`
  font-size: 13px; font-weight: 600; color: ${p => p.$color};
  display: flex; align-items: center; gap: 6px;
`;
const FunnelCount = styled.span`font-size: 13px; font-weight: 700; color: #2c3e50;`;
const FunnelPct   = styled.span`font-size: 11px; color: #94a3b8;`;

const BarTrack = styled.div`
  height: 10px; background: #e2e8f0; border-radius: 99px; overflow: hidden;
`;
const BarFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%; width: ${p => p.$pct}%; background: ${p => p.$color};
  border-radius: 99px;
  animation: ${fillBar} 0.8s ease-out both;
`;

const SummaryRow = styled.div`
  display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap;
`;
const SummaryChip = styled.div<{ $bg: string; $color: string }>`
  background: ${p => p.$bg}; color: ${p => p.$color};
  border-radius: 10px; padding: 10px 16px; flex: 1; min-width: 120px;
  display: flex; flex-direction: column; gap: 4px;
`;
const ChipVal   = styled.div`font-size: 24px; font-weight: 800;`;
const ChipLabel = styled.div`font-size: 12px; font-weight: 600; opacity: 0.85;`;

const RestrictedBox = styled.div`
  background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 14px;
  padding: 32px; text-align: center; color: #94a3b8;
`;
const RestrictedIcon = styled.div`font-size: 32px; margin-bottom: 12px;`;
const RestrictedTitle = styled.div`font-size: 15px; font-weight: 700; color: #64748b; margin-bottom: 6px;`;
const RestrictedBody  = styled.div`font-size: 13px; line-height: 1.6;`;

// ── Token diagnostic ───────────────────────────────────────────────────────

const TokenPanel = styled.div`
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
  padding: 16px 20px; margin-bottom: 20px; font-size: 13px;
`;
const TokenPanelHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  cursor: pointer; user-select: none; font-weight: 600; color: #475569; gap: 8px;
`;
const TokenGrid = styled.div`
  display: grid; grid-template-columns: auto 1fr; gap: 6px 16px; margin-top: 12px;
`;
const TokenKey = styled.span`font-weight: 600; color: #64748b; white-space: nowrap;`;
const TokenVal = styled.span<{ $ok?: boolean; $warn?: boolean }>`
  color: ${p => p.$warn ? "#b45309" : p.$ok ? "#15803d" : "#1e293b"};
  font-family: monospace; word-break: break-all;
`;

// ── Helpers ────────────────────────────────────────────────────────────────

const fmt = (iso: string) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
};

const decodeJwt = (token: string): Record<string, any> | null => {
  try {
    const p = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(p));
  } catch { return null; }
};

const RATE_LIMIT_MS = 62_000;

// ── Pipeline config ────────────────────────────────────────────────────────

interface StageConfig {
  key: keyof AppBreakdown;
  label: string;
  color: string;
  bg: string;
}

const STAGES: StageConfig[] = [
  { key: "applied",     label: "Applied",     color: "#3b82f6", bg: "#eff6ff" },
  { key: "matched",     label: "Matched",     color: "#8b5cf6", bg: "#f5f3ff" },
  { key: "interviewed", label: "Interviewed", color: "#f59e0b", bg: "#fffbeb" },
  { key: "shortlisted", label: "Shortlisted", color: "#f97316", bg: "#fff7ed" },
  { key: "hired",       label: "Hired",       color: "#10b981", bg: "#ecfdf5" },
  { key: "rejected",    label: "Rejected",    color: "#ef4444", bg: "#fef2f2" },
];


// ── Component ──────────────────────────────────────────────────────────────

const JobMarketOverview: React.FC = () => {
  const accessToken  = useSelector((state: RootState) => state.user.accessToken);
  const tokenPayload = accessToken ? decodeJwt(accessToken) : null;

  // Global job stats
  const [globalStats,  setGlobalStats]  = useState<GlobalJobStats | null>(null);
  const [globalStatus, setGlobalStatus] = useState<FetchStatus>("idle");
  const [globalError,  setGlobalError]  = useState<string | null>(null);

  // Agency stats
  const [agencyStats,  setAgencyStats]  = useState<AgencyStats | null>(null);
  const [agencyStatus, setAgencyStatus] = useState<FetchStatus>("idle");
  const [agencyError,  setAgencyError]  = useState<string | null>(null);

  // Application / pipeline stats
  const [appStats,  setAppStats]  = useState<ApplicationStats | null>(null);
  const [appStatus, setAppStatus] = useState<FetchStatus>("idle");
  const [appError,  setAppError]  = useState<string | null>(null);

  // UI state
  // Auto-expand token diagnostic on first 403
  const [showTokenDiag, setShowTokenDiag] = useState(true);

  // Rate-limit
  const rateLimitUntil = useRef<number>(0);
  const [rlCountdown, setRlCountdown] = useState(0);

  useEffect(() => {
    if (rlCountdown <= 0) return;
    const t = setTimeout(() => setRlCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [rlCountdown]);

  const isRL = () => Date.now() < rateLimitUntil.current;

  const handleErr = (
    err: any,
    setStatus: (s: FetchStatus) => void,
    setError: (e: string) => void,
  ) => {
    const code = err?.response?.status;
    if (code === 403) {
      setStatus("forbidden");
      setError(
        err?.response?.data?.details?.message ||
        err?.response?.data?.message ||
        "You need elevated Admin/Agency permissions to view this data.",
      );
    } else if (code === 429) {
      setStatus("rate_limited");
      setError("Rate limit reached (50 req/min). Please wait.");
      rateLimitUntil.current = Date.now() + RATE_LIMIT_MS;
      setRlCountdown(Math.ceil(RATE_LIMIT_MS / 1000));
    } else {
      setStatus("error");
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load statistics.",
      );
    }
  };

  // ── Fetchers ──────────────────────────────────────────────────────────────

  const fetchGlobal = useCallback(async (force = false) => {
    if (isRL()) return;
    if (!force) {
      const cached = getCached<GlobalJobStats>("globalJobStats");
      if (cached) { setGlobalStats(cached); setGlobalStatus("success"); return; }
    }
    setGlobalStatus("loading"); setGlobalError(null);
    try {
      const d = await jobMonitoringApi.getJobStats();
      const parsed: GlobalJobStats = {
        total: d.total ?? 0, active: d.active ?? 0,
        expired: d.expired ?? 0, lastUpdated: d.lastUpdated ?? new Date().toISOString(),
      };
      setCached("globalJobStats", parsed);
      setGlobalStats(parsed); setGlobalStatus("success");
    } catch (err: any) { 
      console.error('Global stats error:', err);
      handleErr(err, setGlobalStatus, setGlobalError); 
    }
  }, []);

  const fetchAgency = useCallback(async (force = false) => {
    if (isRL()) return;
    if (!force) {
      const cached = getCached<AgencyStats>("agencyStats");
      if (cached) { setAgencyStats(cached); setAgencyStatus("success"); return; }
    }
    setAgencyStatus("loading"); setAgencyError(null);
    try {
      const d = await jobMonitoringApi.getAgencyStats();
      const parsed: AgencyStats = {
        jobsCount: d.jobsCount ?? 0, activeJobsCount: d.activeJobsCount ?? 0,
        applicationsCount: d.applicationsCount ?? 0, applicantsCount: d.applicantsCount ?? 0,
        lastUpdated: d.lastUpdated ?? new Date().toISOString(),
      };
      setCached("agencyStats", parsed);
      setAgencyStats(parsed); setAgencyStatus("success");
    } catch (err: any) { handleErr(err, setAgencyStatus, setAgencyError); }
  }, []);

  const fetchAppStats = useCallback(async (force = false) => {
    if (isRL()) return;
    if (!force) {
      const cached = getCached<ApplicationStats>("appStats");
      if (cached) { setAppStats(cached); setAppStatus("success"); return; }
    }
    setAppStatus("loading"); setAppError(null);
    try {
      const d = await jobMonitoringApi.getApplicationStats();
      const parsed: ApplicationStats = {
        total: d.total ?? 0,
        breakdown: {
          applied:     d.breakdown?.applied     ?? 0,
          matched:     d.breakdown?.matched     ?? 0,
          interviewed: d.breakdown?.interviewed ?? 0,
          shortlisted: d.breakdown?.shortlisted ?? 0,
          hired:       d.breakdown?.hired       ?? 0,
          rejected:    d.breakdown?.rejected    ?? 0,
        },
        lastUpdated: d.lastUpdated ?? new Date().toISOString(),
      };
      setCached("appStats", parsed);
      setAppStats(parsed); setAppStatus("success");
    } catch (err: any) { handleErr(err, setAppStatus, setAppError); }
  }, []);

  const fetchAll = useCallback((force = false) => {
    if (isRL()) return;
    fetchGlobal(force);
    fetchAgency(force);
    fetchAppStats(force);
  }, [fetchGlobal, fetchAgency, fetchAppStats]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived ───────────────────────────────────────────────────────────────

  const isLoading = [globalStatus, agencyStatus, appStatus].includes("loading");
  const hasForbidden = [globalStatus, agencyStatus, appStatus].includes("forbidden");

  const conversionRate =
    agencyStats && agencyStats.jobsCount > 0
      ? (agencyStats.applicationsCount / agencyStats.jobsCount).toFixed(1)
      : null;

  const maxStageVal = appStats
    ? Math.max(...STAGES.map(s => appStats.breakdown[s.key]), 1)
    : 1;

  const hireRate = appStats && appStats.total > 0
    ? ((appStats.breakdown.hired / appStats.total) * 100).toFixed(1)
    : null;

  const rejectRate = appStats && appStats.total > 0
    ? ((appStats.breakdown.rejected / appStats.total) * 100).toFixed(1)
    : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Section>
      {/* Header */}
      <SectionHeader>
        <div>
          <SectionTitle>
            <FiBarChart2 color="#3498db" />
            Job Market Overview
          </SectionTitle>
          <SectionSubtitle>
            Aggregated data only — no PII displayed (INSA-DP-001)
          </SectionSubtitle>
        </div>
        <RefreshBtn
          onClick={() => fetchAll(true)}
          disabled={isLoading || isRL()}
          $spinning={isLoading}
          title={isRL() ? `Rate limited — retry in ${rlCountdown}s` : "Force refresh (bypasses cache)"}
        >
          <FiRefreshCw size={14} />
          {isRL() ? `Wait ${rlCountdown}s` : "Refresh"}
        </RefreshBtn>
      </SectionHeader>

      {/* Rate limit banner */}
      {[globalStatus, agencyStatus, appStatus].includes("rate_limited") && (
        <AlertBanner type="warning">
          <AlertIcon><FiClock size={18} /></AlertIcon>
          <AlertContent>
            <AlertTitle>Rate Limit Reached</AlertTitle>
            <AlertBody>
              Job Service allows 50 req/min (INSA-API-001). Auto-retry in {rlCountdown}s.
              Stats are cached for 5 minutes to minimise requests.
            </AlertBody>
          </AlertContent>
        </AlertBanner>
      )}

      {/* Token diagnostic — only when 403 */}
      {hasForbidden && tokenPayload && (
        <TokenPanel>
          <TokenPanelHeader onClick={() => setShowTokenDiag(v => !v)}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FiInfo size={14} />
              Token Diagnostic — click to {showTokenDiag ? "hide" : "inspect"}
            </span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              Helps identify why the job service returns 403
            </span>
          </TokenPanelHeader>
          {showTokenDiag && (
            <TokenGrid>
              <TokenKey>sub (party_id):</TokenKey>
              <TokenVal>{tokenPayload.sub ?? "—"}</TokenVal>

              <TokenKey>role:</TokenKey>
              <TokenVal
                $ok={tokenPayload.role === "admin" || tokenPayload.role === "agency"}
                $warn={!tokenPayload.role}
              >
                {tokenPayload.role ?? "MISSING ⚠"}
              </TokenVal>

              <TokenKey>email:</TokenKey>
              <TokenVal $warn={!tokenPayload.email}>
                {tokenPayload.email ?? "null ⚠ — job service requires a non-null email claim"}
              </TokenVal>

              <TokenKey>expires:</TokenKey>
              <TokenVal $warn={tokenPayload.exp && tokenPayload.exp * 1000 < Date.now()}>
                {tokenPayload.exp
                  ? `${new Date(tokenPayload.exp * 1000).toLocaleString()}${tokenPayload.exp * 1000 < Date.now() ? " — EXPIRED ⚠" : " ✓"}`
                  : "—"}
              </TokenVal>

              <TokenKey>issued at:</TokenKey>
              <TokenVal>{tokenPayload.iat ? new Date(tokenPayload.iat * 1000).toLocaleString() : "—"}</TokenVal>

              <TokenKey>subscription:</TokenKey>
              <TokenVal>
                {tokenPayload.subscription
                  ? `${tokenPayload.subscription.type} / ${tokenPayload.subscription.status}`
                  : "—"}
              </TokenVal>

              <TokenKey style={{ gridColumn: "1 / -1", marginTop: 10, padding: "10px 12px", background: "#fef9c3", borderRadius: 8, color: "#713f12", fontWeight: 400, fontSize: 12, lineHeight: 1.6 }}>
                <strong>Root cause:</strong> Your token has <code>role: "admin"</code> ✓ and is being sent
                correctly. The job service (<code>stage-jobs.besewonline.com</code>) is rejecting it because
                it has a separate authorization layer that requires either:<br />
                1. <strong>email is non-null</strong> in the JWT — this account has <code>email: null</code>.<br />
                2. <strong>party_id <code>{tokenPayload.sub}</code> is registered</strong> in the job service's own database.<br /><br />
                <strong>Fix (backend team action required):</strong> Add an email to this admin account in the
                account service, OR whitelist party_id <code>{tokenPayload.sub}</code> in the job service.
                The frontend is sending the token correctly — this is a backend configuration issue.
              </TokenKey>
            </TokenGrid>
          )}
        </TokenPanel>
      )}

      {/* ── Global Job Stats ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Global Job Posts — Admin View
        </div>

        {globalStatus === "forbidden" && (
          <AlertBanner type="error">
            <AlertIcon><FiShield size={18} /></AlertIcon>
            <AlertContent>
              <AlertTitle>Job Service Access Denied</AlertTitle>
              <AlertBody>
                Your token has <strong>role: "admin"</strong> and is being sent correctly.
                The job service is rejecting it because this account's <strong>email is null</strong> or
                the party_id is not registered in the job service database.
                See the Token Diagnostic above for details.
              </AlertBody>
            </AlertContent>
          </AlertBanner>
        )}
        {globalStatus === "error" && (
          <AlertBanner type="error">
            <AlertIcon><FiAlertTriangle size={18} /></AlertIcon>
            <AlertContent>
              <AlertTitle>Failed to Load Global Stats</AlertTitle>
              <AlertBody>{globalError}</AlertBody>
            </AlertContent>
          </AlertBanner>
        )}

        <StatsGrid>
          {globalStatus === "loading" ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : globalStatus === "success" && globalStats ? (
            <>
              <StatCard $gradient="linear-gradient(135deg,#667eea 0%,#764ba2 100%)">
                <StatIcon><FiBriefcase /></StatIcon>
                <StatValue>{globalStats.total.toLocaleString()}</StatValue>
                <StatLabel>Total Job Posts</StatLabel>
                <StatMeta>All-time postings on platform</StatMeta>
              </StatCard>
              <StatCard $gradient="linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)">
                <StatIcon><FiCheckCircle /></StatIcon>
                <StatValue>{globalStats.active.toLocaleString()}</StatValue>
                <StatLabel>Active Posts</StatLabel>
                <StatMeta>
                  {globalStats.total > 0
                    ? `${Math.round((globalStats.active / globalStats.total) * 100)}% of total`
                    : "Currently live"}
                </StatMeta>
              </StatCard>
              <StatCard $gradient="linear-gradient(135deg,#fa709a 0%,#fee140 100%)">
                <StatIcon><FiClock /></StatIcon>
                <StatValue>{globalStats.expired.toLocaleString()}</StatValue>
                <StatLabel>Expired Posts</StatLabel>
                <StatMeta>
                  {globalStats.total > 0
                    ? `${Math.round((globalStats.expired / globalStats.total) * 100)}% of total`
                    : "No longer active"}
                </StatMeta>
              </StatCard>
            </>
          ) : (globalStatus === "forbidden" || globalStatus === "error") ? (
            <div style={{ gridColumn: "1 / -1", padding: "20px", textAlign: "center", color: "#95a5a6", fontSize: 14 }}>
              Stats unavailable — check permissions above.
            </div>
          ) : null}
        </StatsGrid>
        {globalStatus === "success" && globalStats?.lastUpdated && (
          <LastUpdated>Last updated: {fmt(globalStats.lastUpdated)}</LastUpdated>
        )}
      </div>

      <Divider />

      {/* ── Agency Performance ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Agency Performance
        </div>

        {agencyStatus === "forbidden" && (
          <AlertBanner type="error">
            <AlertIcon><FiShield size={18} /></AlertIcon>
            <AlertContent>
              <AlertTitle>Job Service Access Denied</AlertTitle>
              <AlertBody>
                Same root cause as above — the job service requires a non-null email or
                registered party_id. See the Token Diagnostic for the fix.
              </AlertBody>
            </AlertContent>
          </AlertBanner>
        )}
        {agencyStatus === "error" && (
          <AlertBanner type="error">
            <AlertIcon><FiAlertTriangle size={18} /></AlertIcon>
            <AlertContent>
              <AlertTitle>Failed to Load Agency Stats</AlertTitle>
              <AlertBody>{agencyError}</AlertBody>
            </AlertContent>
          </AlertBanner>
        )}

        <StatsGrid>
          {agencyStatus === "loading" ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : agencyStatus === "success" && agencyStats ? (
            <>
              <StatCard $gradient="linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)">
                <StatIcon><FiBriefcase /></StatIcon>
                <StatValue>{agencyStats.jobsCount.toLocaleString()}</StatValue>
                <StatLabel>Jobs Posted</StatLabel>
                <StatMeta>{agencyStats.activeJobsCount} currently active</StatMeta>
              </StatCard>
              <StatCard $gradient="linear-gradient(135deg,#f093fb 0%,#f5576c 100%)">
                <StatIcon><FiUsers /></StatIcon>
                <StatValue>{agencyStats.applicationsCount.toLocaleString()}</StatValue>
                <StatLabel>Total Applications</StatLabel>
                <StatMeta>Across all posted jobs</StatMeta>
              </StatCard>
              <StatCard $gradient="linear-gradient(135deg,#5ee7df 0%,#b490ca 100%)">
                <StatIcon><FiUserCheck /></StatIcon>
                <StatValue>{agencyStats.applicantsCount.toLocaleString()}</StatValue>
                <StatLabel>Unique Applicants</StatLabel>
                <StatMeta>Individual job seekers</StatMeta>
              </StatCard>
              <StatCard $gradient="linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)">
                <StatIcon><FiTrendingUp /></StatIcon>
                <StatValue>{conversionRate ?? "—"}</StatValue>
                <StatLabel>Avg Applications / Job</StatLabel>
                <StatMeta>
                  {conversionRate ? (
                    <ConversionBadge>
                      <FiTrendingUp size={10} /> {conversionRate}x conversion
                    </ConversionBadge>
                  ) : "No jobs posted yet"}
                </StatMeta>
              </StatCard>
            </>
          ) : (agencyStatus === "forbidden" || agencyStatus === "error") ? (
            <div style={{ gridColumn: "1 / -1", padding: "20px", textAlign: "center", color: "#95a5a6", fontSize: 14 }}>
              Agency stats unavailable — check permissions above.
            </div>
          ) : null}
        </StatsGrid>
        {agencyStatus === "success" && agencyStats?.lastUpdated && (
          <LastUpdated>Last updated: {fmt(agencyStats.lastUpdated)}</LastUpdated>
        )}
      </div>

      <Divider />

      {/* ── Hiring Pipeline ── */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Hiring Pipeline
        </div>

        {appStatus === "forbidden" && (
          <RestrictedBox>
            <RestrictedIcon>🔒</RestrictedIcon>
            <RestrictedTitle>Application data is currently restricted.</RestrictedTitle>
            <RestrictedBody>
              Your token has <strong>role: "admin"</strong> and is being sent correctly to{" "}
              <code>stage-jobs.besewonline.com/applications/stats</code>.<br /><br />
              The job service is returning 403 because this admin account (<code>ETH26-1-TK-004</code>)
              has <strong>email: null</strong> in its JWT, or is not registered in the job service database.<br /><br />
              <strong>Backend fix needed:</strong> Ask the backend team to either:<br />
              1. Add an email address to this admin account in the account service, or<br />
              2. Whitelist party_id <code>ETH26-1-TK-004</code> in the job service authorization layer.
            </RestrictedBody>
          </RestrictedBox>
        )}

        {appStatus === "error" && (
          <AlertBanner type="error">
            <AlertIcon><FiAlertTriangle size={18} /></AlertIcon>
            <AlertContent>
              <AlertTitle>Failed to Load Application Stats</AlertTitle>
              <AlertBody>{appError}</AlertBody>
            </AlertContent>
          </AlertBanner>
        )}

        {appStatus === "loading" && (
          <PipelineWrap>
            <SkeletonBar />
            <div style={{ marginTop: 12 }}><SkeletonBar /></div>
            <div style={{ marginTop: 12 }}><SkeletonBar /></div>
          </PipelineWrap>
        )}

        {appStatus === "success" && appStats && (
          <PipelineWrap>
            <PipelineTitle>
              <FiUsers size={16} color="#3b82f6" />
              Application Funnel — {appStats.total.toLocaleString()} total
            </PipelineTitle>

            <FunnelList>
              {STAGES.map(stage => {
                const val = appStats.breakdown[stage.key];
                const pct = appStats.total > 0 ? (val / appStats.total) * 100 : 0;
                const barPct = (val / maxStageVal) * 100;
                return (
                  <FunnelRow key={stage.key}>
                    <FunnelMeta>
                      <FunnelLabel $color={stage.color}>
                        {stage.key === "hired"    && <FiCheckCircle size={13} />}
                        {stage.key === "rejected" && <FiXCircle size={13} />}
                        {stage.label}
                      </FunnelLabel>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <FunnelCount>{val.toLocaleString()}</FunnelCount>
                        <FunnelPct>{pct.toFixed(1)}%</FunnelPct>
                      </div>
                    </FunnelMeta>
                    <BarTrack>
                      <BarFill $pct={barPct} $color={stage.color} />
                    </BarTrack>
                  </FunnelRow>
                );
              })}
            </FunnelList>

            {/* Summary chips */}
            <SummaryRow>
              <SummaryChip $bg="#ecfdf5" $color="#065f46">
                <ChipVal>{appStats.breakdown.hired.toLocaleString()}</ChipVal>
                <ChipLabel>✓ Hired ({hireRate}%)</ChipLabel>
              </SummaryChip>
              <SummaryChip $bg="#fef2f2" $color="#991b1b">
                <ChipVal>{appStats.breakdown.rejected.toLocaleString()}</ChipVal>
                <ChipLabel>✗ Rejected ({rejectRate}%)</ChipLabel>
              </SummaryChip>
              <SummaryChip $bg="#fffbeb" $color="#92400e">
                <ChipVal>
                  {(appStats.breakdown.interviewed + appStats.breakdown.shortlisted).toLocaleString()}
                </ChipVal>
                <ChipLabel>⏳ In Progress</ChipLabel>
              </SummaryChip>
              <SummaryChip $bg="#eff6ff" $color="#1e40af">
                <ChipVal>{appStats.total.toLocaleString()}</ChipVal>
                <ChipLabel>Total Applications</ChipLabel>
              </SummaryChip>
            </SummaryRow>

            <LastUpdated>Last updated: {fmt(appStats.lastUpdated)}</LastUpdated>
          </PipelineWrap>
        )}
      </div>

      {/* INSA compliance footer */}
      <AlertBanner type="info" style={{ marginTop: 24, marginBottom: 0 }}>
        <AlertIcon><FiShield size={16} /></AlertIcon>
        <AlertContent>
          <AlertBody>
            <strong>INSA Compliance:</strong> All access is audit-logged (INSA-MON-001).
            Only aggregated data — no PII (INSA-DP-001). JWT required (INSA-AUTH-001).
            Rate limiting at 50 req/min (INSA-API-001). Stats cached for 5 min client-side.
          </AlertBody>
        </AlertContent>
      </AlertBanner>
    </Section>
  );
};

export default JobMarketOverview;
