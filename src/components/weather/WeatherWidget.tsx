import React from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplet } from 'lucide-react';

export default function WeatherWidget() {
  const weatherData = {
    current: {
      temp: '24°C',
      condition: 'Partly Cloudy',
      humidity: '65%',
      wind: '12 km/h'
    },
    forecast: [
      { day: 'Today', temp: '24°C', condition: 'partly-cloudy' },
      { day: 'Mon', temp: '26°C', condition: 'sunny' },
      { day: 'Tue', temp: '23°C', condition: 'rainy' },
      { day: 'Wed', temp: '22°C', condition: 'cloudy' },
      { day: 'Thu', temp: '25°C', condition: 'sunny' }
    ]
  };

  const getWeatherIcon = (condition: string) => {
    switch(condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-amber-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'partly-cloudy': return <Cloud className="h-8 w-8 text-blue-300" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Sun className="h-8 w-8 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Forecast</h3>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-3xl font-bold">{weatherData.current.temp}</div>
          <div className="text-gray-600">{weatherData.current.condition}</div>
        </div>
        {getWeatherIcon('partly-cloudy')}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {weatherData.forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-sm text-gray-600">{day.day}</span>
            {getWeatherIcon(day.condition)}
            <span className="text-sm font-medium">{day.temp}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Wind className="h-4 w-4 mr-1" />
          <span>{weatherData.current.wind}</span>
        </div>
        <div className="flex items-center">
          <Droplet className="h-4 w-4 mr-1" />
          <span>{weatherData.current.humidity}</span>
        </div>
      </div>
    </div>
  );
}