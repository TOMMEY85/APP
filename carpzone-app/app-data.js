// ============================================
// CARPZONE - Gestion des Données
// Avec localStorage et CRUD complets
// ============================================

const DataManager = {
  STORAGE_KEY: 'carpzone_data',

  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erreur localStorage:', e);
    }
    return this.getDefaultData();
  },

  save(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log('✅ Données sauvegardées');
      return true;
    } catch (e) {
      console.error('❌ Erreur sauvegarde:', e);
      return false;
    }
  },

  getDefaultData() {
    return {
      user: {
        id: 'user_001',
        name: 'Olivier Mercier',
        username: 'olivier_carpiste',
        avatar: '👤',
        bio: 'Carpiste passionné • Île-de-France',
        joinDate: '2022-01-15',
        stats: {
          totalSessions: 0,
          totalCatches: 0,
          totalWeight: 0,
          personalRecord: 0,
          favoriteLake: ''
        }
      },
      sessions: [],
      catches: [],
      spots: [],
      baits: [],
      rigs: [
        { id: 'rig_001', name: 'D-Rig', description: 'Montage polyvalent' },
        { id: 'rig_002', name: 'Spinner Rig', description: 'Montage tournant' },
        { id: 'rig_003', name: 'Ronnie Rig', description: 'Montage agressif' },
        { id: 'rig_004', name: 'Chod Rig', description: 'Pour fonds mous' }
      ],
      notes: [],
      badges: [
        { id: 'badge_001', name: 'Première carpe', emoji: '🎣', unlocked: false },
        { id: 'badge_002', name: '10 carpes', emoji: '🐟', unlocked: false },
        { id: 'badge_003', name: '50 carpes', emoji: '🏆', unlocked: false },
        { id: 'badge_004', name: 'Centenaire', emoji: '👑', unlocked: false },
        { id: 'badge_005', name: 'Monster Fish', emoji: '🌟', unlocked: false },
        { id: 'badge_006', name: 'Super Monster', emoji: '💎', unlocked: false },
        { id: 'badge_007', name: 'Nuit blanche', emoji: '⚡', unlocked: false },
        { id: 'badge_008', name: 'Fire Warrior', emoji: '🔥', unlocked: false }
      ],
      settings: {
        units: { weight: 'kg', temperature: '°C', distance: 'm' },
        notifications: { sessionReminder: true, catchAlert: true },
        privacy: { spotCoordinatesPrivate: true },
        display: { darkMode: true, language: 'fr' }
      }
    };
  }
};

// Initialiser AppData
let AppData = DataManager.load();

// Sauvegarder les données
function saveAppData() {
  DataManager.save(AppData);
}

// ============================================
// CRUD - SESSIONS
// ============================================

function addSession(sessionData) {
  const newSession = {
    id: 'session_' + Date.now(),
    ...sessionData,
    status: 'active',
    catches: 0,
    totalWeight: 0,
    createdAt: new Date().toISOString()
  };
  AppData.sessions.unshift(newSession);
  saveAppData();
  updateStatistics();
  showNotification('Session enregistrée ✓');
  return newSession;
}

function updateSession(id, sessionData) {
  const session = AppData.sessions.find(s => s.id === id);
  if (session) {
    Object.assign(session, sessionData);
    saveAppData();
    showNotification('Session mise à jour ✓');
    return session;
  }
  return null;
}

function deleteSession(id) {
  const index = AppData.sessions.findIndex(s => s.id === id);
  if (index !== -1) {
    AppData.sessions.splice(index, 1);
    saveAppData();
    updateStatistics();
    showNotification('Session supprimée ✓');
    return true;
  }
  return false;
}

// ============================================
// CRUD - PRISES
// ============================================

function addCatch(catchData) {
  const newCatch = {
    id: 'catch_' + Date.now(),
    ...catchData,
    createdAt: new Date().toISOString()
  };
  AppData.catches.unshift(newCatch);
  
  if (newCatch.weight > (AppData.user.stats.personalRecord || 0)) {
    AppData.user.stats.personalRecord = newCatch.weight;
  }
  
  saveAppData();
  updateStatistics();
  updateBadges();
  showNotification('Prise enregistrée ✓');
  return newCatch;
}

function updateCatch(id, catchData) {
  const catchItem = AppData.catches.find(c => c.id === id);
  if (catchItem) {
    Object.assign(catchItem, catchData);
    if (catchData.weight && catchData.weight > (AppData.user.stats.personalRecord || 0)) {
      AppData.user.stats.personalRecord = catchData.weight;
    }
    saveAppData();
    updateStatistics();
    showNotification('Prise mise à jour ✓');
    return catchItem;
  }
  return null;
}

function deleteCatch(id) {
  const index = AppData.catches.findIndex(c => c.id === id);
  if (index !== -1) {
    AppData.catches.splice(index, 1);
    saveAppData();
    updateStatistics();
    showNotification('Prise supprimée ✓');
    return true;
  }
  return false;
}

