// src/components/pages/TopNav.tsx
'use client';

import React from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
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
    return (
      <div className="w-full bg-white/50 backdrop-blur-sm py-4">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <div className="flex items-end gap-4">
              {/* Coordinates Group - Made wider with flex-[2] */}
              <div className="flex-[2] space-y-1"> {/* Increased flex proportion */}
                <div className="flex items-center gap-2 px-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Enter coordinates for data</span>
                </div>
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Enter latitude"
                    className="h-12 transition-all border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-xl"
                    value={inputs.latitude}
                    onChange={(e) => setInputs(prev => ({...prev, latitude: e.target.value}))}
                  />
                  <Input
                    type="number"
                    placeholder="Enter longitude"
                    className="h-12 transition-all border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-xl"
                    value={inputs.longitude}
                    onChange={(e) => setInputs(prev => ({...prev, longitude: e.target.value}))}
                  />
                </div>
              </div>
  
              {/* Date Range Group - Made narrower with flex-1 */}
              <div className="flex-1 flex gap-4"> {/* Standard flex-1 */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 px-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Start date</span>
                  </div>
                  <Input
                    type="date"
                    className="h-12 transition-all border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-xl"
                    value={inputs.startDate}
                    onChange={(e) => setInputs(prev => ({...prev, startDate: e.target.value}))}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 px-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">End date</span>
                  </div>
                  <Input
                    type="date"
                    className="h-12 transition-all border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-xl"
                    value={inputs.endDate}
                    onChange={(e) => setInputs(prev => ({...prev, endDate: e.target.value}))}
                  />
                </div>
              </div>
  
              {/* Search Button */}
              <Button 
                onClick={onFetchData}
                disabled={loading}
                className="h-12 px-8 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TopNav;