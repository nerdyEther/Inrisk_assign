"use client"

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import TopNav from '@/components/pages/TopNav';
import WeatherCharts from '@/components/pages/WeatherCharts';
import WeatherTable from '@/components/pages/WeatherTable';
import { Card, CardContent } from "@/components/ui/card";
import MainNav from './MainNav';
import Globe from "@/components/ui/globe";

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

const PlaceholderState: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full max-w-2xl bg-white rounded-3xl">
      <h2 className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-2xl font-semibold text-blue-500">
        Explore Weather over Globe
      </h2>
      <div className="relative w-full h-[450px] flex items-center justify-center">
        <Globe className="scale-100" />
      </div>
    </div>
  </div>
);

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
      duration: 5000,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const showSuccessToast = (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const validateInputs = (): boolean => {
    const errors: string[] = [];

    // Validate coordinates
    if (!inputs.latitude || !inputs.longitude) {
      errors.push("Please enter both latitude and longitude values.");
    } else {
      const lat = parseFloat(inputs.latitude);
      const lon = parseFloat(inputs.longitude);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push("Latitude must be between -90 and 90 degrees.");
      }
      if (isNaN(lon) || lon < -180 || lon > 180) {
        errors.push("Longitude must be between -180 and 180 degrees.");
      }
    }

    // Validate dates
    if (!inputs.startDate || !inputs.endDate) {
      errors.push("Please select both start and end dates.");
    } else {
      const start = new Date(inputs.startDate);
      const end = new Date(inputs.endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        errors.push("Please enter valid dates.");
      } else {
        if (end < start) {
          errors.push("End date must be after start date.");
        }
        
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        if (end.getTime() - start.getTime() > oneYear) {
          errors.push("Date range cannot exceed 1 year.");
        }
      }
    }

    if (errors.length > 0) {
      errors.forEach((error, index) => {
        setTimeout(() => {
          showErrorToast(error);
        }, index * 500);
      });
      return false;
    }

    return true;
  };

  const validateWeatherData = (data: any): data is WeatherData => {
    if (!data || typeof data !== 'object') {
      showErrorToast("Invalid data format received");
      return false;
    }

    if (!data.daily || typeof data.daily !== 'object') {
      showErrorToast("Missing daily weather data");
      return false;
    }

    const requiredFields = [
      'time',
      'temperature_2m_max',
      'temperature_2m_min',
      'temperature_2m_mean',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'apparent_temperature_mean'
    ];

    for (const field of requiredFields) {
      if (!Array.isArray(data.daily[field])) {
        showErrorToast(`Missing or invalid ${field} data`);
        return false;
      }
    }

    const timeLength = data.daily.time.length;
    const allFieldsMatch = requiredFields.every(field => 
      data.daily[field].length === timeLength
    );

    if (!allFieldsMatch) {
      showErrorToast("Inconsistent data received");
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
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${inputs.latitude}&longitude=${inputs.longitude}&start_date=${inputs.startDate}&end_date=${inputs.endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,apparent_temperature_mean`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'API returned an error');
      }

      if (!validateWeatherData(data)) {
        throw new Error('Invalid data structure received');
      }

      setWeatherData(data);
      showSuccessToast(`Weather data retrieved for ${data.daily.time.length} days`);
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
    } catch (error) {
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
    } catch (error) {
      showErrorToast("Error processing chart data");
      return [];
    }
  };

  const getTotalPages = (): number => {
    if (!weatherData?.daily?.time) return 0;
    return Math.ceil(weatherData.daily.time.length / 5);
  };

  return (
    <div className="flex flex-col h-screen">
      <MainNav />
      <div className="flex-1 flex flex-col">
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