import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartProps {
  data: Array<{ [key: string]: any }>;
  dataKeys: Array<{ key: string; color: string; name?: string }>;
  xAxisKey?: string;
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  dataKeys,
  xAxisKey = 'name',
  title,
  height = 300,
  showLegend = true,
  showGrid = true,
  stacked = false,
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          <XAxis
            dataKey={xAxisKey}
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          {showLegend && <Legend />}
          {dataKeys.map((item, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={item.key}
              name={item.name || item.key}
              stroke={item.color}
              fill={item.color}
              fillOpacity={0.6}
              stackId={stacked ? '1' : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
