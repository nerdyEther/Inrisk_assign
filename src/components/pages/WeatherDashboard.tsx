"use client"

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import TopNav from '@/components/pages/TopNav';
import WeatherCharts from '@/components/pages/WeatherCharts';
import WeatherTable from '@/components/pages/WeatherTable';
import MainNav from './MainNav';
import Globe from "@/components/ui/globe";
import {WeatherApiService} from '@/components/pages/WeatherAPI';


interface InputState {
  latitude: string;
  longitude: string;
  startDate: string;
  endDate: string;
}

interface WeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    temperature_2m_mean: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    apparent_temperature_mean: number[];
  };
  error?: boolean;
  reason?: string;
}

interface ProcessedWeatherData {
  date: string;
  maxTemp: number;
  minTemp: number;
  meanTemp: number;
  maxAppTemp: number;
  minAppTemp: number;
  meanAppTemp: number;
}

const PlaceholderState: React.FC = () => {
  const [visibleWords, setVisibleWords] = React.useState<number>(0);
  const words = ['Explore', 'Weather', 'over', 'Globe'];

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setVisibleWords(prev => {
        if (prev < words.length) {
          return prev + 1;
        }
        clearInterval(intervalId);
        return prev;
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, [words.length]); 

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl">
        <h2 className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-2xl font-semibold text-blue-500 hidden md:block">
          {words.slice(0, visibleWords).map((word, index) => (
            <React.Fragment key={word}>
              <span className="animate-[fadeIn_0.5s_ease-in]">
                {word}
              </span>
              {index < visibleWords - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </h2>
        <div className="w-full h-[450px] flex items-center justify-center">
          <Globe className="scale-100" />
        </div>
      </div>
    </div>
  );
};

const WeatherDashboard: React.FC = () => {
  const [inputs, setInputs] = useState<InputState>({
    latitude: '',
    longitude: '',
    startDate: '',
    endDate: ''
  });
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const showErrorToast = (message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: 'white',
        color: '#334155',
        borderRadius: '1rem',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      icon: '❌',
    });
  };

  const validateInputs = (): boolean => {

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 3);
    maxDate.setHours(0, 0, 0, 0);  
  

    const minDate = new Date(maxDate);
    minDate.setFullYear(minDate.getFullYear() - 1);
    minDate.setHours(0, 0, 0, 0); 
  

    const hasNoCoordinates = !inputs.latitude && !inputs.longitude;
    const hasNoDates = !inputs.startDate && !inputs.endDate;
    
    if (hasNoCoordinates && hasNoDates) {
      showErrorToast("Please enter coordinates and select dates to fetch weather data");
      return false;
    }
  
  
    if (!inputs.latitude || !inputs.longitude) {
      showErrorToast("Please enter both latitude and longitude values");
      return false;
    }
  
    const lat = parseFloat(inputs.latitude);
    const lon = parseFloat(inputs.longitude);
  
    if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lon) || lon < -180 || lon > 180) {
      showErrorToast("Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)");
      return false;
    }
  

    if (!inputs.startDate || !inputs.endDate) {
      showErrorToast("Please select both start and end dates");
      return false;
    }
  
    const startDate = new Date(inputs.startDate);
    const endDate = new Date(inputs.endDate);
    

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      showErrorToast("Please enter valid dates");
      return false;
    }
  
  
    if (endDate < startDate) {
      showErrorToast("End date must be after start date");
      return false;
    }
  

    if (startDate > maxDate || endDate > maxDate) {
      showErrorToast("Max date selected can be 3 days before current date");
      return false;
    }
  
 
    if (startDate < minDate || endDate < minDate) {
      showErrorToast("Dates cannot be earlier than 1 year before the maximum allowed date");
      return false;
    }
    
   
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (endDate.getTime() - startDate.getTime() > oneYear) {
      showErrorToast("Date range cannot exceed 1 year");
      return false;
    }
  
    return true;
  };

  const fetchWeatherData = async (): Promise<void> => {
    if (!validateInputs()) return;
  
    setLoading(true);
    setError(null);
    setCurrentPage(1);
  
    try {
      const data = await WeatherApiService.fetchWeatherData({
        latitude: inputs.latitude,
        longitude: inputs.longitude,
        startDate: inputs.startDate,
        endDate: inputs.endDate
      });
  
  
      if (data && typeof data === 'object' && 'daily' in data) {
        setWeatherData(data);
      } else {
        throw new Error('Invalid data format received');
      }
     
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      showErrorToast(errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const getTableData = (): ProcessedWeatherData[] => {
    if (!weatherData?.daily) {
      return [];
    }

    try {
      const startIndex = (currentPage - 1) * 5;
      const endIndex = startIndex + 5;
      
      return weatherData.daily.time.map((date, index) => ({
        date,
        maxTemp: weatherData.daily.temperature_2m_max[index] ?? 0,
        minTemp: weatherData.daily.temperature_2m_min[index] ?? 0,
        meanTemp: weatherData.daily.temperature_2m_mean[index] ?? 0,
        maxAppTemp: weatherData.daily.apparent_temperature_max[index] ?? 0,
        minAppTemp: weatherData.daily.apparent_temperature_min[index] ?? 0,
        meanAppTemp: weatherData.daily.apparent_temperature_mean[index] ?? 0,
      })).slice(startIndex, endIndex);
    } catch {
      showErrorToast("Error processing weather data");
      return [];
    }
  };

  const getChartData = (): ProcessedWeatherData[] => {
    if (!weatherData?.daily) {
      return [];
    }

    try {
      return weatherData.daily.time.map((date, index) => ({
        date,
        maxTemp: weatherData.daily.temperature_2m_max[index] ?? 0,
        minTemp: weatherData.daily.temperature_2m_min[index] ?? 0,
        meanTemp: weatherData.daily.temperature_2m_mean[index] ?? 0,
        maxAppTemp: weatherData.daily.apparent_temperature_max[index] ?? 0,
        minAppTemp: weatherData.daily.apparent_temperature_min[index] ?? 0,
        meanAppTemp: weatherData.daily.apparent_temperature_mean[index] ?? 0,
      }));
    } catch {
      showErrorToast("Error processing chart data");
      return [];
    }
  };

  const getTotalPages = (): number => {
    if (!weatherData?.daily?.time) return 0;
    return Math.ceil(weatherData.daily.time.length / 5);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <div className="flex-1 flex flex-col pt-16">
        <TopNav 
          inputs={inputs}
          setInputs={setInputs}
          onFetchData={fetchWeatherData}
          loading={loading}
        />
        <main className="flex-1">
          {loading && (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {!loading && !weatherData && !error && <PlaceholderState />}
          
          {!loading && weatherData && (
            <div className="h-full max-w-7xl mx-auto p-6 space-y-6">
              <WeatherCharts data={getChartData()} />
              <WeatherTable 
                data={getTableData()}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={getTotalPages()}
              />
            </div>
          )}
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default WeatherDashboard;