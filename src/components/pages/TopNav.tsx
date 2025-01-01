'use client';

import React from 'react';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InputState {
  latitude: string;
  longitude: string;
  startDate: string;
  endDate: string;
}

interface TopNavProps {
  inputs: InputState;
  setInputs: React.Dispatch<React.SetStateAction<InputState>>;
  onFetchData: () => Promise<void>;
  loading: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ 
  inputs, 
  setInputs, 
  onFetchData, 
  loading 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  //  max date (3 days before current date)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  //  min date (1 year before max date)
  const minDate = new Date(maxDate);
  minDate.setFullYear(minDate.getFullYear() - 1);
  const minDateString = minDate.toISOString().split('T')[0];


  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setInputs(prev => {
      
      if (prev.endDate && prev.endDate < newStartDate) {
        return { ...prev, startDate: newStartDate, endDate: newStartDate };
      }
      return { ...prev, startDate: newStartDate };
    });
  };


  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setInputs(prev => ({ ...prev, endDate: newEndDate }));
  };

  return (
    <div className="w-full bg-white/50 backdrop-blur-sm py-2 sm:py-4">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border p-3 sm:p-4">
        
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full md:hidden flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                Search Weather Data
              </span>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          
          <div className={`${
            isExpanded ? 'block' : 'hidden'
          } md:block`}>
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-4 p-4 md:p-0">
            

              <div className="flex-[2] space-y-3 md:space-y-1">
                <div className="flex items-center gap-2 px-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Enter coordinates</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Input
                    type="number"
                    placeholder="Latitude"
                    className="h-12 transition-all border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-xl"
                    value={inputs.latitude}
                    onChange={(e) => setInputs(prev => ({...prev, latitude: e.target.value}))}
                  />
                  <Input
                    type="number"
                    placeholder="Longitude"
                    className="h-12 transition-all border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-xl"
                    value={inputs.longitude}
                    onChange={(e) => setInputs(prev => ({...prev, longitude: e.target.value}))}
                  />
                </div>
              </div>

          
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-3 md:space-y-1">
                  <div className="flex items-center gap-2 px-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Start date</span>
                  </div>
                  <Input
                    type="date"
                    className="h-12 transition-all border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-xl"
                    value={inputs.startDate}
                    min={minDateString}
                    max={maxDateString}
                    onChange={handleStartDateChange}
                  />
                </div>
                <div className="flex-1 space-y-3 md:space-y-1">
                  <div className="flex items-center gap-2 px-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">End date</span>
                  </div>
                  <Input
                    type="date"
                    className="h-12 transition-all border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-xl"
                    value={inputs.endDate}
                    min={inputs.startDate || minDateString}
                    max={maxDateString}
                    onChange={handleEndDateChange}
                    style={{
                      WebkitTextFillColor: 'black',
                      opacity: '1',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>

           
              <Button 
                onClick={() => {
                  onFetchData();
                  setIsExpanded(false);
                }}
                disabled={loading}
                className="h-12 w-full md:w-auto px-8 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;