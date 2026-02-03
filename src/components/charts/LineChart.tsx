import React from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const ChartTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
`;

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  title?: string;
  data: DataPoint[];
  color?: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ 
  title, 
  data, 
  color = '#3498db',
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        {title && <ChartTitle>{title}</ChartTitle>}
        <div style={{ textAlign: 'center', padding: '60px', color: '#7f8c8d' }}>
          No data available
        </div>
      </ChartContainer>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 800;
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const xStep = innerWidth / (data.length - 1 || 1);
  
  const points = data.map((point, index) => {
    const x = padding.left + index * xStep;
    const y = padding.top + innerHeight - ((point.value - minValue) / range) * innerHeight;
    return { x, y, ...point };
  });

  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const areaData = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  return (
    <ChartContainer>
      {title && <ChartTitle>{title}</ChartTitle>}
      <ChartSvg viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + innerHeight * (1 - ratio);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#ecf0f1"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#7f8c8d"
              >
                {Math.round(minValue + range * ratio)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path
          d={areaData}
          fill={color}
          fillOpacity="0.1"
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
            />
            {/* X-axis labels */}
            {index % Math.ceil(data.length / 6) === 0 && (
              <text
                x={point.x}
                y={chartHeight - padding.bottom + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#7f8c8d"
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </ChartSvg>
    </ChartContainer>
  );
};

export default LineChart;
