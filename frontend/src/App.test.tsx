import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { getWeather } from './services/weatherService';
import { render } from './utils/test-utils';

// Mock the weather service
jest.mock('./services/weatherService');

describe('App', () => {
  const mockWeatherData = {
    temperature: 20.5,
    humidity: 65,
    pressure: 1015,
    description: 'clear sky',
    wind_speed: 5.2,
    city: 'London',
    country: 'GB'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Weather App')).toBeInTheDocument();
  });

  it('renders the search form', () => {
    render(<App />);
    expect(screen.getByLabelText('Enter city name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('disables search button when input is empty', () => {
    render(<App />);
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeDisabled();
  });

  it('enables search button when input has text', () => {
    render(<App />);
    const input = screen.getByLabelText('Enter city name');
    const searchButton = screen.getByRole('button', { name: /search/i });

    userEvent.type(input, 'London');
    expect(searchButton).toBeEnabled();
  });

  it('shows loading state while fetching weather data', async () => {
    (getWeather as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<App />);

    const input = screen.getByLabelText('Enter city name');
    const searchButton = screen.getByRole('button', { name: /search/i });

    userEvent.type(input, 'London');
    fireEvent.click(searchButton);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays weather data when fetch is successful', async () => {
    (getWeather as jest.Mock).mockResolvedValue(mockWeatherData);
    render(<App />);

    const input = screen.getByLabelText('Enter city name');
    const searchButton = screen.getByRole('button', { name: /search/i });

    userEvent.type(input, 'London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('London, GB')).toBeInTheDocument();
      expect(screen.getByText('clear sky')).toBeInTheDocument();
      expect(screen.getByText('20.5°C')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    const errorMessage = 'City not found';
    (getWeather as jest.Mock).mockRejectedValue({ message: errorMessage });
    render(<App />);

    const input = screen.getByLabelText('Enter city name');
    const searchButton = screen.getByRole('button', { name: /search/i });

    userEvent.type(input, 'NonExistentCity');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears previous weather data when starting a new search', async () => {
    (getWeather as jest.Mock).mockResolvedValue(mockWeatherData);
    render(<App />);

    const input = screen.getByLabelText('Enter city name');
    const searchButton = screen.getByRole('button', { name: /search/i });

    // First search
    userEvent.type(input, 'London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('London, GB')).toBeInTheDocument();
    });

    // Clear input and start new search
    userEvent.clear(input);
    userEvent.type(input, 'Paris');
    fireEvent.click(searchButton);

    // Previous weather data should be cleared
    expect(screen.queryByText('London, GB')).not.toBeInTheDocument();
  });
}); 