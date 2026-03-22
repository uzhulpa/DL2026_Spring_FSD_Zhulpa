document.addEventListener('DOMContentLoaded', () => {
    const inputTypeSelect = document.getElementById('inputType');
    const cityModeDiv = document.getElementById('cityMode');
    const coordsModeDiv = document.getElementById('coordsMode');
    const cityInput = document.getElementById('cityInput');
    const latInput = document.getElementById('latInput');
    const lonInput = document.getElementById('lonInput');
    const autoBtn = document.querySelector('.search-panel__auto-btn');
    const searchBtn = document.querySelector('.search-panel__search-btn');

    function updateWeatherUI(data) {
        if (!data || !data.weather) {
            console.error('Нет данных для обновления UI');
            return;
        }

        const weather = data.weather;
        const location = data.location;
        const meme = data.meme;

        const cityNameElement = document.getElementById('cityName');
        const countryCodeElement = document.getElementById('countryCode');
        if (cityNameElement && countryCodeElement) {
            cityNameElement.textContent = location.city || weather.city_name;
            countryCodeElement.textContent = location.country || weather.country;
        }

        const memeCityElement = document.getElementById('memeCityName');
        const memeCountryElement = document.getElementById('memeCountryCode');
        if (memeCityElement && memeCountryElement) {
            memeCityElement.textContent = location.city || weather.city_name;
            memeCountryElement.textContent = location.country || weather.country;
        }

        const now = new Date();
        const currentTime = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const currentDate = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        const timeElement = document.getElementById('currentTime');
        const dateElement = document.getElementById('currentDate');
        const memeTimeElement = document.getElementById('memeCurrentTime');
        const memeDateElement = document.getElementById('memeCurrentDate');
        
        if (timeElement) timeElement.textContent = currentTime;
        if (dateElement) dateElement.textContent = currentDate;
        if (memeTimeElement) memeTimeElement.textContent = currentTime;
        if (memeDateElement) memeDateElement.textContent = currentDate;

        const tempElement = document.getElementById('tempValue');
        if (tempElement) {
            const temp = weather.temp_celsius;
            tempElement.textContent = temp > 0 ? `+${temp}` : temp;
        }

        const feelsLikeElement = document.getElementById('feelsLike');
        if (feelsLikeElement) {
            const feels = weather.feels_like;
            feelsLikeElement.textContent = feels > 0 ? `+${feels}` : feels;
        }

        const iconElement = document.getElementById('weatherIcon');
        if (iconElement && weather.weather_icon) {
            iconElement.src = `https://openweathermap.org/img/wn/${weather.weather_icon}@2x.png`;
            iconElement.alt = weather.weather_description;
        }

        const categoryElement = document.getElementById('weatherCategory');
        const descriptionElement = document.getElementById('weatherDescription');
        if (categoryElement) categoryElement.textContent = weather.weather_main;
        if (descriptionElement) descriptionElement.textContent = weather.weather_description;

        const windSpeedElement = document.getElementById('windSpeed');
        const windDirectionElement = document.getElementById('windDirection');
        if (windSpeedElement) windSpeedElement.textContent = weather.wind_speed;
        if (windDirectionElement) {
            const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
            const index = Math.round(weather.wind_direction / 45) % 8;
            windDirectionElement.textContent = directions[index];
        }

        const humidityElement = document.getElementById('humidity');
        if (humidityElement) humidityElement.textContent = weather.humidity;

        const pressureElement = document.getElementById('pressure');
        if (pressureElement) pressureElement.textContent = weather.pressure;

        const cloudsElement = document.getElementById('clouds');
        if (cloudsElement) cloudsElement.textContent = weather.clouds;

        const visibilityElement = document.getElementById('visibility');
        if (visibilityElement) visibilityElement.textContent = weather.visibility;

        const sunriseElement = document.getElementById('sunrise');
        const sunsetElement = document.getElementById('sunset');
        if (sunriseElement) sunriseElement.textContent = weather.sunrise;
        if (sunsetElement) sunsetElement.textContent = weather.sunset;

        const memeImageElement = document.getElementById('memeImage');
        const memeTextElement = document.getElementById('memeText');
        
        if (meme) {
            if (meme.image_url && memeImageElement) {
                memeImageElement.src = meme.image_url;
                memeImageElement.style.display = 'block';
            } else if (memeImageElement) {
                memeImageElement.style.display = 'none';
            }
            
            if (meme.text_content && memeTextElement) {
                memeTextElement.textContent = meme.text_content;
            }
        }
    }

    function showError(message) {
        console.error('Ошибка:', message);
        alert(message);
    }

    function switchInputMode() {
        const selectedMode = inputTypeSelect.value;
        
        if (selectedMode === 'city') {
            cityModeDiv.classList.add('search-panel__city-mode--active');
            coordsModeDiv.classList.remove('search-panel__coords-mode--active');
        } else if (selectedMode === 'coords') {
            cityModeDiv.classList.remove('search-panel__city-mode--active');
            coordsModeDiv.classList.add('search-panel__coords-mode--active');
        }
    }

    function fillInputFields(location) {
        cityInput.value = location.city;
        latInput.value = location.lat;
        lonInput.value = location.lon;
    }

    async function handleAutoLocation() {
        try {
            const originalIcon = autoBtn.innerHTML;
            autoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            autoBtn.disabled = true;
            
            const location = await window.weatherAPI.getLocationByIP();
            fillInputFields(location);
            
            autoBtn.innerHTML = originalIcon;
            autoBtn.disabled = false;
            
        } catch (error) {
            console.error('Ошибка автоопределения:', error);
            showError(error.message || 'Не удалось определить ваше местоположение');
            autoBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
            autoBtn.disabled = false;
            
            setTimeout(() => {
                autoBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
            }, 2000);
        }
    }

    async function handleSearch() {
        const selectedMode = inputTypeSelect.value;
        
        try {
            const originalIcon = searchBtn.innerHTML;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            searchBtn.disabled = true;
            
            let weatherData;
            
            if (selectedMode === 'city') {
                const city = cityInput.value.trim();
                weatherData = await window.weatherAPI.searchWeather('city', city);
                
            } else if (selectedMode === 'coords') {
                const lat = latInput.value.trim();
                const lon = lonInput.value.trim();
                weatherData = await window.weatherAPI.searchWeather('coords', null, lat, lon);
            }
            
            if (weatherData && weatherData.success) {
                updateWeatherUI(weatherData);
            } else {
                throw new Error(weatherData?.error || 'Не удалось получить данные о погоде');
            }
            
            searchBtn.innerHTML = originalIcon;
            searchBtn.disabled = false;
            
        } catch (error) {
            console.error('Ошибка поиска:', error);
            showError(error.message || 'Не удалось получить данные о погоде');
            searchBtn.innerHTML = '<i class="fas fa-search"></i>';
            searchBtn.disabled = false;
        }
    }

    async function loadInitialWeather() {
        try {
            handleAutoLocation();
            console.log('Загрузка погоды по IP...');
            const weatherData = await window.weatherAPI.searchWeather('ip');
            
            if (weatherData && weatherData.success) {
                updateWeatherUI(weatherData);
                console.log('Погода загружена успешно');
            }
        } catch (error) {
            console.error('Не удалось загрузить погоду автоматически:', error);
        }
    }

    inputTypeSelect.addEventListener('change', switchInputMode);
    
    autoBtn.addEventListener('click', handleAutoLocation);
    searchBtn.addEventListener('click', handleSearch);
    
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    latInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    lonInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    switchInputMode();
    loadInitialWeather();
});