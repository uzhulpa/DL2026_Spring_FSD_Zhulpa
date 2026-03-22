import geocodingService from "../services/geocodingService.js";
import weatherService from "../services/weatherService.js";
import ipLocationService from "../services/ipLocationService.js";
import memeService from "../services/memeService.js";

class WeatherController {
  /**
   * Получить погоду и мем по запросу пользователя
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getWeather(req, res) {
    try {
      const { city, lat, lon, ip } = req.query;
      
      let coordinates = null;
      let locationMethod = '';
      
      if (city) {
        locationMethod = `city: ${city}`;
        coordinates = await geocodingService.getCoordinatesByCity(city);
        
        if (!coordinates) {
          return res.status(404).json({
            error: 'Город не найден',
            message: `Город "${city}" не найден. Проверьте правильность написания.`
          });
        }
        
      } else if (lat && lon) {
        locationMethod = `coordinates: ${lat}, ${lon}`;
        coordinates = {
          lat: parseFloat(lat),
          lon: parseFloat(lon)
        };
        
        if (isNaN(coordinates.lat) || isNaN(coordinates.lon)) {
          return res.status(400).json({
            error: 'Неверные координаты',
            message: 'Широта и долгота должны быть числами'
          });
        }
        
      } else if (ip) {
        locationMethod = `ip: ${ip}`;
        const locationInfo = await ipLocationService.getFullLocationInfo(ip);
        
        coordinates = {
          lat: locationInfo.lat,
          lon: locationInfo.lon
        };
        
      } else {
        locationMethod = `client ip: ${req.ip || req.connection.remoteAddress}`;
        const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
        const locationInfo = await ipLocationService.getFullLocationInfo(clientIp);
        
        coordinates = {
          lat: locationInfo.lat,
          lon: locationInfo.lon
        };
      }
      
      if (!coordinates || !coordinates.lat || !coordinates.lon) {
        return res.status(404).json({
          error: 'Не удалось определить местоположение',
          message: 'Не удалось получить координаты для указанного местоположения'
        });
      }
      
      let weatherData;
      try {
        weatherData = await weatherService.getWeatherByCoords(coordinates.lat, coordinates.lon);
      } catch (weatherError) {
        console.error('Ошибка при получении погоды:', weatherError.message);
        return res.status(502).json({
          error: 'Ошибка погодного сервиса',
          message: 'Не удалось получить данные о погоде. Попробуйте позже.'
        });
      }
      
      let memeData;
      try {
        memeData = await memeService.getMemeByWeatherCode(weatherData.weather_code);
      } catch (memeError) {
        console.error('Ошибка при получении мема:', memeError.message);
        memeData = memeService.getDefaultMeme();
      }
      
      res.json({
        success: true,
        location: {
          method: locationMethod,
          city: weatherData.city_name,
          country: weatherData.country,
          coordinates: {
            lat: coordinates.lat,
            lon: coordinates.lon
          }
        },
        weather: weatherData,
        meme: memeData
      });
      
    } catch (error) {
      console.error('Ошибка в WeatherController.getWeather:', error.message);
      
      if (error.message.includes('не найден') || error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Не найдено',
          message: error.message
        });
      }
      
      if (error.message.includes('API') || error.message.includes('ключ')) {
        return res.status(502).json({
          error: 'Ошибка внешнего сервиса',
          message: 'Проблема с подключением к сервису погоды. Попробуйте позже.'
        });
      }
      
      if (error.message.includes('координат') || error.message.includes('геокодирование')) {
        return res.status(400).json({
          error: 'Ошибка геокодирования',
          message: error.message
        });
      }
      
      res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: 'Произошла ошибка при обработке запроса. Попробуйте позже.'
      });
    }
  }

  /**
   * Получить погоду по городу (упрощенный метод)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getWeatherByCity(req, res) {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({
        error: 'Город не указан',
        message: 'Пожалуйста, укажите название города'
      });
    }
    
    req.query.city = city;
    return this.getWeather(req, res);
  }

  /**
   * Получить погоду по координатам (упрощенный метод)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getWeatherByCoords(req, res) {
    const { lat, lon } = req.params;
    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Координаты не указаны',
        message: 'Пожалуйста, укажите широту и долготу'
      });
    }
    
    req.query.lat = lat;
    req.query.lon = lon;
    return this.getWeather(req, res);
  }
}

const weatherController = new WeatherController();

export default weatherController;