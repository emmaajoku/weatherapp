import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  description: string;
  wind_speed: number;
  city: string;
  country: string;
}

export interface WeatherError {
  message: string;
  code?: string;
}

export const getWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get<WeatherData>(`${API_BASE_URL}/weather/${city}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw {
          message: `City '${city}' not found`,
          code: 'CITY_NOT_FOUND'
        } as WeatherError;
      }
      throw {
        message: error.response?.data?.detail || 'Failed to fetch weather data',
        code: 'API_ERROR'
      } as WeatherError;
    }
    throw {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    } as WeatherError;
  }
}; 