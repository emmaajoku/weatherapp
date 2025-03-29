from pydantic import BaseModel, Field
from typing import Optional

class WeatherData(BaseModel):
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: int = Field(..., description="Humidity percentage")
    pressure: int = Field(..., description="Pressure in hPa")
    description: str = Field(..., description="Weather description")
    wind_speed: float = Field(..., description="Wind speed in m/s")
    city: str = Field(..., description="City name")
    country: str = Field(..., description="Country code")

class WeatherError(Exception):
    def __init__(self, message: str, code: Optional[str] = None):
        self.message = message
        self.code = code
        super().__init__(message) 