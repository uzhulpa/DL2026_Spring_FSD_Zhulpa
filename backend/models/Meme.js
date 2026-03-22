import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";
import WeatherCategory from "./WeatherCategory.js";

const Meme = sequelize.define('Meme', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  weather_category_code: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    references: {
      model: WeatherCategory,
      key: 'weather_code'
    }
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  text_content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'views'
  }
}, {
  tableName: 'memes',
  timestamps: false
});

Meme.getRandomByWeatherCode = async (weatherCode) => {
  const memes = await Meme.findAll({
    where: { weather_category_code: weatherCode }
  });
  
  if (memes.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * memes.length);
  return memes[randomIndex];
};

export default Meme;