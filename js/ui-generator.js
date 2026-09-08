// ============================================
// CARPZONE - UI Generator
// Génère dynamiquement le contenu des écrans
// ============================================

const UIGenerator = {
  // Génère l'écran d'accueil amélioré
  generateHomeScreen() {
    const stats = getStatistics();
    const profile = UserProfile || ProfileManager.load();
    const weather = WeatherManager.cache.data;
    const nextSession = AppData.sessions.find(s => s.status === 'active') || AppData.sessions[0];
    const recentCatches = AppData.catches.slice(0, 3);
    
    // Calculer l'indice d'activité
    const activityScore = weather ? WeatherManager.calculateCarpActivityIndex() : 50;
    const activityLevel = WeatherManager.getActivityLevel(activityScore);
    
    let html = `
      <div class="home-screen" style="padding: 16px; background: #101f1b; color: #fff;">
        
        <header class="journal-heading"><div><span class="eyebrow">LE CARNET DU CARPISTE</span><h1>Au fil de l’eau.</h1><p>Bonjour ${profile.firstName} · Prêt pour la prochaine touche ?</p></div><button class="journal-button" onclick="Navigation.showAddMenu()">+ Nouvelle sortie</button></header>
        <section class="lake-hero"><div class="hero-copy"><span class="eyebrow">L’APPEL DU LARGE</span><h2>Les meilleures histoires<br>commencent au bord de l’eau.</h2><p>Repérez votre spot. Préparez votre session.<br>Gardez une trace de chaque prise.</p><button class="journal-button" onclick="Navigation.switchScreen('map')">Explorer mes spots ↗</button></div><span class="hero-caption">CARPZONE / VOTRE TERRAIN DE JEU</span></section>
    `;
    
    // Section Prochaine session
    html += `
      <div class="next-session-panel" style="background: #1a3028; border: 2px solid #b7cc85; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="font-size: 12px; color: #a6b5a9; margin-bottom: 8px;">PROCHAINE SESSION</div>
    `;
    
    if (nextSession) {
      html += `
        <div style="font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 4px;">${nextSession.name}</div>
        <div style="font-size: 13px; color: #ccd4c8; margin-bottom: 8px;">📍 ${nextSession.location}</div>
        <div style="font-size: 12px; color: #a6b5a9;">
          ${nextSession.startDate ? nextSession.startDate : 'Date non définie'}
        </div>
        <button onclick="Navigation.switchScreen('sessions')" style="width: 100%; margin-top: 12px; padding: 8px; background: #b7cc85; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">Voir la session</button>
      `;
    } else {
      html += `
        <div style="color: #a6b5a9;">Aucune session programmée</div>
        <button onclick="App.showAddMenu()" style="width: 100%; margin-top: 12px; padding: 8px; background: #b7cc85; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">+ Nouvelle session</button>
      `;
    }
    
    html += `</div>`;
    
    // Section Météo
    html += `
      <div style="background: #1a3028; border: 1px solid #365046; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="font-size: 12px; color: #a6b5a9; margin-bottom: 8px;">🌤️ MÉTÉO ACTUELLE</div>
    `;
    
    if (weather) {
      const temp = Math.round(weather.temperature_2m);
      const weatherDesc = WeatherManager.getWeatherDescription(weather.weather_code);
      const weatherEmoji = WeatherManager.getWeatherEmoji(weather.weather_code);
      const windDir = WeatherManager.getWindDirection(weather.wind_direction_10m);
      const pressure = Math.round(weather.pressure_msl);
      const pressureTrend = WeatherManager.getPressureTrend();
      const humidity = weather.relative_humidity_2m;
      
      html += `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div>
            <div style="font-size: 32px;">${weatherEmoji}</div>
            <div style="font-size: 28px; font-weight: bold; color: #b7cc85;">${temp}°C</div>
            <div style="font-size: 12px; color: #a6b5a9;">${weatherDesc}</div>
          </div>
          
          <div>
            <div style="font-size: 12px; color: #a6b5a9; margin-bottom: 4px;">💨 Vent</div>
            <div style="font-size: 16px; font-weight: 600;">${Math.round(weather.wind_speed_10m)} km/h</div>
            <div style="font-size: 13px; color: #ccd4c8;">Direction: ${windDir}</div>
          </div>
        </div>
        
        <div style="background: #14271f; border-radius: 8px; padding: 8px; margin-bottom: 8px;">
          <div style="font-size: 12px; color: #a6b5a9;">📊 Pression: ${pressure} hPa ${pressureTrend}</div>
          <div style="font-size: 11px; color: #94a69b; margin-top: 4px;">${WeatherManager.getPressureHistory()}</div>
        </div>
        
        <div style="display: flex; gap: 8px; font-size: 12px;">
          <div style="flex: 1; background: #14271f; padding: 6px; border-radius: 6px; text-align: center;">
            <div style="color: #a6b5a9;">💧</div>
            <div style="color: #ccd4c8;">${humidity}% humidité</div>
          </div>
          <div style="flex: 1; background: #14271f; padding: 6px; border-radius: 6px; text-align: center;">
            <div style="color: #a6b5a9;">🌅</div>
            <div style="color: #ccd4c8;">${weather.sunrise ? weather.sunrise.slice(11, 16) : '--:--'}</div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div style="color: #a6b5a9; text-align: center; padding: 16px;">
          Chargement météo...
          <br><small>Autorisez la géolocalisation</small>
        </div>
      `;
    }
    
    html += `</div>`;
    
    // Indice d'activité de carpe
    html += `
      <div style="background: #1a3028; border: 1px solid #365046; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="font-size: 12px; color: #a6b5a9; margin-bottom: 8px;">🎣 CONDITIONS CARPE</div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="flex: 1;">
            <div style="background: #14271f; height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #b7cc85 0%, #b7cc85 100%); height: 100%; width: ${activityScore}%;" ></div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 16px; font-weight: 600; color: #b7cc85;">${activityScore}/100</div>
            <div style="font-size: 12px; color: #a6b5a9;">${activityLevel}</div>
          </div>
        </div>
      </div>
    `;
    
    // Dernières prises
    if (recentCatches.length > 0) {
      html += `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; color: #a6b5a9; margin-bottom: 8px;">🐟 DERNIÈRES PRISES</div>
      `;
      
      recentCatches.forEach(c => {
        html += `
          <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 24px;">🐟</div>
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #fff;">${c.species}</div>
              <div style="font-size: 12px; color: #a6b5a9;">${this.formatDate(c.date)} • ${c.location}</div>
            </div>
            <div style="font-size: 16px; font-weight: 600; color: #b7cc85;">${c.weight} kg</div>
          </div>
        `;
      });
      
      html += `
        <button onclick="Navigation.switchScreen('catches')" style="width: 100%; padding: 8px; background: #365046; color: #ccd4c8; border: 1px solid #52695d; border-radius: 6px; cursor: pointer; font-size: 12px;">Voir toutes les prises</button>
        </div>
      `;
    }
    
    // Statistiques
    html += `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; color: #a6b5a9; margin-bottom: 8px;">📈 STATISTIQUES</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #b7cc85;">${stats.totalCatches}</div>
            <div style="font-size: 11px; color: #a6b5a9;">Prises totales</div>
          </div>
          <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #b7cc85;">${stats.personalRecord} kg</div>
            <div style="font-size: 11px; color: #a6b5a9;">Record</div>
          </div>
          <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #b7cc85;">${AppData.sessions.length}</div>
            <div style="font-size: 11px; color: #a6b5a9;">Sessions</div>
          </div>
          <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #b7cc85;">${stats.averageWeight} kg</div>
            <div style="font-size: 11px; color: #a6b5a9;">Poids moyen</div>
          </div>
        </div>
      </div>
    `;
    
    html += `</div>`;
    
    return html;
  },


  // Génère l'écran de la carte
  generateMapScreen() {
    const html = `
      <div class="map-screen" style="display: flex; flex-direction: column; height: 100%; background: #101f1b;">
        <!-- Barre d'outils -->
        <div style="padding: 12px; background: #1a3028; border-bottom: 1px solid #365046; display: flex; gap: 8px; flex-wrap: wrap;">
          <button onclick="MapManager.locateUser()" style="flex: 1; min-width: 100px; padding: 8px; background: #b7cc85; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">📍 Me localiser</button>
          <button onclick="MapManager.openAddSpotForm(48.8566, 2.3522)" style="flex: 1; min-width: 100px; padding: 8px; background: #365046; color: #ccd4c8; border: 1px solid #52695d; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">+ Ajouter spot</button>
        </div>
        
        <!-- Carte Leaflet -->
        <div id="map-container" style="flex: 1; background: #101f1b;"></div>
        
        <!-- Liste des spots -->
        <div style="max-height: 30%; overflow-y: auto; background: #1a3028; border-top: 1px solid #365046;">
          <div style="padding: 12px; font-size: 12px; color: #a6b5a9;">📍 SPOTS ENREGISTRÉS (${AppData.spots.length})</div>
          ${AppData.spots.length > 0 ? AppData.spots.map(spot => `
            <div style="background: #14271f; border: 1px solid #365046; border-radius: 6px; padding: 8px 12px; margin: 0 8px 8px 8px; cursor: pointer;" onclick="MapManager.locateSpot('${spot.id}')">
              <div style="font-weight: 600; color: #fff; font-size: 12px;">${spot.name}</div>
              <div style="font-size: 11px; color: #a6b5a9;">${spot.lake}</div>
            </div>
          `).join('') : '<div style="padding: 12px; color: #94a69b; text-align: center;">Cliquez sur la carte pour ajouter des spots</div>'}
        </div>
      </div>
      
      <script>
        // Initialiser la carte quand l'écran se charge
        setTimeout(() => {
          if (!MapManager.map) {
            MapManager.init('map-container');
          }
        }, 100);
      </script>
    `;
    
    return html;
  },

  // Génère l'écran des sessions
  generateSessionsScreen() {
    const html = `
      <div class="sessions-screen">
        <header class="journal-heading"><div><span class="eyebrow">VOTRE JOURNAL DE BORD</span><h1>Mes sessions</h1><p>Chaque sortie, une nouvelle histoire.</p></div><button class="journal-button" onclick="Navigation.addSession()">+ Nouvelle session</button></header>
        ${AppData.sessions.length === 0 ? '<div class="nature-empty"><span aria-hidden="true">⌁</span><h2>Votre prochaine aventure vous attend.</h2><p>Planifiez votre première session pour retrouver ici vos sorties et vos souvenirs au bord de l’eau.</p><button class="journal-button" onclick="Navigation.addSession()">Préparer ma première session</button></div>' : ''}

        <div class="section-title">Sessions actives</div>
        
        ${AppData.sessions.filter(s => s.status === 'active').map(s => this.generateSessionCard(s)).join('')}

        <div class="section-title">Sessions récentes</div>

        ${AppData.sessions.filter(s => s.status === 'completed').map(s => this.generateSessionCard(s)).join('')}
      </div>
    `;

    return html;
  },

  // Génère une carte de session
  generateSessionCard(session) {
    return `
      <div class="session-card">
        <div class="session-header">
          <div onclick="App.viewSessionDetails('${session.id}')" style="flex: 1; cursor: pointer;">
            <div class="session-title">${session.name}</div>
            <div style="font-size: 11px; color: var(--text-dark);">${session.location} • ${this.formatDate(session.startDate)}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${session.status === 'active' ? '<div class="session-status">EN COURS</div>' : ''}
          </div>
        </div>
        <div class="session-stat">
          <span>Durée:</span>
          <span class="session-value">${this.calculateDuration(session.startDate, session.endDate)}</span>
        </div>
        <div class="session-stat">
          <span>Prises:</span>
          <span class="session-value">${session.catches} carpe(s)</span>
        </div>
        <div class="session-stat">
          <span>Poids total:</span>
          <span class="session-value">${session.totalWeight} kg</span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button onclick="confirmDelete('Session', '${session.name}', () => deleteSession('${session.id}') && App.reloadAllScreens())" style="flex: 1; padding: 8px; background: #365046; color: #ccd4c8; border: 1px solid #52695d; border-radius: 6px; font-size: 12px; cursor: pointer;">🗑️ Supprimer</button>
        </div>
      </div>
    `;
  },

  // Génère l'écran des prises
  generateCatchesScreen() {
    const stats = getStatistics();
    const html = `
      <div class="catches-screen">
        <header class="journal-heading"><div><span class="eyebrow">LES SOUVENIRS QUI RESTENT</span><h1>Mes prises</h1><p>Le carnet de vos plus belles captures.</p></div><button class="journal-button" onclick="Navigation.addCatch()">+ Ajouter une prise</button></header>
        ${AppData.catches.length === 0 ? '<div class="nature-empty"><span aria-hidden="true">⌁</span><h2>La première prise ouvre le carnet.</h2><p>Enregistrez votre capture, son poids et les conditions de votre session.</p></div>' : ''}

        <div class="section-title">Carnet des prises</div>
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-box-label">Record</div>
            <div class="stat-box-value">${stats.personalRecord} kg</div>
          </div>
          <div class="stat-box">
            <div class="stat-box-label">Poids moyen</div>
            <div class="stat-box-value">${stats.averageWeight} kg</div>
          </div>
          <div class="stat-box">
            <div class="stat-box-label">Total prises</div>
            <div class="stat-box-value">${stats.totalCatches}</div>
          </div>
          <div class="stat-box">
            <div class="stat-box-label">Poids total</div>
            <div class="stat-box-value">${stats.totalWeight} kg</div>
          </div>
        </div>

        <div class="section-title">Prises récentes</div>

        ${AppData.catches.map((c, idx) => `
          <div class="catch-item">
            <div style="display: flex; gap: 12px; width: 100%;">
              ${c.photo ? `<img class="catch-thumb" src="${c.photo}" alt="Photo de la prise" style="object-fit:cover;cursor:pointer" onclick="App.viewCatchDetails('${c.id}')">` : `<div class="catch-thumb" style="background: linear-gradient(135deg, var(--accent-red) 0%, hsl(145, 25%, ${40 + idx * 5}%) 100%); cursor: pointer;" onclick="App.viewCatchDetails('${c.id}')">🐟</div>`}
              <div class="catch-info" style="flex: 1; cursor: pointer;" onclick="App.viewCatchDetails('${c.id}')">
                <div class="catch-name">${c.species}</div>
                <div class="catch-meta">${this.formatDate(c.date)} • ${c.bait}</div>
              </div>
              <div class="catch-weight" style="text-align: right;">${c.weight} kg</div>
            </div>
            <button onclick="confirmDelete('Prise', '${c.species}', () => deleteCatch('${c.id}') && App.reloadAllScreens())" style="width: 100%; margin-top: 8px; padding: 6px; background: #365046; color: #ccd4c8; border: 1px solid #52695d; border-radius: 6px; font-size: 11px; cursor: pointer;">🗑️ Supprimer</button>
          </div>
        `).join('')}
      </div>
    `;

    return html;
  },

  // Génère l'écran du profil
  generateProfileScreen() {
    const stats = getStatistics();
    const profile = UserProfile || ProfileManager.load();
    const unlockedBadges = AppData.badges.filter(b => b.unlocked).length;

    const html = `
      <div class="profile-screen" style="padding: 16px; background: #101f1b; color: #fff;">
        
        <!-- En-tête du profil -->
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #365046;">
          <div style="font-size: 48px; margin-bottom: 12px;">${profile.avatar}</div>
          <div style="font-size: 18px; font-weight: 600;">${profile.firstName} ${profile.lastName}</div>
          <div style="font-size: 12px; color: #a6b5a9; margin-top: 4px;">@${profile.username}</div>
          <div style="font-size: 12px; color: #b7cc85; margin-top: 4px;">${profile.bio}</div>
          <button onclick="ProfileManager.openEditForm()" style="width: 100%; margin-top: 12px; padding: 8px; background: #b7cc85; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">✏️ Modifier mon profil</button>
        </div>
        
        <!-- Statistiques -->
        <div style="margin-bottom: 24px;">
          <div style="font-size: 12px; color: #a6b5a9; margin-bottom: 8px;">📈 STATISTIQUES</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #b7cc85;">${stats.totalSessions}</div>
              <div style="font-size: 11px; color: #a6b5a9;">Sessions</div>
            </div>
            <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #b7cc85;">${stats.totalCatches}</div>
              <div style="font-size: 11px; color: #a6b5a9;">Carpes</div>
            </div>
            <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #b7cc85;">${stats.totalWeight} kg</div>
              <div style="font-size: 11px; color: #a6b5a9;">Poids total</div>
            </div>
            <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #b7cc85;">${stats.personalRecord} kg</div>
              <div style="font-size: 11px; color: #a6b5a9;">Record</div>
            </div>
          </div>
        </div>
        
        <!-- Badges -->
        <div style="margin-bottom: 24px;">
          <div style="font-size: 12px; color: #a6b5a9; margin-bottom: 8px;">🏆 BADGES (${unlockedBadges}/${AppData.badges.length})</div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            ${AppData.badges.map(b => `
              <div style="background: ${b.unlocked ? '#1a3028' : '#14271f'}; border: 1px solid ${b.unlocked ? '#b7cc85' : '#365046'}; border-radius: 8px; padding: 8px; text-align: center; cursor: pointer;" title="${b.name}">
                <div style="font-size: 24px;">${b.emoji}</div>
                <div style="font-size: 9px; color: ${b.unlocked ? '#b7cc85' : '#94a69b'}; margin-top: 2px;">${b.unlocked ? '✓' : '🔒'}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Informations -->
        <div style="margin-bottom: 24px;">
          <div style="font-size: 12px; color: #a6b5a9; margin-bottom: 8px;">ℹ️ INFORMATIONS</div>
          <div style="background: #1a3028; border: 1px solid #365046; border-radius: 8px; padding: 12px; font-size: 12px;">
            <div style="margin-bottom: 8px;">
              <span style="color: #a6b5a9;">Inscrit depuis:</span>
              <span style="color: #fff;">${new Date(profile.joinDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="color: #a6b5a9;">Moyenne par prise:</span>
              <span style="color: #fff;">${stats.averageWeight} kg</span>
            </div>
            <div>
              <span style="color: #a6b5a9;">Données sauvegardées:</span>
              <span style="color: #fff;">✓ Locales (private)</span>
            </div>
          </div>
        </div>
        
        <!-- Version -->
        <div style="text-align: center; padding-top: 12px; border-top: 1px solid #365046;">
          <div style="font-size: 10px; color: #94a69b;">CARPZONE v2.0 • Analyse. Prépare. Capture.</div>
        </div>
      </div>
    `;

    return html;
  },

  // Utilitaires
  formatDate(date) {
    if (!date) return '';
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) return 'À l\'instant';
      return `Il y a ${diffHours}h`;
    }
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return new Date(date).toLocaleDateString('fr-FR');
  },

  calculateDuration(start, end) {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    const diff = e - s;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  }
};