// ============================================
// CRUD - SPOTS
// ============================================

function addSpot(spotData) {
  const newSpot = {
    id: 'spot_' + Date.now(),
    ...spotData,
    sessions: 0,
    catches: 0,
    totalWeight: 0,
    createdAt: new Date().toISOString()
  };
  AppData.spots.push(newSpot);
  saveAppData();
  showNotification('Spot enregistré ✓');
  return newSpot;
}

function updateSpot(id, spotData) {
  const spot = AppData.spots.find(s => s.id === id);
  if (spot) {
    Object.assign(spot, spotData);
    saveAppData();
    showNotification('Spot mis à jour ✓');
    return spot;
  }
  return null;
}

function deleteSpot(id) {
  const index = AppData.spots.findIndex(s => s.id === id);
  if (index !== -1) {
    AppData.spots.splice(index, 1);
    saveAppData();
    showNotification('Spot supprimé ✓');
    return true;
  }
  return false;
}

// ============================================
// CRUD - APPÂTS
// ============================================

function addBait(baitData) {
  const newBait = {
    id: 'bait_' + Date.now(),
    ...baitData,
    createdAt: new Date().toISOString()
  };
  AppData.baits.push(newBait);
  saveAppData();
  showNotification('Appât enregistré ✓');
  return newBait;
}

function updateBait(id, baitData) {
  const bait = AppData.baits.find(b => b.id === id);
  if (bait) {
    Object.assign(bait, baitData);
    saveAppData();
    showNotification('Appât mis à jour ✓');
    return bait;
  }
  return null;
}

function deleteBait(id) {
  const index = AppData.baits.findIndex(b => b.id === id);
  if (index !== -1) {
    AppData.baits.splice(index, 1);
    saveAppData();
    showNotification('Appât supprimé ✓');
    return true;
  }
  return false;
}

// ============================================
// CRUD - NOTES
// ============================================

function addNote(noteData) {
  const newNote = {
    id: 'note_' + Date.now(),
    ...noteData,
    date: new Date().toISOString()
  };
  AppData.notes.unshift(newNote);
  saveAppData();
  showNotification('Note enregistrée ✓');
  return newNote;
}

function deleteNote(id) {
  const index = AppData.notes.findIndex(n => n.id === id);
  if (index !== -1) {
    AppData.notes.splice(index, 1);
    saveAppData();
    showNotification('Note supprimée ✓');
    return true;
  }
  return false;
}

// ============================================
// STATISTIQUES
// ============================================

function updateStatistics() {
  const totalCatches = AppData.catches.length;
  const totalWeight = AppData.catches.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
  
  AppData.user.stats.totalSessions = AppData.sessions.length;
  AppData.user.stats.totalCatches = totalCatches;
  AppData.user.stats.totalWeight = parseFloat(totalWeight.toFixed(1));
  
  if (totalCatches > 0) {
    AppData.user.stats.personalRecord = Math.max(...AppData.catches.map(c => parseFloat(c.weight) || 0));
  }
  
  saveAppData();
}

function getStatistics() {
  const totalCatches = AppData.catches.length;
  const totalWeight = AppData.catches.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
  const avgWeight = totalCatches > 0 ? (totalWeight / totalCatches).toFixed(1) : 0;
  const personalRecord = totalCatches > 0 ? Math.max(...AppData.catches.map(c => parseFloat(c.weight) || 0)).toFixed(1) : 0;
  
  return {
    totalSessions: AppData.sessions.length,
    totalCatches,
    totalWeight: totalWeight.toFixed(1),
    averageWeight: avgWeight,
    personalRecord
  };
}

// ============================================
// BADGES
// ============================================

function updateBadges() {
  const totalCatches = AppData.catches.length;
  const personalRecord = AppData.user.stats.personalRecord || 0;
  
  if (totalCatches >= 1) {
    const badge = AppData.badges.find(b => b.id === 'badge_001');
    if (badge) badge.unlocked = true;
  }
  if (totalCatches >= 10) {
    const badge = AppData.badges.find(b => b.id === 'badge_002');
    if (badge) badge.unlocked = true;
  }
  if (totalCatches >= 50) {
    const badge = AppData.badges.find(b => b.id === 'badge_003');
    if (badge) badge.unlocked = true;
  }
  if (totalCatches >= 100) {
    const badge = AppData.badges.find(b => b.id === 'badge_004');
    if (badge) badge.unlocked = true;
  }
  if (personalRecord >= 10) {
    const badge = AppData.badges.find(b => b.id === 'badge_005');
    if (badge) badge.unlocked = true;
  }
  if (personalRecord >= 15) {
    const badge = AppData.badges.find(b => b.id === 'badge_006');
    if (badge) badge.unlocked = true;
  }
  
  saveAppData();
}
