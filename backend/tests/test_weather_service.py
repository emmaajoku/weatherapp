import pytest
from unittest.mock import patch, AsyncMock
from app.services.weather_service import WeatherService
from app.models.weather import WeatherData, WeatherError

@pytest.fixture
def weather_service():
    return WeatherService()

@pytest.fixture
def mock_weather_response():
    return {
        "main": {
            "temp": 20.5,
            "humidity": 65,
            "pressure": 1015
        },
        "weather": [{"description": "clear sky"}],
        "wind": {"speed": 5.2},
        "name": "London",
        "sys": {"country": "GB"}
    }

@pytest.mark.asyncio
async def test_get_weather_success(weather_service, mock_weather_response):
    with patch('httpx.AsyncClient.get') as mock_get:
        mock_get.return_value = AsyncMock(
            status_code=200,
            json=lambda: mock_weather_response
        )
        
        result = await weather_service.get_weather("London")
        
        assert isinstance(result, WeatherData)
        assert result.temperature == 20.5
        assert result.humidity == 65
        assert result.pressure == 1015
        assert result.description == "clear sky"
        assert result.wind_speed == 5.2
        assert result.city == "London"
        assert result.country == "GB"

@pytest.mark.asyncio
async def test_get_weather_city_not_found(weather_service):
    with patch('httpx.AsyncClient.get') as mock_get:
        mock_get.return_value = AsyncMock(
            status_code=404,
            json=lambda: {"message": "City not found"}
        )
        
        with pytest.raises(WeatherError) as exc_info:
            await weather_service.get_weather("NonExistentCity")
        
        assert exc_info.value.code == "CITY_NOT_FOUND"
        assert "City 'NonExistentCity' not found" in str(exc_info.value.message)

@pytest.mark.asyncio
async def test_get_weather_api_error(weather_service):
    with patch('httpx.AsyncClient.get') as mock_get:
        mock_get.return_value = AsyncMock(
            status_code=500,
            json=lambda: {"message": "Internal server error"}
        )
        
        with pytest.raises(WeatherError) as exc_info:
            await weather_service.get_weather("London")
        
        assert exc_info.value.code == "API_ERROR"
        assert "Failed to fetch weather data" in str(exc_info.value.message) 