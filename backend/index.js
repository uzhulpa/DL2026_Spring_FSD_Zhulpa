import { config } from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from "./config/database.js";
import router from './routes/weather.js';

import {fillWeatherCategories, fillMemes } from './scripts/seedDatabase.js';

config();

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '../frontend')));

app.use('/api/weather', router);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер работает',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'Запрашиваемый ресурс не найден' 
  });
});

app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: 'Произошла внутренняя ошибка сервера' 
  });
});

const start = async () => {
    try {
        await sequelize.authenticate();

        await sequelize.sync({ alter: false });

        app.listen(PORT, async () => {
        });
    }
    catch (e) {
        console.log(e);
    }
};

// начальное заполнение бд
fillWeatherCategories();
fillMemes();

start();