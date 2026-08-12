// ============================================
// CARPZONE - UI Generator
// Génère dynamiquement le contenu des écrans
// ============================================

const UIGenerator = {
  // Génère l'écran d'accueil
  generateHomeScreen() {
    const stats = getStatistics();
    const session = AppData.sessions.find(s => s.status === 'active');
    const recentCatches = AppData.catches.slice(0, 2);
    const unlockedBadges = AppData.badges.filter(b => b.unlocked);

    const html = `
      <div class="home-screen">
        <div class="logo-section">
          <div class="logo">CARP<span class="logo-accent">ZONE</span></div>
          <div class="slogan">Analyse. Prépare. Capture.</div>
        </div>

        <div class="welcome-text">Bienvenue ${AppData.user.name.split(' ')[0]} 🎣</div>

        ${session ? `
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-label">Prochaine session</div>
              <div class="stat-value">${session.name}</div>
            </div>
            <div class="stat-icon">📅</div>
          </div>
        ` : ''}

        <div class="section-title">Conditions actuelles</div>
        <div class="weather-grid">
          <div class="mini-stat">
            <div class="mini-label">Température</div>
            <div class="mini-value">${AppData.weather.temperature}${AppData.settings.units.temperature}</div>
          </div>
          <div class="mini-stat">
            <div class="mini-label">Ressenti</div>
            <div class="mini-value">${AppData.weather.feelsLike}${AppData.settings.units.temperature}</div>
          </div>
          <div class="mini-stat">
            <div class="mini-label">Vent</div>
            <div class="mini-value">${AppData.weather.windSpeed} km/h</div>
          </div>
          <div class="mini-stat">
            <div class="mini-label">Pression</div>
            <div class="mini-value">${AppData.weather.pressure}mb</div>
          </div>
        </div>

        <div class="moon-phase">
          <div class="moon-icon">🌙</div>
          <div class="moon-text">
            <div class="moon-label">Phase lunaire</div>
            <div class="moon-value">${AppData.weather.moonPhase}</div>
          </div>
        </div>

        <div class="activity-section">
          <div class="section-title">Indice d'activité carpe</div>
          <div class="activity-meter">
            <div class="activity-bar">
              <div class="activity-fill" style="width: ${AppData.activityIndex.score}%"></div>
            </div>
            <div class="activity-label">
              <span>${AppData.activityIndex.level} ${AppData.activityIndex.score}/100</span>
              <span class="activity-status">CONDITIONS ${AppData.activityIndex.score > 60 ? 'FAVORABLES' : 'MOYENNES'}</span>
            </div>
          </div>
        </div>

        <div class="section-title">Dernières prises</div>
        ${recentCatches.map(c => `
          <div class="catch-item">
            <div class="catch-thumb">🐟</div>
            <div class="catch-info">
              <div class="catch-name">${c.species}</div>
              <div class="catch-meta">${this.formatDate(c.date)} • ${c.location}</div>
            </div>
            <div class="catch-weight">${c.weight} kg</div>
          </div>
        `).join('')}

        <div class="section-title">Statistiques globales</div>
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-label">Total de carpes</div>
            <div class="stat-value">${stats.totalCatches}</div>
          </div>
          <div class="stat-icon">🎣</div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-label">Record personnel</div>
            <div class="stat-value">${stats.personalRecord} kg</div>
          </div>
          <div class="stat-icon">🏆</div>
        </div>

        <button class="btn btn-primary" onclick="App.showAddMenu()">+ Nouvelle Session</button>

        <div class="section-title" style="margin-top: 20px;">Badges débloqués</div>
        <div class="badge-list">
          ${AppData.badges.map(b => `
            <div class="badge ${b.unlocked ? 'unlocked' : 'locked'}" title="${b.name}">
              ${b.emoji}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return html;
  },

  // Génère l'écran de la carte
  generateMapScreen() {
    const html = `
      <div class="map-screen">
        <div style="padding: 8px 0;">
          <div class="section-title">Carte de pêche</div>
          <div class="map-placeholder">🗺️</div>
          <div class="map-controls">
            <button class="map-btn" onclick="App.showAddSpotMenu()">+ Ajouter spot</button>
            <button class="map-btn" onclick="App.useGPS()">Ma position</button>
          </div>
        </div>

        <div class="section-title">Spots enregistrés</div>
        <div class="spot-list">
          ${AppData.spots.map(spot => `
            <div class="spot-item" onclick="App.viewSpotDetails('${spot.id}')">
              <div class="spot-content">
                <div class="spot-name">${spot.name}</div>
                <div class="spot-meta">Profondeur: ${spot.depth}m • Distance: ${spot.distance}m</div>
              </div>
              <div class="spot-icon">📍</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return html;
  },

  // Génère l'écran des sessions
  generateSessionsScreen() {
    const html = `
      <div class="sessions-screen">
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
          <button onclick="confirmDelete('Session', '${session.name}', () => deleteSession('${session.id}') && App.reloadAllScreens())" style="flex: 1; padding: 8px; background: #333; color: #ccc; border: 1px solid #555; border-radius: 6px; font-size: 12px; cursor: pointer;">🗑️ Supprimer</button>
        </div>
      </div>
    `;
  },

  // Génère l'écran des prises
  generateCatchesScreen() {
    const stats = getStatistics();
    const html = `
      <div class="catches-screen">
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
              <div class="catch-thumb" style="background: linear-gradient(135deg, var(--accent-red) 0%, hsl(0, 100%, ${40 + idx * 5}%) 100%); cursor: pointer;" onclick="App.viewCatchDetails('${c.id}')">🐟</div>
              <div class="catch-info" style="flex: 1; cursor: pointer;" onclick="App.viewCatchDetails('${c.id}')">
                <div class="catch-name">${c.species}</div>
                <div class="catch-meta">${this.formatDate(c.date)} • ${c.bait}</div>
              </div>
              <div class="catch-weight" style="text-align: right;">${c.weight} kg</div>
            </div>
            <button onclick="confirmDelete('Prise', '${c.species}', () => deleteCatch('${c.id}') && App.reloadAllScreens())" style="width: 100%; margin-top: 8px; padding: 6px; background: #333; color: #ccc; border: 1px solid #555; border-radius: 6px; font-size: 11px; cursor: pointer;">🗑️ Supprimer</button>
          </div>
        `).join('')}
      </div>
    `;

    return html;
  },

  // Génère l'écran du profil
  generateProfileScreen() {
    const stats = getStatistics();
    const unlockedBadges = AppData.badges.filter(b => b.unlocked).length;

    const html = `
      <div class="profile-screen">
        <div class="profile-header">
          <div class="profile-avatar">${AppData.user.avatar}</div>
          <div class="profile-name">${AppData.user.name}</div>
          <div class="profile-bio">${AppData.user.bio}</div>
        </div>

        <div class="profile-stats">
          <div class="profile-stat">
            <div class="profile-stat-label">Sessions</div>
            <div class="profile-stat-value">${stats.totalSessions}</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-label">Carpes</div>
            <div class="profile-stat-value">${stats.totalCatches}</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-label">Poids total</div>
            <div class="profile-stat-value">${stats.totalWeight}</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-label">Record</div>
            <div class="profile-stat-value">${stats.personalRecord}</div>
          </div>
        </div>

        <div class="profile-section-label">Badges & accomplissements</div>
        <div class="badge-list" style="margin-bottom: 20px;">
          ${AppData.badges.map(b => `
            <div class="badge ${b.unlocked ? 'unlocked' : 'locked'}" title="${b.name}: ${b.description}">
              ${b.emoji}
            </div>
          `).join('')}
        </div>

        <div class="profile-section-label">Préférences</div>
        <div style="background: #1a1a1a; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--spacing-md); margin-bottom: 20px;">
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Carpiste depuis ${new Date(AppData.user.joinDate).getFullYear()}</div>
          <div style="font-size: 12px; color: var(--text-dark);">${AppData.user.bio}</div>
        </div>

        <div class="profile-section-label">Paramètres rapides</div>
        <div class="option-list">
          <div class="option-item">
            <span class="option-item-label">Unités: ${AppData.settings.units.weight}/${AppData.settings.units.temperature}</span>
            <span class="option-item-value">✓</span>
          </div>
          <div class="option-item">
            <span class="option-item-label">Mode sombre</span>
            <span class="option-item-value">${AppData.settings.display.darkMode ? '✓' : '✗'}</span>
          </div>
          <div class="option-item">
            <span class="option-item-label">Notifications</span>
            <span class="option-item-value">${AppData.settings.notifications.catchAlert ? 'ON' : 'OFF'}</span>
          </div>
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
