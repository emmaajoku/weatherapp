import httpx
import logging
from typing import Optional
from ..core.config import settings
from ..models.weather import WeatherData, WeatherError

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        # Remove /weather from base_url if it exists
        self.base_url = settings.WEATHER_API_BASE_URL.replace('/weather', '')
        self.timeout = settings.WEATHER_API_TIMEOUT
        self.max_retries = settings.WEATHER_API_MAX_RETRIES
        
        # Log configuration (without exposing the actual API key)
        logger.info(f"Initialized WeatherService with base_url: {self.base_url}")
        logger.info(f"API Key present: {'Yes' if self.api_key else 'No'}")

    async def get_weather(self, city: str) -> WeatherData:
        """
        Fetch weather data for a given city from OpenWeather API
        """
        if not city or not city.strip():
            raise WeatherError("City name cannot be empty", "CITY_NOT_FOUND")

        if not self.api_key:
            raise WeatherError("OpenWeather API key is not configured", "API_KEY_MISSING")

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(self.max_retries):
                try:
                    url = f"{self.base_url}/weather"
                    params = {
                        "q": city,
                        "appid": self.api_key,
                        "units": "metric"  # Use metric units for temperature
                    }
                    logger.info(f"Making request to {url} for city: {city}")
                    
                    response = await client.get(url, params=params)
                    response.raise_for_status()  # This will raise HTTPStatusError for non-200 status codes
                    
                    data = response.json()
                    return WeatherData(
                        temperature=data["main"]["temp"],
                        humidity=data["main"]["humidity"],
                        pressure=data["main"]["pressure"],
                        description=data["weather"][0]["description"],
                        wind_speed=data["wind"]["speed"],
                        city=data["name"],
                        country=data["sys"]["country"]
                    )

                except httpx.HTTPStatusError as e:
                    if e.response.status_code == 404:
                        raise WeatherError(
                            message=f"City '{city}' not found",
                            code="CITY_NOT_FOUND"
                        )
                    elif e.response.status_code == 401:
                        raise WeatherError(
                            message="Invalid API key",
                            code="API_KEY_INVALID"
                        )
                    elif e.response.status_code == 500:
                        if attempt == self.max_retries - 1:
                            raise WeatherError(
                                message="Failed to fetch weather data",
                                code="API_ERROR"
                            )
                        continue
                    else:
                        if attempt == self.max_retries - 1:
                            raise WeatherError(
                                message=f"Unexpected status code: {e.response.status_code}",
                                code="API_ERROR"
                            )
                        continue
                except httpx.RequestError as e:
                    if attempt == self.max_retries - 1:
                        raise WeatherError(
                            message=str(e),
                            code="INTERNAL_ERROR"
                        )
                    continue
                except Exception as e:
                    if attempt == self.max_retries - 1:
                        raise WeatherError(
                            message=str(e),
                            code="INTERNAL_ERROR"
                        )
                    continue 