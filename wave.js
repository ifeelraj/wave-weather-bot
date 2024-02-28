const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('YOUR_BOT_TOKEN');
const OPEN_WEATHER_MAP_API_KEY = 'YOUR_WEATHER_API_KEY';


bot.start((ctx) => ctx.reply('Welcome to wave !! Please enter a city name, area name, or pin code to get the real time weather forecast.'));


bot.on('text', async (ctx) => {
    const location = ctx.message.text;
    const weatherData = await getWeatherData(location);
    if (weatherData) {
        const message = formatWeatherMessage(weatherData);
        ctx.reply(message);
    } else {
        ctx.reply('Sorry, I could not find weather information for that location.');
    }
});


async function getWeatherData(location) {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}


function formatWeatherMessage(weatherData) {
  const cityName = weatherData.name;
  const temperature = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const feelsLike = weatherData.main.feels_like;
  const description = weatherData.weather[0].description;
  const windSpeed = weatherData.wind.speed;
  const airQuality = weatherData.main.aqi; // Assuming AQI is provided by OpenWeatherMap API
  const visibility = weatherData.visibility;
  const rain = (weatherData.rain && weatherData.rain['1h']) ? weatherData.rain['1h'] : 0; // Rain in the last 1 hour (if available)
  const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
  const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});


  let message = `Weather forecast for ${cityName}:\n`;
  message += `🌡️ Temperature: ${temperature}°C\n`;
  message += `💧 Humidity: ${humidity}%\n`;
  message += `🌬️ Wind Speed: ${windSpeed} m/s\n`;
  message += `🌦️ Description: ${description}\n`;
  message += `👉 Feels like: ${feelsLike}°C\n`;
  message += `🌫️ Visibility: ${visibility} meters\n`;
  message += `🌧️ Rain (last 1h): ${rain} mm\n`;
  message += `🌅 Sunrise: ${sunriseTime}\n`;
  message += `🌇 Sunset: ${sunsetTime}\n`;
  if (airQuality) {
      message += `🌬️ Air Quality: ${airQuality}\n`;
  }

  return message;
}

bot.launch();
