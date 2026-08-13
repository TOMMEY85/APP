// ============================================
// CARPZONE - Système Météo
// Utilise Open-Meteo API (gratuit, GDPR compatible)
// ============================================

const WeatherManager = {
  API_URL: 'https://api.open-meteo.com/v1/forecast',
  ARCHIVE_URL: 'https://archive-api.open-meteo.com/v1/archive',
  
  // Stockage local de la météo
  cache: {
    data: null,
    timestamp: 0,
    pressure_history: [] // Pour tendance de pression
  },

  // Obtenir la météo actuelle
  async fetchWeather(latitude, longitude) {
    try {
      // Récupérer les données météo actuelles
      const response = await fetch(
        `${this.API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,surface_pressure&hourly=pressure_msl&daily=sunrise,sunset&timezone=auto&forecast_days=1`
      );

      if (!response.ok) throw new Error('Météo non disponible');
      
      const data = await response.json();
      this.cache.data = data.current;
      this.cache.timestamp = Date.now();
      
      // Stocker historique de pression
      if (data.current.pressure_msl) {
        this.addPressureToHistory(data.current.pressure_msl);
      }
      
      // Stocker aussi les infos de coucher/lever de soleil
      this.cache.data.sunrise = data.daily.sunrise[0];
      this.cache.data.sunset = data.daily.sunset[0];
      
      // Sauvegarder en localStorage
      localStorage.setItem('carpzone_weather', JSON.stringify({
        data: this.cache.data,
        timestamp: this.cache.timestamp,
        pressure_history: this.cache.pressure_history
      }));
      
      return this.cache.data;
    } catch (error) {
      console.error('Erreur météo:', error);
      // Charger depuis cache local si possible
      const cached = localStorage.getItem('carpzone_weather');
      if (cached) {
        const parsed = JSON.parse(cached);
        this.cache = parsed;
        return this.cache.data;
      }
      return null;
    }
  },

  // Ajouter à l'historique de pression
  addPressureToHistory(pressure) {
    this.cache.pressure_history.push({
      value: pressure,
      time: new Date().toISOString()
    });
    
    // Garder seulement les 24 dernières mesures
    if (this.cache.pressure_history.length > 24) {
      this.cache.pressure_history.shift();
    }
  },

  // Calculer la tendance de pression
  getPressureTrend() {
    if (this.cache.pressure_history.length < 2) return '→'; // Stable par défaut
    
    const last = this.cache.pressure_history[this.cache.pressure_history.length - 1].value;
    const previous = this.cache.pressure_history[this.cache.pressure_history.length - 2].value;
    
    const diff = last - previous;
    if (diff > 0.5) return '↗'; // Hausse
    if (diff < -0.5) return '↘'; // Baisse
    return '→'; // Stable
  },

  // Obtenir l'historique de pression formaté
  getPressureHistory() {
    return this.cache.pressure_history.map(h => Math.round(h.value)).join(' → ');
  },

  // Convertir le code météo WMO en description
  getWeatherDescription(code) {
    const codes = {
      0: 'Dégagé',
      1: 'Peu nuageux',
      2: 'Partiellement nuageux',
      3: 'Nuageux',
      45: 'Brumeux',
      48: 'Givre',
      51: 'Pluie légère',
      53: 'Pluie modérée',
      55: 'Pluie forte',
      61: 'Averse légère',
      63: 'Averse modérée',
      65: 'Averse forte',
      71: 'Neige légère',
      73: 'Neige modérée',
      75: 'Neige forte',
      77: 'Grains de neige',
      80: 'Averses légères',
      81: 'Averses modérées',
      82: 'Averses violentes',
      85: 'Neige modérée',
      86: 'Neige forte',
      95: 'Orage',
      96: 'Orage avec grêle légère',
      99: 'Orage avec grêle forte'
    };
    return codes[code] || 'Inconnu';
  },

  // Emoji pour la météo
  getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 86) return '❄️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  },

  // Direction du vent
  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const index = Math.round((degrees % 360) / 22.5);
    return directions[index % 16];
  },

  // Calcul de l'indice d'activité de carpe (0-100)
  calculateCarpActivityIndex() {
    if (!this.cache.data) return 50;
    
    let score = 50; // Base
    const temp = this.cache.data.temperature_2m;
    const pressure = this.cache.data.pressure_msl;
    const wind = this.cache.data.wind_speed_10m;
    
    // Température idéale: 15-22°C
    if (temp >= 15 && temp <= 22) score += 10;
    else if (temp >= 10 && temp <= 25) score += 5;
    else if (temp < 5 || temp > 30) score -= 10;
    
    // Pression en hausse ou stable est bon
    const trend = this.getPressureTrend();
    if (trend === '↗' || trend === '→') score += 10;
    if (trend === '↘') score -= 5;
    
    // Vent faible à modéré est bon (< 25 km/h)
    if (wind < 15) score += 10;
    else if (wind < 25) score += 5;
    else if (wind > 40) score -= 10;
    
    // Pluie légère peut être bonne (code 51-53)
    if (this.cache.data.weather_code >= 51 && this.cache.data.weather_code <= 53) score += 5;
    
    // Orage mauvais (code 95+)
    if (this.cache.data.weather_code >= 95) score -= 20;
    
    return Math.max(0, Math.min(100, score));
  },

  // Niveau d'activité textuel
  getActivityLevel(score) {
    if (score < 20) return 'Très faible';
    if (score < 40) return 'Faible';
    if (score < 60) return 'Moyen';
    if (score < 80) return 'Bon';
    return 'Excellent';
  },

  // Initialiser
  init() {
    const cached = localStorage.getItem('carpzone_weather');
    if (cached) {
      this.cache = JSON.parse(cached);
    }
  }
};

// Initialiser au chargement
WeatherManager.init();
