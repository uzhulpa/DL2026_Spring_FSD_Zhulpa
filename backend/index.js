import { config } from 'dotenv';
import express from 'express';
import sequelize from "./config/database.js";
import router from './routes/weather.js';

config();

const PORT = process.env.PORT;

const app = express();

app.use('/weather', router);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, async () => {
            console.log(`SERVER STARTED ON PORT ${PORT}`);
        });
    }
    catch (e) {
        console.log(e);
    }
};

start();