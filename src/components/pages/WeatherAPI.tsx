
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
  
  interface FetchWeatherParams {
    latitude: string;
    longitude: string;
    startDate: string;
    endDate: string;
  }
  
  interface CacheItem {
    data: WeatherData;
    timestamp: number;
  }
  
  //handling perfomance of api
  export class WeatherApiService {
    private static BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';
    private static CACHE_EXPIRY = 30 * 60 * 1000; 
    private static THROTTLE_INTERVAL = 1000; 
    private static lastRequestTime = 0;
    private static pendingRequests: Map<string, Promise<WeatherData>> = new Map();
  
    private static generateCacheKey(params: FetchWeatherParams): string {
      return `weather_${params.latitude}_${params.longitude}_${params.startDate}_${params.endDate}`;
    }
  
    private static getCachedData(key: string): WeatherData | null {
      try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
  
        const { data, timestamp }: CacheItem = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > this.CACHE_EXPIRY;
  
        if (isExpired) {
          localStorage.removeItem(key);
          return null;
        }
  
        return data;
      } catch {
        return null;
      }
    }
  
    private static setCachedData(key: string, data: WeatherData): void {
      try {
        const cacheItem: CacheItem = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cacheItem));
      } catch {
     
      }
    }
  
    private static async throttleRequest(): Promise<void> {
      const now = Date.now();
      const timeElapsed = now - this.lastRequestTime;
  
      if (timeElapsed < this.THROTTLE_INTERVAL) {
        await new Promise(resolve => 
          setTimeout(resolve, this.THROTTLE_INTERVAL - timeElapsed)
        );
      }
      this.lastRequestTime = Date.now();
    }
  
    private static validateWeatherData(data: unknown): data is WeatherData {
    
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid data format received");
      }
  
      if (!('daily' in data) || typeof (data as WeatherData).daily !== 'object') {
        throw new Error("Missing daily weather data");
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
  
      const dailyData = (data as WeatherData).daily;
      
      interface DailyDataFields {
        [key: string]: unknown[];
      }
      
      for (const field of requiredFields) {
        if (!Array.isArray((dailyData as DailyDataFields)[field])) {
          throw new Error(`Missing or invalid ${field} data`);
        }
      }
  
      const timeLength = dailyData.time.length;
      const allFieldsMatch = requiredFields.every(field => 
        (dailyData as DailyDataFields)[field].length === timeLength
      );
  
      if (!allFieldsMatch) {
        throw new Error("Inconsistent data received");
      }
  
      return true;
    }
  
    public static async fetchWeatherData(params: FetchWeatherParams): Promise<WeatherData> {
      const cacheKey = this.generateCacheKey(params);
  
      // Check cache 
      const cachedData = this.getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
  
      // Check for pending request 
      const pendingRequest = this.pendingRequests.get(cacheKey);
      if (pendingRequest) {
        return pendingRequest;
      }
  
      // Create new request
      const request = (async () => {
        try {
          await this.throttleRequest();
  
          const url = `${this.BASE_URL}?latitude=${params.latitude}&longitude=${params.longitude}&start_date=${params.startDate}&end_date=${params.endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,apparent_temperature_mean`;
          
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.reason || 'API returned an error');
          }
  
          if (!this.validateWeatherData(data)) {
            throw new Error('Invalid data structure received');
          }
  
        
          this.setCachedData(cacheKey, data);
          return data;
        } finally {
     
          this.pendingRequests.delete(cacheKey);
        }
      })();
  
  
      this.pendingRequests.set(cacheKey, request);
      return request;
    }
  }