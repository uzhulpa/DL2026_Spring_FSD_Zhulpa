import { config } from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from "./config/database.js";
import router from './routes/weather.js';

config();

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json()); // Для парсинга JSON тела запроса
app.use(express.urlencoded({ extended: true })); // Для парсинга URL-encoded данных
app.use(express.static(join(__dirname, '../frontend'))); // Раздача статических файлов

app.use('/api/weather', router);

// Тестовый маршрут для проверки работы сервера
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер работает',
    timestamp: new Date().toISOString()
  });
});

// Обработка 404 - не найденных маршрутов
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'Запрашиваемый ресурс не найден' 
  });
});

// Обработка ошибок
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
        console.log(`Подключение к PostgreSQL установлено`);

        await sequelize.sync({ alter: false });
        console.log(`Модели синхронизированы с БД`);

        app.listen(PORT, async () => {
            console.log(`Сервер запущен на порту ${PORT}`);
            console.log(`Статика раздается из папки: ${join(__dirname, '../client')}`);
        });
    }
    catch (e) {
        console.log(e);
    }
};

start();