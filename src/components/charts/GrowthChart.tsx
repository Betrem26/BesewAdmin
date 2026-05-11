import React from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Dot
} from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';

interface GrowthChartProps {
  growth: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      <TooltipLabel>{label}</TooltipLabel>
      <TooltipValue>+{payload[0].value} new registrations</TooltipValue>
    </TooltipBox>
  );
};

const GrowthChart: React.FC<GrowthChartProps> = ({ growth }) => {
  const data = [
    { name: 'Today',      value: growth.today },
    { name: 'This Week',  value: growth.thisWeek },
    { name: 'This Month', value: growth.thisMonth },
  ];

  return (
    <Card>
      <Header>
        <Title><FiTrendingUp /> Registration Growth</Title>
        <Badges>
          <Badge $color="#3498db">Today +{growth.today}</Badge>
          <Badge $color="#27ae60">This Week +{growth.thisWeek}</Badge>
          <Badge $color="#9b59b6">This Month +{growth.thisMonth}</Badge>
        </Badges>
      </Header>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#7f8c8d' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#7f8c8d' }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3498db"
            strokeWidth={3}
            dot={<Dot r={6} fill="#3498db" stroke="white" strokeWidth={2} />}
            activeDot={{ r: 8, fill: '#2980b9', stroke: 'white', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default GrowthChart;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
`;
const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Badges = styled.div`display: flex; gap: 8px; flex-wrap: wrap;`;
const Badge = styled.span<{ $color: string }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${p => p.$color}18;
  color: ${p => p.$color};
`;
const TooltipBox = styled.div`
  background: #2c3e50;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;
const TooltipLabel = styled.div`font-weight: 600; margin-bottom: 2px; color: #74b9ff;`;
const TooltipValue = styled.div`color: white;`;
