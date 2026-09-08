// ============================================
// CARPZONE - Navigation Manager
// Gère la navigation entre les écrans
// ============================================

const Navigation = {
  currentScreen: 'home',

  // Initialise les écouteurs de navigation
  init() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const screenId = item.dataset.screen;
        this.switchScreen(screenId);
      });
    });

    // Bouton d'ajout central
    const addBtn = document.getElementById('nav-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddMenu());
    }
  },

  // Change d'écran
  switchScreen(screenId) {
    // Masquer tous les écrans
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });

    // Afficher l'écran sélectionné
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
      
      // Mettre à jour le contenu
      const screenMap = {
        'home': '.home-screen',
        'map': '.map-screen',
        'sessions': '.sessions-screen',
        'catches': '.catches-screen',
        'profile': '.profile-screen'
      };

      const contentElement = screen.querySelector(screenMap[screenId]);
      if (contentElement) {
        contentElement.innerHTML = this.getScreenContent(screenId);
      }
    }

    // Mettre à jour la navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }

    // Réinitialiser le scroll
    const screenContent = document.querySelector('.screen-content');
    if (screenContent) {
      screenContent.scrollTop = 0;
    }

    this.currentScreen = screenId;
  },

  // Retourne le contenu d'un écran
  getScreenContent(screenId) {
    const generators = {
      'home': () => UIGenerator.generateHomeScreen(),
      'map': () => UIGenerator.generateMapScreen(),
      'sessions': () => UIGenerator.generateSessionsScreen(),
      'catches': () => UIGenerator.generateCatchesScreen(),
      'profile': () => UIGenerator.generateProfileScreen()
    };

    if (generators[screenId]) {
      return generators[screenId]();
    }
    return '';
  },

  // Menu d'ajout rapide
  showAddMenu() {
    const options = [
      { label: '+ Session', icon: '📅', action: 'addSession' },
      { label: '+ Prise', icon: '🐟', action: 'addCatch' },
      { label: '+ Spot', icon: '📍', action: 'addSpot' },
      { label: '+ Appât', icon: '🍞', action: 'addBait' },
      { label: '+ Note', icon: '📝', action: 'addNote' }
    ];

    let html = `
      <div class="add-menu-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000;" onclick="this.remove()">
        <div style="background: #1a3028; border: 2px solid var(--accent-red); border-radius: 16px; padding: 20px; width: 90%; max-width: 300px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);" onclick="event.stopPropagation()">
          <h3 style="color: var(--text-primary); margin-bottom: 16px; text-align: center; font-size: 16px;">Ajouter</h3>
          <div style="display: grid; gap: 8px;">
    `;

    options.forEach(opt => {
      html += `
        <button style="background: #14271f; border: 1px solid var(--border-color); color: var(--text-primary); padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#254136'; this.style.borderColor='var(--accent-red)'" onmouseout="this.style.background='#14271f'; this.style.borderColor='var(--border-color)'" onclick="Navigation.${opt.action}(); this.closest('.add-menu-overlay').remove()">
          <span style="font-size: 18px;">${opt.icon}</span>
          ${opt.label}
        </button>
      `;
    });

    html += `
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  },

  // Actions d'ajout
  addSession() {
    openAddSessionForm();
  },

  addCatch() {
    openAddCatchForm();
  },

  addSpot() {
    openAddSpotForm();
  },

  addBait() {
    openAddBaitForm();
  },

  addNote() {
    openAddNoteForm();
  },

  // Affiche les détails d'une session
  viewSessionDetails(sessionId) {
    const session = AppData.sessions.find(s => s.id === sessionId);
    if (session) {
      alert(`📋 ${session.name}\n\nLieu: ${session.location}\nPrises: ${session.catches}\nPoids: ${session.totalWeight} kg\nNotes: ${session.notes}`);
    }
  },

  // Affiche les détails d'une prise
  viewCatchDetails(catchId) {
    const catch_ = AppData.catches.find(c => c.id === catchId);
    if (catch_) {
      alert(`🐟 ${catch_.species}\n\nPoids: ${catch_.weight} kg\nLongueur: ${catch_.length} cm\nAppât: ${catch_.bait}\nMontage: ${catch_.rig}\nProfondeur: ${catch_.depth}m\nDistance: ${catch_.distance}m`);
    }
  },

  // Affiche les détails d'un spot
  viewSpotDetails(spotId) {
    const spot = AppData.spots.find(s => s.id === spotId);
    if (spot) {
      alert(`📍 ${spot.name}\n\nType: ${spot.type}\nProfondeur: ${spot.depth}m\nFond: ${spot.substrate}\nSessions: ${spot.sessions}\nPrises: ${spot.catches}\nPoids: ${spot.totalWeight} kg`);
    }
  },

  // Utilise le GPS
  useGPS() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(3);
          const lon = position.coords.longitude.toFixed(3);
          alert(`📍 Position GPS\n\nLatitude: ${lat}\nLongitude: ${lon}\n\nAjout du spot à cette position...`);
        },
        (error) => {
          alert('❌ Erreur GPS: ' + error.message);
        }
      );
    } else {
      alert('❌ GPS non disponible sur cet appareil');
    }
  }
};
