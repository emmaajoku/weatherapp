import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Thermostat,
  WaterDrop,
  Speed,
  Air,
  LocationOn,
} from '@mui/icons-material';
import { WeatherData } from '../services/weatherService';

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <LocationOn color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="div">
            {weather.city}, {weather.country}
          </Typography>
        </Box>

        <Typography variant="h4" component="div" gutterBottom>
          {weather.description}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center">
              <Thermostat color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Temperature
                </Typography>
                <Typography variant="h6">
                  {weather.temperature}°C
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center">
              <WaterDrop color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Humidity
                </Typography>
                <Typography variant="h6">
                  {weather.humidity}%
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center">
              <Speed color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pressure
                </Typography>
                <Typography variant="h6">
                  {weather.pressure} hPa
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center">
              <Air color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Wind Speed
                </Typography>
                <Typography variant="h6">
                  {weather.wind_speed} m/s
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 