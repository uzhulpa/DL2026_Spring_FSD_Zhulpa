import axios from "axios";
import { config } from 'dotenv';
import geocodingService from "./geocodingService.js";

config();

class WeatherService {
    constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.units = 'metric'; // Для получения температуры в Цельсиях
  }

  /**
   * Конвертирует время из UNIX timestamp в читаемый формат
   * @param {number} timestamp - UNIX timestamp
   * @returns {string} - Время в формате HH:MM:SS
   */
  formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Получить погоду по координатам
   * @param {number} lat - Широта
   * @param {number} lon - Долгота
   * @returns {Promise<Object>} - Объект с данными о погоде
   */
  async getWeatherByCoords(lat, lon) {
    try {
      // Проверка валидности координат
      if (lat === undefined || lon === undefined) {
        throw new Error('Координаты не могут быть пустыми');
      }

      const response = await axios.get(this.baseUrl, {
        params: {
          lat: lat,
          lon: lon,
          appid: this.apiKey,
          units: this.units
        }
      });

      const data = response.data;

      // Формируем объект с нужными полями
      return {
        temp_celsius: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        visibility: data.visibility,
        wind_speed: data.wind.speed,
        wind_direction: data.wind.deg || null,
        clouds: data.clouds.all,
        weather_code: data.weather[0].id,
        weather_main: data.weather[0].main,
        weather_description: data.weather[0].description,
        weather_icon: data.weather[0].icon,
        sunrise: this.formatTime(data.sys.sunrise),
        sunset: this.formatTime(data.sys.sunset),
        sunrise_timestamp: data.sys.sunrise,
        sunset_timestamp: data.sys.sunset,
        city_name: data.name,
        country: data.sys.country
      };
    } catch (error) {
      console.error('Ошибка при получении погоды:', error.message);
      
      // Обработка ошибки от API OpenWeatherMap
      if (error.response) {
        console.error('Статус ошибки:', error.response.status);
        console.error('Данные ошибки:', error.response.data);
        
        if (error.response.status === 404) {
          throw new Error('Город не найден');
        } else if (error.response.status === 401) {
          throw new Error('Неверный API ключ');
        }
      }
      
      throw new Error(`Не удалось получить данные о погоде: ${error.message}`);
    }
  }

  /**
   * Получить погоду по названию города
   * @param {string} city - Название города
   * @returns {Promise<Object>} - Объект с данными о погоде
   */
  async getWeatherByCity(city) {
    try {
      if (!city || city.trim() === '') {
        throw new Error('Название города не может быть пустым');
      }

      // Получаем координаты через geocodingService
      const coords = await geocodingService.getCoordinatesByCity(city);
      
      if (!coords) {
        throw new Error(`Город "${city}" не найден`);
      }

      // Получаем погоду по координатам
      const weatherData = await this.getWeatherByCoords(coords.lat, coords.lon);
      
      // Добавляем название города, которое было введено пользователем
      // (на случай, если API вернул другое название)
      weatherData.requested_city = city;
      
      return weatherData;
    } catch (error) {
      console.error('Ошибка при получении погоды по городу:', error.message);
      throw error;
    }
  }
}

const weatherService = new WeatherService();

export default weatherService;