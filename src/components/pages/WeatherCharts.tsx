import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

interface WeatherDataPoint {
  date: string;
  maxTemp: number;
  minTemp: number;
  meanTemp: number;
  maxAppTemp: number;
  minAppTemp: number;
  meanAppTemp: number;
}

interface WeatherChartsProps {
  data: WeatherDataPoint[];
}

const WeatherCharts: React.FC<WeatherChartsProps> = ({ data }) => {
  const formattedData = data.map(point => ({
    ...point,
    date: new Date(point.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }));

  return (
    <div className="relative">
      <Card className="w-full h-[480px] rounded-[32px] overflow-hidden bg-white shadow-[0_0_20px_rgba(0,0,0,0.15)] relative before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-[#f97316] before:via-[#10b981] before:to-[#3b82f6] before:rounded-[32px] before:-z-10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4 relative z-20">
            <div className="space-y-0.5">
              <h3 className="text-gray-600 text-base font-light tracking-wide transition-all duration-500 hover:text-gray-800 hover:scale-105">
                Weather Trends
              </h3>
              <p className="text-2xl font-semibold tracking-tight transition-all duration-500 hover:scale-105 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                {data.length} Day Overview
              </p>
            </div>
          </div>

          <div className="h-[360px] relative mt-4">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-px bg-gray-100 shadow-[0_-1px_2px_0_rgba(0,0,0,0.1)]" />
              ))}
            </div>
            
            <div className="absolute inset-0 transition-transform duration-700 hover:scale-105 origin-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(0,0,0,0.4)" 
                    tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    interval="preserveStartEnd"
                    minTickGap={50}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    stroke="rgba(0,0,0,0.4)"
                    tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                      color: 'black',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      color: 'rgba(0,0,0,0.7)',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                    height={30}
                    iconType="plainline"
                    iconSize={30}
                  />
                  <Line type="monotone" dataKey="maxTemp" stroke="#f97316" name="Max Temp" dot={false} strokeWidth={4} className="filter drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                  <Line type="monotone" dataKey="meanTemp" stroke="#10b981" name="Mean Temp" dot={false} strokeWidth={4} className="filter drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                  <Line type="monotone" dataKey="minTemp" stroke="#3b82f6" name="Min Temp" dot={false} strokeWidth={4} className="filter drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherCharts;