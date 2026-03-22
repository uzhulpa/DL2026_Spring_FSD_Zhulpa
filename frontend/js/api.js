window.weatherAPI = {
    async getLocationByIP() {
        try {
            const response = await fetch('http://ip-api.com/json/');
            const data = await response.json();
            
            if (data.status === 'success') {
                return {
                    city: data.city,
                    lat: data.lat,
                    lon: data.lon
                };
            } else {
                throw new Error('Не удалось определить местоположение');
            }
        } catch (error) {
            console.error('Ошибка при получении данных по IP:', error);
            throw new Error('Не удалось определить местоположение по IP');
        }
    },

    async getWeatherByCity(city) {
        try {
            const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Ошибка при получении погоды');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка при получении погоды по городу:', error);
            throw error;
        }
    },

    async getWeatherByCoords(lat, lon) {
        try {
            const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Ошибка при получении погоды');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка при получении погоды по координатам:', error);
            throw error;
        }
    },

    async getWeatherByIP() {
        try {
            const location = await this.getLocationByIP();
            return await this.getWeatherByCoords(location.lat, location.lon);
        } catch (error) {
            console.error('Ошибка при автоопределении погоды:', error);
            throw error;
        }
    },

    validateCity(city) {
        if (!city || city.trim() === '') {
            return { valid: false, error: 'Введите название города' };
        }
        if (city.length < 2) {
            return { valid: false, error: 'Название города должно содержать минимум 2 символа' };
        }
        if (/[<>{}]/.test(city)) {
            return { valid: false, error: 'Название города содержит недопустимые символы' };
        }
        return { valid: true };
    },

    validateCoords(lat, lon) {
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        
        if (isNaN(latNum) || isNaN(lonNum)) {
            return { valid: false, error: 'Широта и долгота должны быть числами' };
        }
        
        if (latNum < -90 || latNum > 90) {
            return { valid: false, error: 'Широта должна быть в диапазоне от -90 до 90' };
        }
        
        if (lonNum < -180 || lonNum > 180) {
            return { valid: false, error: 'Долгота должна быть в диапазоне от -180 до 180' };
        }
        
        return { valid: true };
    },

    async searchWeather(mode, city = null, lat = null, lon = null) {
        if (mode === 'city') {
            const validation = this.validateCity(city);
            if (!validation.valid) {
                throw new Error(validation.error);
            }
            return await this.getWeatherByCity(city);
            
        } else if (mode === 'coords') {
            const validation = this.validateCoords(lat, lon);
            if (!validation.valid) {
                throw new Error(validation.error);
            }
            return await this.getWeatherByCoords(lat, lon);
            
        } else if (mode === 'ip') {
            return await this.getWeatherByIP();
        } else {
            throw new Error('Неизвестный режим поиска');
        }
    }
};