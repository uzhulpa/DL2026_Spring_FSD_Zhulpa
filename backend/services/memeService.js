import { Meme } from "../models/index.js";

class MemeService {
    constructor() {

    }

    /**
   * Получить случайный мем по коду погоды
   * @param {number} weatherCode - Код погоды из OpenWeatherMap API
   * @returns {Promise<Object>} - Объект с данными мема { image_url, text_content }
   */
  async getMemeByWeatherCode(weatherCode) {
    try {
      if (!weatherCode) {
        throw new Error('Код погоды не может быть пустым');
      }

      const meme = await Meme.getRandomByWeatherCode(weatherCode);
      
      if (!meme) {
        return this.getDefaultMeme();
      }

      return {
        image_url: meme.image_url,
        text_content: meme.text_content,
        id: meme.id
      };
    } catch (error) {
      console.error('Ошибка при получении мема:', error.message);
      return this.getDefaultMeme();
    }
  }

  /**
   * Получить дефолтный мем на случай ошибки
   * @returns {Object} - Дефолтный мем
   */
  getDefaultMeme() {
    return {
      image_url: null,
      text_content: 'Погода отличная, а настроение еще лучше! Наслаждайтесь днем! DEFAULT',
      id: null
    };
  }
}

const memeService = new MemeService();

export default memeService;