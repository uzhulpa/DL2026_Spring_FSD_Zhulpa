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
      let locationMethod = ''; // Для логирования
      
      // 1. Определяем координаты на основе входных параметров
      if (city) {
        // Получаем координаты по названию города
        locationMethod = `city: ${city}`;
        coordinates = await geocodingService.getCoordinatesByCity(city);
        
        if (!coordinates) {
          return res.status(404).json({
            error: 'Город не найден',
            message: `Город "${city}" не найден. Проверьте правильность написания.`
          });
        }
        
      } else if (lat && lon) {
        // Используем переданные координаты
        locationMethod = `coordinates: ${lat}, ${lon}`;
        coordinates = {
          lat: parseFloat(lat),
          lon: parseFloat(lon)
        };
        
        // Проверяем валидность координат
        if (isNaN(coordinates.lat) || isNaN(coordinates.lon)) {
          return res.status(400).json({
            error: 'Неверные координаты',
            message: 'Широта и долгота должны быть числами'
          });
        }
        
      } else if (ip) {
        // Определяем местоположение по IP
        locationMethod = `ip: ${ip}`;
        const locationInfo = await ipLocationService.getFullLocationInfo(ip);
        
        coordinates = {
          lat: locationInfo.lat,
          lon: locationInfo.lon
        };
        
      } else {
        // Если ничего не передано, пробуем определить по IP клиента
        locationMethod = `client ip: ${req.ip || req.connection.remoteAddress}`;
        const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
        const locationInfo = await ipLocationService.getFullLocationInfo(clientIp);
        
        coordinates = {
          lat: locationInfo.lat,
          lon: locationInfo.lon
        };
      }
      
      // Проверяем, что координаты получены
      if (!coordinates || !coordinates.lat || !coordinates.lon) {
        return res.status(404).json({
          error: 'Не удалось определить местоположение',
          message: 'Не удалось получить координаты для указанного местоположения'
        });
      }
      
      // 2. Получаем погоду по координатам
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
      
      // 3. Получаем мем по коду погоды
      let memeData;
      try {
        memeData = await memeService.getMemeByWeatherCode(weatherData.weather_code);
      } catch (memeError) {
        console.error('Ошибка при получении мема:', memeError.message);
        // Если не удалось получить мем, используем дефолтный
        memeData = memeService.getDefaultMeme();
      }
      
      // 4. Возвращаем успешный ответ
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
      // Обработка различных типов ошибок
      console.error('Ошибка в WeatherController.getWeather:', error.message);
      
      // Определяем тип ошибки и отправляем соответствующий статус
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
      
      // Общая ошибка сервера
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
    
    // Перенаправляем на основной метод с параметром city
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
    
    // Перенаправляем на основной метод с параметрами lat, lon
    req.query.lat = lat;
    req.query.lon = lon;
    return this.getWeather(req, res);
  }
}

const weatherController = new WeatherController();

export default weatherController;