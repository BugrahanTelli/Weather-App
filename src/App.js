import React, { useState, useEffect } from 'react';
import './App.css';
import humidityImage from './weatherimages/humidity.png';
import windImage from './weatherimages/wind.png';
import sunnyImage from './weatherimages/clear.png';
import cloudImage from './weatherimages/cloud.png';
import drizzleImage from './weatherimages/drizzle.png';
import rainImage from './weatherimages/rain.png';
import snowImage from './weatherimages/snow.png';
import sunny from './weatherimages/sunny.jpg';
import snowy from './weatherimages/snowy.jpg';
import cloudy from './weatherimages/cloudy.jpg';
import rainy from './weatherimages/rainy.jpg';
import drizzle from './weatherimages/drizzley.jpg';
import { FaSearch } from 'react-icons/fa';

function App() {
  const api_key = "a2c6207adbcba1feeaf9008372382296";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

  const [locationData, setLocationData] = useState({});
  const [weatherData, setWeatherData] = useState({});

  const searchByLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${api_key}`);
      const data = await response.json();
      

      setLocationData({
        city: data.name.replace(/Province/i, '').trim(),
        country: data.sys.country
      });
      setWeatherData({
        temp: Math.round(data.main.temp - 273.15),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: data.weather[0].icon
      });
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  
  const search = async () => {
    const locationInput = document.getElementById('locationInput');

    if (!locationInput.value) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}?q=${locationInput.value}&appid=${api_key}`);
      const data = await response.json();

      setLocationData({
        city: data.name.replace(/Province/i, '').trim(),
        country: data.sys.country
      });
      setWeatherData({
        temp: Math.round(data.main.temp - 273.15),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: data.weather[0].icon
      });

      locationInput.value = '';

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getBackgroundImage = (iconCode) => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return sunny;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return cloudy;
      case '09d':
      case '09n':
        return drizzle;
      case '10d':
      case '10n':
      case '11d':
      case '11n':
        return rainy;
      case '13d':
      case '13n':
        return snowy;
      default:
        return sunny;
    }
  };

  const getWeatherImage = (iconCode) => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return sunnyImage;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return cloudImage;
      case '09d':
      case '09n':
        return drizzleImage;
      case '10d':
      case '10n':
      case '11d':
      case '11n':
        return rainImage;
      case '13d':
      case '13n':
        return snowImage;
      default:
        return cloudImage;
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          searchByLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
    }
  }, []);

  return (
    <div className="App" style={{
      backgroundImage: `url(${getBackgroundImage(weatherData.icon)})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="Container">
        <h1>Weather App</h1>
        <form className='Place' onSubmit={(e) => { e.preventDefault(); search(); }}>
          <input type='text' id='locationInput' placeholder='Enter a location' />
          <button type='submit'><FaSearch /></button>
        </form>

        <div className='Weather'>
          <img className='weatherImage' src={getWeatherImage(weatherData.icon)} alt='weather' />
          <p>{weatherData.temp} °C</p>
          <h1>{locationData.city}, {locationData.country}</h1>
        </div>
        <div className='Details'>
          <div className='Humidity'>
            <img src={humidityImage} alt='humidity' />
            <p>{weatherData.humidity}%</p>
            <p>Humidity</p>
          </div>
          <div className='Wind'>
            <img src={windImage} alt='wind' />
            <p>{weatherData.wind} km/h</p>
            <p>Wind</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
