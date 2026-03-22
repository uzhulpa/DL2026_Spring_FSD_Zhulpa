import sequelize from "../config/database.js";
import { WeatherCategory, Meme } from "../models/index.js";

const fillWeatherCategories = async () => {
    try {
        await sequelize.sync();
        
        const categories = [
            // Group 2xx: Thunderstorm
            { name: 'Thunderstorm', weather_code: 200, description: 'thunderstorm with light rain', icon_day: '11d', icon_night: '11d' },
            { name: 'Thunderstorm', weather_code: 201, description: 'thunderstorm with rain', icon_day: '11d', icon_night: '11d' },
            { name: 'Thunderstorm', weather_code: 202, description: 'thunderstorm with heavy rain', icon_day: '11d', icon_night: '11d' },
            { name: 'Thunderstorm', weather_code: 210, description: 'light thunderstorm', icon_day: '11d', icon_night: '11d' },
            { name: 'Thunderstorm', weather_code: 211, description: 'thunderstorm', icon_day: '11d', icon_night: '11d' },
            { name: 'Thunderstorm', weather_code: 212, description: 'heavy thunderstorm', icon_day: '11d', icon_night: '11d' },
            { name: 'Thunderstorm', weather_code: 221, description: 'ragged thunderstorm', icon_day: '11d', icon_night: '11d' },
            { name: 'Thunderstorm', weather_code: 230, description: 'thunderstorm with light drizzle', icon_day: '11d', icon_night: '11d' },
            { name: 'Thunderstorm', weather_code: 231, description: 'thunderstorm with drizzle', icon_day: '11d', icon_night: '11d' },
            { name: 'Thunderstorm', weather_code: 232, description: 'thunderstorm with heavy drizzle', icon_day: '11d', icon_night: '11d' },

            // Group 3xx: Drizzle
            { name: 'Drizzle', weather_code: 300, description: 'light intensity drizzle', icon_day: '09d', icon_night: '09d' },
            { name: 'Drizzle', weather_code: 301, description: 'drizzle', icon_day: '09d', icon_night: '09d' },
            { name: 'Drizzle', weather_code: 302, description: 'heavy intensity drizzle', icon_day: '09d', icon_night: '09d' },
            { name: 'Drizzle', weather_code: 310, description: 'light intensity drizzle rain', icon_day: '09d', icon_night: '09d' },
            { name: 'Drizzle', weather_code: 311, description: 'drizzle rain', icon_day: '09d', icon_night: '09d' },
            { name: 'Drizzle', weather_code: 312, description: 'heavy intensity drizzle rain', icon_day: '09d', icon_night: '09d' },
            { name: 'Drizzle', weather_code: 313, description: 'shower rain and drizzle', icon_day: '09d', icon_night: '09d' },
            { name: 'Drizzle', weather_code: 314, description: 'heavy shower rain and drizzle', icon_day: '09d', icon_night: '09d' },
            { name: 'Drizzle', weather_code: 321, description: 'shower drizzle', icon_day: '09d', icon_night: '09d' },

            // Group 5xx: Rain
            { name: 'Rain', weather_code: 500, description: 'light rain', icon_day: '10d', icon_night: '10d' },
            { name: 'Rain', weather_code: 501, description: 'moderate rain', icon_day: '10d', icon_night: '10d' },
            { name: 'Rain', weather_code: 502, description: 'heavy intensity rain', icon_day: '10d', icon_night: '10d' },
            { name: 'Rain', weather_code: 503, description: 'very heavy rain', icon_day: '10d', icon_night: '10d' },
            { name: 'Rain', weather_code: 504, description: 'extreme rain', icon_day: '10d', icon_night: '10d' },
            { name: 'Rain', weather_code: 511, description: 'freezing rain', icon_day: '13d', icon_night: '13d' },
            { name: 'Rain', weather_code: 520, description: 'light intensity shower rain', icon_day: '09d', icon_night: '09d' },
            { name: 'Rain', weather_code: 521, description: 'shower rain', icon_day: '09d', icon_night: '09d' },
            { name: 'Rain', weather_code: 522, description: 'heavy intensity shower rain', icon_day: '09d', icon_night: '09d' },
            { name: 'Rain', weather_code: 531, description: 'ragged shower rain', icon_day: '09d', icon_night: '09d' },

            // Group 6xx: Snow
            { name: 'Snow', weather_code: 600, description: 'light snow', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 601, description: 'snow', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 602, description: 'heavy snow', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 611, description: 'sleet', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 612, description: 'light shower sleet', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 613, description: 'shower sleet', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 615, description: 'light rain and snow', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 616, description: 'rain and snow', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 620, description: 'light shower snow', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 621, description: 'shower snow', icon_day: '13d', icon_night: '13d' },
            { name: 'Snow', weather_code: 622, description: 'heavy shower snow', icon_day: '13d', icon_night: '13d' },

            // Group 7xx: Atmosphere
            { name: 'Mist', weather_code: 701, description: 'mist', icon_day: '50d', icon_night: '50d' },
            { name: 'Smoke', weather_code: 711, description: 'smoke', icon_day: '50d', icon_night: '50d' },
            { name: 'Haze', weather_code: 721, description: 'haze', icon_day: '50d', icon_night: '50d' },
            { name: 'Dust', weather_code: 731, description: 'sand/dust whirls', icon_day: '50d', icon_night: '50d' },
            { name: 'Fog', weather_code: 741, description: 'fog', icon_day: '50d', icon_night: '50d' },
            { name: 'Sand', weather_code: 751, description: 'sand', icon_day: '50d', icon_night: '50d' },
            { name: 'Dust', weather_code: 761, description: 'dust', icon_day: '50d', icon_night: '50d' },
            { name: 'Ash', weather_code: 762, description: 'volcanic ash', icon_day: '50d', icon_night: '50d' },
            { name: 'Squall', weather_code: 771, description: 'squalls', icon_day: '50d', icon_night: '50d' },
            { name: 'Tornado', weather_code: 781, description: 'tornado', icon_day: '50d', icon_night: '50d' },

            // Group 800: Clear
            { name: 'Clear', weather_code: 800, description: 'clear sky', icon_day: '01d', icon_night: '01n' },
            
            // Group 80x: Clouds
            { name: 'Clouds', weather_code: 801, description: 'few clouds: 11-25%', icon_day: '02d', icon_night: '02n' },
            { name: 'Clouds', weather_code: 802, description: 'scattered clouds: 25-50%', icon_day: '03d', icon_night: '03n' },
            { name: 'Clouds', weather_code: 803, description: 'broken clouds: 51-84%', icon_day: '04d', icon_night: '04n' },
            { name: 'Clouds', weather_code: 804, description: 'overcast clouds: 85-100%', icon_day: '04d', icon_night: '04n' }
        ]

        for (const category of categories) {
            await WeatherCategory.findOrCreate({
                where: { weather_code: category.weather_code },
                defaults: category
            });
        }
    }
    catch (e) {
        throw e;
    }
}

