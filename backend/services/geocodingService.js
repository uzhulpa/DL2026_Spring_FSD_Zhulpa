import axios from "axios";
import { config } from 'dotenv';

config();

class GeocodingService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'http://api.openweathermap.org/geo/1.0/direct';
    this.limit = 1; // Берем только первый результат
  }

  /**
   * Получить координаты по названию города
   * @param {string} city - Название города
   * @returns {Promise<{lat: number, lon: number} | null>} - Объект с координатами или null
   */
  async getCoordinatesByCity(city) {
    try {
      if (!city || city.trim() === '') {
        throw new Error('Название города не может быть пустым');
      }

      const response = await axios.get(this.baseUrl, {
        params: {
          q: city,
          limit: this.limit,
          appid: this.apiKey
        }
      });

      // Проверяем, есть ли результаты
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return {
          lat: location.lat,
          lon: location.lon
        };
      }

      // Город не найден
      return null;
    } catch (error) {
      console.error('Ошибка при получении координат:', error.message);
      
      // Обработка ошибки от API OpenWeatherMap
      if (error.response) {
        console.error('Статус ошибки:', error.response.status);
        console.error('Данные ошибки:', error.response.data);
      }
      
      throw new Error(`Не удалось получить координаты для города "${city}"`);
    }
  }
}

const geocodingService = new GeocodingService();

export default geocodingService;