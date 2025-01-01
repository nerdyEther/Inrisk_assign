import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NumberTicker from "@/components/ui/number-ticker";

interface WeatherDataRecord {
  date: string;
  maxTemp: number;
  minTemp: number;
  meanTemp: number;
  maxAppTemp: number;
  minAppTemp: number;
  meanAppTemp: number;
}

interface WeatherTableProps {
  data: WeatherDataRecord[];
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
};

const TemperatureCell = ({ value, className, isVisible }: { value: number; className: string; isVisible: boolean }) => (
  <div className="inline-flex items-center justify-end font-medium">
    <div className={`[&_*]:${className} [&_span]:!${className}`}>
      {isVisible && <NumberTicker value={value} className={className} />}
    </div>
    <span className={className}> °C</span>
  </div>
);

const WeatherTable: React.FC<WeatherTableProps> = ({ 
  data, 
  currentPage, 
  setCurrentPage, 
  totalPages 
}) => {
  const [isTableVisible, setIsTableVisible] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTableVisible(true);
          observer.disconnect();  // Stop observing once visible
        }
      },
      {
        threshold: 0.3  // Trigger when 10% of the table is visible
      }
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => observer.disconnect();
  }, []);

  

  return (
    <Card className="w-full rounded-[32px] overflow-hidden
                    bg-white
                    shadow-xl shadow-black/30
                    relative
                    before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r 
                    before:from-[#f97316] before:via-[#10b981] before:to-[#3b82f6]
                    before:rounded-[32px] before:-z-10">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-0.5">
            <h3 className="text-gray-600 text-base font-light tracking-wide transition-all duration-500 
                        hover:text-gray-800 hover:scale-105">
              Detailed Weather Data
            </h3>
            <p className="text-2xl font-semibold text-gray-800 tracking-tight transition-all duration-500 
                       hover:scale-105">
              5 Day Overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 
                       transition-all duration-300 text-gray-600 px-4 group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 
                       transition-all duration-300 text-gray-600 px-4 group"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl px-2" ref={tableRef}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-[98%] mx-auto">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wide text-sm">Date</th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 tracking-wide text-sm">
                    <span className="text-[#f97316]">Max Temp</span>
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 tracking-wide text-sm">
                    <span className="text-[#10b981]">Mean Temp</span>
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 tracking-wide text-sm">
                    <span className="text-[#3b82f6]">Min Temp</span>
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 tracking-wide text-sm">
                    <span className="text-[#fb923c]">Max App. Temp</span>
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 tracking-wide text-sm">
                    <span className="text-[#34d399]">Mean App. Temp</span>
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-gray-500 tracking-wide text-sm">
                    <span className="text-[#60a5fa]">Min App. Temp</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} 
                      className="border-b border-gray-50 transition-all duration-300
                               hover:bg-gray-50/50 hover:scale-[1.02] hover:shadow-md
                               relative cursor-default origin-center">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatDate(row.date)}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <TemperatureCell value={row.maxTemp} className="text-[#f97316]" isVisible={isTableVisible} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <TemperatureCell value={row.meanTemp} className="text-[#10b981]" isVisible={isTableVisible} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <TemperatureCell value={row.minTemp} className="text-[#3b82f6]" isVisible={isTableVisible} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <TemperatureCell value={row.maxAppTemp} className="text-[#fb923c]" isVisible={isTableVisible} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <TemperatureCell value={row.meanAppTemp} className="text-[#34d399]" isVisible={isTableVisible} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <TemperatureCell value={row.minAppTemp} className="text-[#60a5fa]" isVisible={isTableVisible} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherTable;