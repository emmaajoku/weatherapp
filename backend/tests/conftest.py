import os
import sys
from pathlib import Path
import pytest
from unittest.mock import patch, MagicMock

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

# Create a mock settings object
mock_settings = MagicMock()
mock_settings.OPENWEATHER_API_KEY = "cc6f8331531a5b954110bd7fb00bfc70"
mock_settings.WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5"
mock_settings.WEATHER_API_TIMEOUT = 10
mock_settings.WEATHER_API_MAX_RETRIES = 3

# Mock the settings module before importing any app modules
with patch('app.core.config.Settings') as mock_settings_class:
    mock_settings_class.return_value = mock_settings
    from app.core.config import settings
    from app.services.weather_service import WeatherService
    from app.models.weather import WeatherData, WeatherError

@pytest.fixture(autouse=True)
def mock_settings_fixture():
    """Mock settings for all tests"""
    with patch('app.core.config.settings', mock_settings):
        yield mock_settings

@pytest.fixture
def weather_service():
    return WeatherService() 