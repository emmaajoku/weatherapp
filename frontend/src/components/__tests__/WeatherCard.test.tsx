import React from 'react';
import { screen } from '@testing-library/react';
import { WeatherCard } from '../WeatherCard';
import { WeatherData } from '../../services/weatherService';
import { render } from '../../utils/test-utils';

const mockWeatherData: WeatherData = {
  temperature: 20.5,
  humidity: 65,
  pressure: 1015,
  description: 'clear sky',
  wind_speed: 5.2,
  city: 'London',
  country: 'GB'
};

describe('WeatherCard', () => {
  it('renders loading state correctly', () => {
    render(<WeatherCard weather={null} loading={true} error={null} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'City not found';
    render(<WeatherCard weather={null} loading={false} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders weather data correctly', () => {
    render(<WeatherCard weather={mockWeatherData} loading={false} error={null} />);
    
    // Check city and country
    expect(screen.getByText('London, GB')).toBeInTheDocument();
    
    // Check weather description
    expect(screen.getByText('clear sky')).toBeInTheDocument();
    
    // Check weather details
    expect(screen.getByText('20.5°C')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('1015 hPa')).toBeInTheDocument();
    expect(screen.getByText('5.2 m/s')).toBeInTheDocument();
  });

  it('renders nothing when no weather data and not loading', () => {
    const { container } = render(<WeatherCard weather={null} loading={false} error={null} />);
    expect(container).toBeEmptyDOMElement();
  });
}); 