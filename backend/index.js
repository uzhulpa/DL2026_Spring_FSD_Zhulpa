import { config } from 'dotenv';
import express from 'express';
import sequelize from "./config/database.js";

config();

const PORT = process.env.PORT;

const app = express();

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
};

start();