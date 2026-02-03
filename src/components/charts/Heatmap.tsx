import React from 'react';

interface HeatmapProps {
  data: Array<{ day: string; hour: number; value: number }>;
  title?: string;
  height?: number;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const Heatmap: React.FC<HeatmapProps> = ({
  data,
  title,
}) => {
  // Get max value for color scaling
  const maxValue = Math.max(...data.map(d => d.value));

  // Create a map for quick lookup
  const dataMap = new Map(
    data.map(d => [`${d.day}-${d.hour}`, d.value])
  );

  // Get color intensity based on value
  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = Math.round((value / maxValue) * 4);
    const colors = [
      'bg-blue-100',
      'bg-blue-300',
      'bg-blue-500',
      'bg-blue-700',
      'bg-blue-900',
    ];
    return colors[intensity] || colors[0];
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12"></div>
            {HOURS.map(hour => (
              <div
                key={hour}
                className="flex-shrink-0 w-8 text-center text-xs text-gray-600"
              >
                {hour}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {DAYS.map(day => (
            <div key={day} className="flex mb-1">
              <div className="w-12 text-xs text-gray-600 flex items-center">
                {day}
              </div>
              {HOURS.map(hour => {
                const value = dataMap.get(`${day}-${hour}`) || 0;
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`flex-shrink-0 w-8 h-8 mr-1 rounded ${getColor(value)} 
                      hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all
                      flex items-center justify-center group relative`}
                    title={`${day} ${hour}:00 - ${value} activities`}
                  >
                    {/* Tooltip on hover */}
                    <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white 
                      text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 
                      whitespace-nowrap">
                      {value} activities
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                        border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center mt-4 text-xs text-gray-600">
            <span className="mr-2">Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <div className="w-4 h-4 bg-blue-300 rounded"></div>
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <div className="w-4 h-4 bg-blue-700 rounded"></div>
              <div className="w-4 h-4 bg-blue-900 rounded"></div>
            </div>
            <span className="ml-2">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};
