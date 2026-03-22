import axios from "axios";
import { config } from 'dotenv';

config();

class IpLocationService {
    constructor() {
    this.baseUrl = 'http://ip-api.com/json';
    this.defaultCity = 'Minsk'; // Город по умолчанию для localhost
    this.defaultLat = 55.7558;
    this.defaultLon = 37.6176;
  }
  
  /**
   * Проверяет, является ли IP локальным
   * @param {string} ip - IP адрес
   * @returns {boolean} - true если IP локальный
   */
  isLocalIp(ip) {
    return !ip || ip === '::1' || ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
  }

  /**
   * Получить данные о местоположении по IP
   * @param {string} ip - IP адрес
   * @returns {Promise<Object>} - Объект с данными о местоположении
   */
  async getLocationByIp(ip) {
    try {
      // Если IP локальный, возвращаем тестовые данные
      if (this.isLocalIp(ip)) {
        console.log('Обнаружен локальный IP, использую тестовые данные');
        return {
          city: this.defaultCity,
          lat: this.defaultLat,
          lon: this.defaultLon,
          country: 'RU',
          status: 'success',
          isLocal: true
        };
      }

      const response = await axios.get(`${this.baseUrl}/${ip}`, {
        params: {
          fields: 'status,country,city,lat,lon,message'
        },
        timeout: 5000 // Таймаут 5 секунд
      });

      const data = response.data;

      // Проверяем успешность запроса
      if (data.status === 'success') {
        return {
          city: data.city,
          lat: data.lat,
          lon: data.lon,
          country: data.country,
          status: 'success',
          isLocal: false
        };
      } else {
        // Если запрос не успешен, возвращаем данные по умолчанию
        console.warn(`IP API вернул ошибку: ${data.message || 'Unknown error'}`);
        return this.getDefaultLocation();
      }
    } catch (error) {
      console.error('Ошибка при определении местоположения по IP:', error.message);
      // В случае ошибки возвращаем данные по умолчанию
      return this.getDefaultLocation();
    }
  }

  /**
   * Получить город по IP адресу
   * @param {string} ip - IP адрес
   * @returns {Promise<string>} - Название города
   */
  async getCityByIp(ip) {
    const location = await this.getLocationByIp(ip);
    return location.city;
  }

  /**
   * Получить координаты по IP адресу
   * @param {string} ip - IP адрес
   * @returns {Promise<{lat: number, lon: number}>} - Координаты города
   */
  async getCoordsByIp(ip) {
    const location = await this.getLocationByIp(ip);
    return {
      lat: location.lat,
      lon: location.lon
    };
  }

  /**
   * Получить данные по умолчанию (на случай ошибки)
   * @returns {Object} - Данные по умолчанию
   */
  getDefaultLocation() {
    return {
      city: this.defaultCity,
      lat: this.defaultLat,
      lon: this.defaultLon,
      country: 'RU',
      status: 'fallback',
      isLocal: false
    };
  }

  /**
   * Получить полную информацию о местоположении по IP
   * @param {string} ip - IP адрес
   * @returns {Promise<Object>} - Полная информация о местоположении
   */
  async getFullLocationInfo(ip) {
    return await this.getLocationByIp(ip);
  }
}

const ipLocationService = new IpLocationService();

export default ipLocationService;