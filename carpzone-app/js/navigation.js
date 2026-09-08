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
    // Détruire Leaflet quand on quitte la carte, car les vues sont régénérées.
    if (this.currentScreen === 'map' && screenId !== 'map' &&
        typeof MapManager !== 'undefined' && MapManager.map) {
      MapManager.destroy();
    }

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

        if (screenId === 'map') {
          setTimeout(() => {
            try {
              const container = document.getElementById('map-container');
              if (!container) return;

              if (typeof L === 'undefined') {
                container.innerHTML = '<div style="padding:20px;color:#a6b5a9;text-align:center;">Carte indisponible : Leaflet ne s\'est pas chargé.</div>';
                return;
              }

              if (typeof MapManager !== 'undefined') {
                if (MapManager.map) MapManager.destroy();
                MapManager.init('map-container');
              }
            } catch (error) {
              console.error('Erreur initialisation carte:', error);
            }
          }, 100);
        }
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
    if (!session) return;

    const catches = typeof getSessionCatches === 'function' ? getSessionCatches(sessionId) : [];
    const totalWeight = catches.reduce((sum,c) => sum + (parseFloat(c.weight)||0), 0).toFixed(1);
    const catchesHtml = catches.length ? catches.map(c => `
      <div style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #254136;">
        ${c.photo ? `<img src="${c.photo}" style="width:56px;height:56px;border-radius:8px;object-fit:cover;">` : '<div style="width:56px;height:56px;border-radius:8px;background:#111;display:flex;align-items:center;justify-content:center;font-size:24px;">🐟</div>'}
        <div style="flex:1;">
          <div style="color:#fff;font-weight:700;">${c.species || 'Carpe'} — ${c.weight} kg</div>
          <div style="font-size:11px;color:#a6b5a9;">${c.date || ''} ${c.time || ''}</div>
          <div style="font-size:11px;color:#94a69b;">${c.bait || ''}</div>
        </div>
      </div>
    `).join('') : '<div style="color:#94a69b;padding:10px 0;">Aucune prise dans cette session.</div>';

    openModal(`📋 ${session.name}`, `
      <div style="display:grid;gap:10px;">
        <div style="color:#ccd4c8;">📍 ${session.location || ''}</div>
        <div style="display:flex;gap:8px;">
          <div style="flex:1;background:#111;padding:8px;border-radius:6px;text-align:center;"><b style="color:#b7cc85;">${catches.length}</b><div style="font-size:10px;color:#94a69b;">prises</div></div>
          <div style="flex:1;background:#111;padding:8px;border-radius:6px;text-align:center;"><b style="color:#b7cc85;">${totalWeight} kg</b><div style="font-size:10px;color:#94a69b;">poids total</div></div>
        </div>
        <div style="font-weight:700;color:#fff;">Poissons de la session</div>
        ${catchesHtml}
        <div style="display:flex;gap:8px;">
          ${session.status === 'active' ? `<button type="button" onclick="closeModal();setTimeout(()=>openAddCatchForm('${session.id}'),250)" style="flex:1;padding:10px;background:#b7cc85;color:#fff;border:none;border-radius:7px;">🐟 Ajouter une prise</button>` : ''}
          <button type="button" onclick="closeModal();setTimeout(()=>openEditSessionForm('${session.id}'),250)" style="flex:1;padding:10px;background:#181818;color:#fff;border:1px solid #b7cc85;border-radius:7px;">✏️ Modifier</button>
        </div>
      </div>
    `, () => true);

    const modalButtons = document.querySelectorAll('#modal-backdrop button');
    if (modalButtons.length >= 2) modalButtons[modalButtons.length - 2].style.display = 'none';
  },

  // Affiche les détails d'une prise
  viewCatchDetails(catchId) {
    const c = AppData.catches.find(c => c.id === catchId);
    if (!c) return;
    const session = c.sessionId ? AppData.sessions.find(s => s.id === c.sessionId) : null;
    openModal(`🐟 ${c.species || 'Prise'}`, `
      ${c.photo ? `<img src="${c.photo}" style="width:100%;max-height:280px;object-fit:cover;border-radius:10px;margin-bottom:12px;">` : ''}
      <div style="display:grid;gap:7px;color:#ccd4c8;font-size:13px;">
        <div><b style="color:#fff;">Poids :</b> ${c.weight} kg</div>
        <div><b style="color:#fff;">Longueur :</b> ${c.length || '—'} cm</div>
        <div><b style="color:#fff;">Session :</b> ${session ? session.name : 'Aucune'}</div>
        <div><b style="color:#fff;">Appât :</b> ${c.bait || '—'}</div>
        <div><b style="color:#fff;">Montage :</b> ${c.rig || '—'}</div>
      </div>
    `, () => true);

    const modalButtons = document.querySelectorAll('#modal-backdrop button');
    if (modalButtons.length >= 2) modalButtons[modalButtons.length - 2].style.display = 'none';
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
