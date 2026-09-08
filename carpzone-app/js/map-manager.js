// ============================================
// CARPZONE - Gestion de la Carte Leaflet
// ============================================

const MapManager = {
  map: null,
  markers: {},
  userMarker: null,
  
  // Initialiser la carte
  init(containerId) {
    if (this.map) return; // Déjà initialisée
    
    // Créer la carte
    this.map = L.map(containerId).setView([48.8566, 2.3522], 6); // France par défaut
    
    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
    
    // Charger les spots depuis AppData
    this.loadSpots();
    
    // Localiser l'utilisateur
    this.locateUser();
    
    // Ajouter click listener pour ajouter des spots
    this.map.on('click', (e) => {
      this.onMapClick(e.latlng);
    });
  },

  // Localiser l'utilisateur
  locateUser() {
    if (!navigator.geolocation) {
      console.warn('Géolocalisation non disponible');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!this.map) return;
        this.map.setView([latitude, longitude], 12);
        
        // Ajouter un marqueur pour l'utilisateur
        if (this.userMarker) {
          this.userMarker.setLatLng([latitude, longitude]);
        } else {
          this.userMarker = L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#b7cc85',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(this.map).bindPopup('📍 Votre position');
        }
        
        // Charger la météo de cette position sans quitter la carte.
        if (typeof WeatherManager !== 'undefined' && WeatherManager.fetchWeather) {
          WeatherManager.fetchWeather(latitude, longitude).catch((error) => {
            console.warn('Météo indisponible depuis la carte:', error);
          });
        }
      },
      (error) => console.warn('Erreur géolocalisation:', error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },

  // Charger les spots depuis les données
  loadSpots() {
    if (!AppData || !AppData.spots) return;
    
    AppData.spots.forEach(spot => {
      this.addSpotMarker(spot);
    });
  },

  // Ajouter un marqueur de spot
  addSpotMarker(spot) {
    if (!spot.latitude || !spot.longitude) return;
    
    const icon = this.getSpotIcon(spot.type);
    const marker = L.marker([spot.latitude, spot.longitude], {
      icon: L.divIcon({
        html: `<div style="font-size: 24px; text-align: center;">${icon}</div>`,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    }).addTo(this.map);
    
    const popup = `
      <div style="color: #000; min-width: 150px;">
        <strong>${icon} ${spot.name}</strong><br>
        ${spot.lake}<br>
        <small style="color: #94a69b;">
          ${spot.depth ? 'Profondeur: ' + spot.depth + 'm<br>' : ''}
          ${spot.substrate ? 'Fond: ' + spot.substrate + '<br>' : ''}
          ${spot.distance ? 'Distance: ' + spot.distance + 'm<br>' : ''}
        </small>
        <button onclick="MapManager.editSpot('${spot.id}')" style="margin-top: 8px; padding: 4px 8px; background: #b7cc85; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Modifier</button>
        <button onclick="MapManager.deleteSpot('${spot.id}')" style="margin-left: 4px; padding: 4px 8px; background: #365046; color: #ccd4c8; border: 1px solid #52695d; border-radius: 4px; cursor: pointer; font-size: 11px;">Supprimer</button>
      </div>
    `;
    
    marker.bindPopup(popup);
    this.markers[spot.id] = marker;
  },

  // Icône du spot
  getSpotIcon(type) {
    const icons = {
      'poste': '🎣',
      'passage': '🐟',
      'herbiers': '🌿',
      'obstacle': '⚠️',
      'cassure': '📉',
      'haut_fond': '🏞️',
      'repere': '📍'
    };
    return icons[type] || '📍';
  },

  // Click sur la carte
  onMapClick(latlng) {
    const confirmed = confirm(`Ajouter un spot ici?\n${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
    if (confirmed) {
      this.openAddSpotForm(latlng.lat, latlng.lng);
    }
  },

  // Ouvrir formulaire d'ajout de spot
  openAddSpotForm(lat, lng) {
    const content = `
      <form style="display: grid; gap: 12px;">
        <input type="hidden" name="latitude" value="${lat}">
        <input type="hidden" name="longitude" value="${lng}">
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Nom du spot *</label>
          <input type="text" name="name" placeholder="Nom du spot" required style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
        </div>
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Lac / Rivière</label>
          <input type="text" name="lake" placeholder="Lac de..." style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
        </div>
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Type de spot</label>
          <select name="type" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
            <option value="poste">🎣 Poste</option>
            <option value="passage">🐟 Zone de passage</option>
            <option value="herbiers">🌿 Herbiers</option>
            <option value="obstacle">⚠️ Obstacle</option>
            <option value="cassure">📉 Cassure</option>
            <option value="haut_fond">🏞️ Haut-fond</option>
            <option value="repere">📍 Repère</option>
          </select>
        </div>
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Type de fond</label>
          <select name="substrate" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
            <option value="">Sélectionner...</option>
            <option value="Vase">Vase</option>
            <option value="Sable">Sable</option>
            <option value="Gravier">Gravier</option>
            <option value="Cailloux">Cailloux</option>
            <option value="Dur">Dur</option>
            <option value="Herbiers">Herbiers</option>
            <option value="Inconnu">Inconnu</option>
          </select>
        </div>
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Profondeur (m)</label>
          <input type="number" name="depth" placeholder="3.5" step="0.1" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
        </div>
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Distance (m)</label>
          <input type="number" name="distance" placeholder="40" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
        </div>
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Commentaire</label>
          <textarea name="notes" placeholder="Observations..." style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff; min-height: 80px; resize: none;"></textarea>
        </div>
      </form>
    `;
    
    openModal('📍 Ajouter un spot', content, (data) => {
      addSpot({
        name: data.name,
        lake: data.lake,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        type: data.type,
        substrate: data.substrate,
        depth: parseFloat(data.depth),
        distance: parseFloat(data.distance),
        notes: data.notes
      });
      
      // Ajouter à la carte
      this.addSpotMarker(AppData.spots[0]); // Le dernier ajouté
      return true;
    });
  },

  // Modifier un spot
  editSpot(spotId) {
    console.log('Modifier spot:', spotId);
    // Implémentation future
  },

  // Supprimer un spot
  deleteSpot(spotId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce spot?')) {
      deleteSpot(spotId);
      if (this.markers[spotId]) {
        this.map.removeLayer(this.markers[spotId]);
        delete this.markers[spotId];
      }
    }
  },

  // Destroy la carte
  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markers = {};
    }
  }
};
