import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const WeatherCategory = sequelize.define('WeatherCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  weather_code: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    unique: true,
    field: 'weather_code',
    validate: {
      isInt: true
    }
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'description'
  },
  icon_day: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'icon_day'
  },
  icon_night: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'icon_night'
  }
}, {
  tableName: 'weather_categories',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['weather_code']
    }
  ]
});

export default WeatherCategory;