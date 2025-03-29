import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { WeatherCard } from './components/WeatherCard';
import { getWeather, WeatherData, WeatherError } from './services/weatherService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch (err) {
      const weatherError = err as WeatherError;
      setError(weatherError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Weather App
          </Typography>

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              gap: 2,
              mb: 4,
            }}
          >
            <TextField
              fullWidth
              label="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !city.trim()}
            >
              Search
            </Button>
          </Box>

          <WeatherCard
            weather={weather}
            loading={loading}
            error={error}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 