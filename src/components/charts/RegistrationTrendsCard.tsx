import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiChevronDown, FiArrowUpRight } from 'react-icons/fi';

interface Props {
  growth?: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  } | null;
}

type Timeframe = 'today' | 'thisWeek' | 'thisMonth';

const OPTIONS: { key: Timeframe; label: string; sub: string }[] = [
  { key: 'today',     label: 'Today',      sub: 'New accounts joined today' },
  { key: 'thisWeek',  label: 'This Week',  sub: 'New accounts joined this week' },
  { key: 'thisMonth', label: 'This Month', sub: 'New accounts joined this month' },
];

const RegistrationTrendsCard: React.FC<Props> = ({ growth }) => {
  const [selected, setSelected] = useState<Timeframe>('thisMonth');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // No data available (403 / non-admin)
  if (!growth) {
    return (
      <Card>
        <CardHeader>
          <TitleRow>
            <IconWrap><FiTrendingUp /></IconWrap>
            <CardTitle>Registration Trends</CardTitle>
          </TitleRow>
        </CardHeader>
        <LockedState>
          <LockIcon>🔒</LockIcon>
          <LockedTitle>Admin Access Required</LockedTitle>
          <LockedSub>Growth metrics are only available for admin accounts.</LockedSub>
        </LockedState>
      </Card>
    );
  }

  const current = OPTIONS.find(o => o.key === selected)!;
  const value = growth[selected];

  // Simple growth % vs previous period (estimated)
  const prevValue = selected === 'today'
    ? Math.round(growth.thisWeek / 7)
    : selected === 'thisWeek'
    ? Math.round(growth.thisMonth / 4)
    : growth.thisMonth;

  const growthPct = prevValue > 0
    ? Math.round(((value - prevValue) / prevValue) * 100)
    : 0;

  return (
    <Card>
      {/* Header */}
      <CardHeader>
        <TitleRow>
          <IconWrap><FiTrendingUp /></IconWrap>
          <CardTitle>Registration Trends</CardTitle>
        </TitleRow>

        {/* Dropdown */}
        <DropdownWrap>
          <DropdownBtn onClick={() => setDropdownOpen(p => !p)}>
            {current.label}
            <FiChevronDown
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </DropdownBtn>
          <AnimatePresence>
            {dropdownOpen && (
              <DropdownMenu
                as={motion.div}
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                {OPTIONS.map(opt => (
                  <DropdownItem
                    key={opt.key}
                    $active={opt.key === selected}
                    onClick={() => { setSelected(opt.key); setDropdownOpen(false); }}
                  >
                    {opt.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </AnimatePresence>
        </DropdownWrap>
      </CardHeader>

      {/* Main value with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <ValueRow>
            <BigNumber>{value.toLocaleString()}</BigNumber>
            <GrowthBadge $positive={growthPct >= 0}>
              <FiArrowUpRight
                style={{ transform: growthPct < 0 ? 'rotate(90deg)' : 'none' }}
              />
              {growthPct >= 0 ? '+' : ''}{growthPct}%
            </GrowthBadge>
          </ValueRow>
          <SubText>{current.sub}</SubText>

          {/* Mini stat row */}
          <MiniStats>
            {OPTIONS.map(opt => (
              <MiniStat
                key={opt.key}
                $active={opt.key === selected}
                onClick={() => setSelected(opt.key)}
              >
                <MiniVal>{growth[opt.key].toLocaleString()}</MiniVal>
                <MiniLbl>{opt.label}</MiniLbl>
              </MiniStat>
            ))}
          </MiniStats>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default RegistrationTrendsCard;

// ── Styled Components ──────────────────────────────────────────────────────
const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

// Dropdown
const DropdownWrap = styled.div`position: relative;`;

const DropdownBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #6366f1;
    color: #6366f1;
    background: #f5f3ff;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  z-index: 100;
  overflow: hidden;
`;

const DropdownItem = styled.div<{ $active: boolean }>`
  padding: 10px 16px;
  font-size: 13px;
  font-weight: ${p => p.$active ? '600' : '400'};
  color: ${p => p.$active ? '#6366f1' : '#475569'};
  background: ${p => p.$active ? '#f5f3ff' : 'white'};
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #f5f3ff;
    color: #6366f1;
  }
`;

// Value display
const ValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
`;

const BigNumber = styled.div`
  font-size: 36px;
  font-weight: 800;
  color: #6366f1;
  line-height: 1;
  letter-spacing: -1px;
`;

const GrowthBadge = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  background: ${p => p.$positive ? '#dcfce7' : '#fee2e2'};
  color: ${p => p.$positive ? '#16a34a' : '#dc2626'};
  align-self: flex-end;
  margin-bottom: 8px;
`;

const SubText = styled.p`
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 12px;
`;

// Mini stats row
const MiniStats = styled.div`
  display: flex;
  gap: 0;
  border: 1.5px solid #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
`;

const MiniStat = styled.div<{ $active: boolean }>`
  flex: 1;
  padding: 10px 8px;
  text-align: center;
  cursor: pointer;
  background: ${p => p.$active ? '#f5f3ff' : 'white'};
  border-right: 1px solid #f1f5f9;
  transition: background 0.15s;
  &:last-child { border-right: none; }
  &:hover { background: #f5f3ff; }
`;

const MiniVal = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
`;

const MiniLbl = styled.div`
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
`;

const LockedState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  text-align: center;
`;
const LockIcon = styled.div`font-size: 32px; margin-bottom: 10px;`;
const LockedTitle = styled.div`font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 4px;`;
const LockedSub = styled.div`font-size: 12px; color: #94a3b8; line-height: 1.5;`;
