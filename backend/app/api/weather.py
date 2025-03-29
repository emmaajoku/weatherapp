from fastapi import APIRouter, HTTPException
from ..services.weather_service import WeatherService
from ..models.weather import WeatherData, WeatherError

router = APIRouter()
weather_service = WeatherService()

@router.get("/weather/{city}", response_model=WeatherData)
async def get_weather(city: str):
    """
    Get current weather data for a specified city
    """
    try:
        return await weather_service.get_weather(city)
    except WeatherError as e:
        if e.code == "CITY_NOT_FOUND":
            raise HTTPException(status_code=404, detail=e.message)
        raise HTTPException(status_code=500, detail=e.message) 