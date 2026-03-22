import WeatherCategory from "./WeatherCategory.js";
import Meme from "./Meme.js";

Meme.belongsTo(WeatherCategory, { foreignKey: 'weather_category_code', targetKey: 'weather_code' });
WeatherCategory.hasMany(Meme, { foreignKey: 'weather_category_code', sourceKey: 'weather_code' });

export {
    WeatherCategory,
    Meme
}