const fillMemes = async () => {
    try {
        await sequelize.sync();
        
        const memes = [
            // Thunderstorm (2xx)
            { weather_category_code: 200, image_url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWFiYTNubjdpNmxydmJya2E2M2JrNzV5ampnbmtvanV1ejdiemJ6cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/B7UKKBmYhjGi9c6Oi8/giphy.gif', text_content: null },
            { weather_category_code: 200, image_url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2hzMTkzeDg2Mnh6eHZ5dmhqNnNhaXRyZTYybWVibW1ycWcybnd6diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sHBko23oYSXAZaFKCo/giphy.gif', text_content: null },
            { weather_category_code: 210, image_url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHExdHJqMG54eHVjZzB6ZmpwYmVpbnMzNnIzc3M5dHBxNHFyajBpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KHKoSQgiIBOIU/giphy.gif', text_content: 'Легкая гроза... Небо решило поиграть в салют, но забыло предупредить!' },
            { weather_category_code: 211, image_url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTBzNDVtY2dxbmkydmQ0NG5pcmkxaGY1NWMxMDF6Mnoxb21jbDVrMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oxHQK1A3bZdahPDmo/giphy.gif', text_content: 'Гроза! Самое время проверить, не забыл ли ты закрыть окна!' },
            { weather_category_code: 212, image_url: 'https://img-webcalypt.ru/img/thumb/lg/102707/202510/WQ72XjEa95A3cwtAd2kFXysbXf9ohMXgUOoRut4s4m3m5Gr7CsHi86kaSwTmU3vtzHltZy6MHpR4iL2lqS0yvI93ICZcihk7xFy5tiTbgGuOg1KVuhlvlgc28M0ujwHJ.jpeg.jpg', text_content: null },
            { weather_category_code: 230, image_url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGRxNzN1MXFiamRnaWl0Nnd0Y29rdGthNnF4dzl1Z200Yjh1b3J3NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g1A0LnJY7iqLqvSnyB/giphy.gif', text_content: 'Гроза с дождем - идеальная погода для чашки горячего чая!' },
            
            // Drizzle (3xx)
            { weather_category_code: 300, image_url: null, text_content: 'Мелкий дождь... Природа плачет, но мы-то знаем, что это просто повод надеть красивый зонт!' },
            { weather_category_code: 301, image_url: null, text_content: 'Моросит... Даже котики грустят. Пора включить любимый сериал!' },
            { weather_category_code: 310, image_url: null, text_content: 'Мелкий дождь... Идеально, чтобы погрустить под кофе с плюшками!' },
            { weather_category_code: 321, image_url: null, text_content: 'Дождик... Не повод грустить, а повод потанцевать под зонтом!' },
            
            // Rain (5xx)
            { weather_category_code: 500, image_url: null, text_content: 'Дождь за окном. Самое время для чая и фильмов! Уют гарантирован!' },
            { weather_category_code: 500, image_url: null, text_content: 'Дождь... Кот недоволен. Я его понимаю!' },
            { weather_category_code: 501, image_url: null, text_content: 'Дождь стучит по крыше - это природа играет на барабанах!' },
            { weather_category_code: 502, image_url: null, text_content: 'Сильный дождь! Похоже, небо решило принять душ. Зонт не поможет, лучше дома!' },
            { weather_category_code: 511, image_url: null, text_content: 'Ледяной дождь... Природа решила сделать каток прямо на улице! Будь осторожен!' },
            { weather_category_code: 520, image_url: null, text_content: 'Ливень! Вода сверху, вода снизу... Осталось только научиться дышать под водой!' },
            { weather_category_code: 521, image_url: null, text_content: 'Ливень! Отличный день, чтобы проверить герметичность твоей обуви!' },
            
            // Snow (6xx)
            { weather_category_code: 600, image_url: null, text_content: 'Снег... Природа решила устроить бесплатный фестиваль "Заморозь себя"! Одевайся теплее!' },
            { weather_category_code: 601, image_url: null, text_content: 'Снегопад! Пора лепить снеговика, пока он не растаял от твоего энтузиазма!' },
            { weather_category_code: 602, image_url: null, text_content: 'Сильный снегопад! Похоже, зима решила напомнить о себе. Горячий шоколад спасет!' },
            { weather_category_code: 611, image_url: null, text_content: 'Снег с дождем... Природа не может определиться с настроением. Как и я по утрам!' },
            { weather_category_code: 620, image_url: null, text_content: 'Снежок! Время для снежных ангелов и горячего чая!' },
            { weather_category_code: 622, image_url: null, text_content: 'Метель! Небо решило устроить снежную дискотеку. Оставайся дома!' },
            
            // Atmosphere (7xx)
            { weather_category_code: 701, image_url: null, text_content: 'Туман... Даже Google Maps не знает, где ты находишься! Пора приключений!' },
            { weather_category_code: 711, image_url: null, text_content: 'Дымка... Похоже, кто-то решил устроить шашлыки. Но лучше проветрить!' },
            { weather_category_code: 721, image_url: null, text_content: 'Легкая дымка... Город окутан тайной. Пора стать детективом!' },
            { weather_category_code: 741, image_url: null, text_content: 'Туман... Идеальная погода, чтобы притвориться привидением или просто выпить кофе!' },
            { weather_category_code: 771, image_url: null, text_content: 'Шквалистый ветер! Держи шляпу крепче, а то улетит в страну Оз!' },
            { weather_category_code: 781, image_url: null, text_content: 'Торнадо! Пора вспомнить фильм "Унесенные ветром" и спрятаться в подвал!' },
            
            // Clear (800)
            { weather_category_code: 800, image_url: null, text_content: 'Солнце такое яркое, что даже мои дела сгорели! Отличный день, чтобы ничего не делать!' },
            { weather_category_code: 800, image_url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif', text_content: 'Погода ясная, настроение отличное! Самое время для прогулки!' },
            { weather_category_code: 800, image_url: null, text_content: 'Солнце печет так, что даже мороженое плачет! Бегом за новым!' },
            { weather_category_code: 800, image_url: null, text_content: 'Ясная погода - идеальный повод выгулять свои сандалии и хорошее настроение!' },
            
            // Clouds (80x)
            { weather_category_code: 801, image_url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWs1ZTRjaDltMGQyOTRtbjVuOGUxaXRndHg5NncyeDNudWQ5ZHRjZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HgycnYQCMeJXO/giphy.gif', text_content: 'Малооблачно... Облака играют в прятки с солнцем. А ты выйдешь играть?' },
            { weather_category_code: 801, image_url: null, text_content: 'Небольшая облачность - идеальная погода для прогулки в парке!' },
            { weather_category_code: 802, image_url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXhqdTB4cjlpdDd1ZG03bWlkZDg3eXluOW90YXM0bGszaXVsdXN1ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WoqIEpOqZIRQHrtbQ5/giphy.gif', text_content: 'Облачно... Даже мои мысли спрятались за тучи. Где мой кофе?' },
            { weather_category_code: 802, image_url: 'https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif', text_content: 'Небо в облаках, но это не повод для грусти! Устрой уютный день дома.' },
            { weather_category_code: 803, image_url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmloNDdha3lsOWp0MTJjdmFxb3BuN3Z6d2x0bm1hbzh2eTRsZjR1cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/uC4Ewvvnhin7CaW4sf/giphy.gif', text_content: 'Облачно, но не грустно! Ведь облака такие пушистые, как мои носки!' },
            { weather_category_code: 804, image_url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmFkNnUydzBpOGF0NHdvYmxsZHFza3NtNXIxM3ZnMHZiOGw0ZXZtbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sLB9wzt8hqf3SJNHOf/giphy.gif', text_content: 'Сплошная облачность... Небо натянуло серое одеяло. Пора укутаться в свое!' }
        ];

        for (const meme of memes) {
            await Meme.findOrCreate({
                where: {
                    weather_category_code: meme.weather_category_code,
                    text_content: meme.text_content
                },
                defaults: meme
            });
        }
        
    } catch (e) {
        throw e;
    }
};

export {
    fillWeatherCategories,
    fillMemes
};