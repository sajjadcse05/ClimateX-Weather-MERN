import React, { useMemo } from 'react';
import { WeatherData } from '@/types/weather';
import DayDuration from '@/components/views/day-duration';
import AirPollutionChart from '@/components/views/air-pollution';
import TemperatureHumidityChart from '@/components/views/temp-humidity';
import ClientMap from '@/components/views/client-map';
import CurrentWeatherCard from '@/components/views/current-weather';
import WindPressureCard from '@/components/views/wind-pressure';
import HourlyForecast from '@/components/views/hourly-forecast';

interface WeatherDashboardProps {
  weatherData: WeatherData;
  unit: 'metric' | 'imperial';
}

// Dashboard is a React component that aggregates and displays weather data in various cards and charts.
// Updated to move Temperature/Humidity forecast to the middle and Wind/Pressure + Hourly Forecast to the right.
const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ weatherData, unit }) => {
  const { currentWeather, forecast, airPollution } = weatherData;

  // Memoize hourly forecast data for the first 5 items
  const hourlyForecastData = useMemo(
    () =>
      forecast.list.slice(0, 5).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        temperature: Math.round(item.main.temp),
        weather: item.weather[0].main,
      })),
    [forecast.list],
  );

  return (
    <div className="w-full min-h-screen bg-inherit flex flex-col items-center">
      {/* 3-Column main grid layout for medium/large viewports */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6 lg:p-8">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-6">
          <CurrentWeatherCard
            currentWeather={currentWeather}
            forecast={forecast}
            unit={unit}
          />
          <DayDuration data={currentWeather} />
        </div>

        {/* ================= MIDDLE COLUMN ================= */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-6">
          <div className="flex-1 min-h-[300px] flex flex-col">
            <TemperatureHumidityChart data={forecast} unit={unit} />
          </div>
          <AirPollutionChart data={airPollution} />
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-rows-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-6">
          <WindPressureCard currentWeather={currentWeather} unit={unit} />
          <HourlyForecast forecast={hourlyForecastData} unit={unit} />
        </div>

        {/* ================= BOTTOM MAP SECTION ================= */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl overflow-hidden border border-neutral-800/40 shadow-xl h-[400px] mt-2">
          <ClientMap
            center={[currentWeather.coord.lat, currentWeather.coord.lon]}
            zoom={10}
            markerPosition={[currentWeather.coord.lat, currentWeather.coord.lon]}
            popupContent={`${currentWeather.name}, ${currentWeather.sys.country}`}
          />
        </div>

      </div>
    </div>
  );
};

export default WeatherDashboard;