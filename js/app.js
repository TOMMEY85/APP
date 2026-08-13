// ============================================
// CARPZONE - Application Principale
// Point d'entrée de l'application
// ============================================

const App = {
  // Initialisation
  init() {
    console.log('🎣 CARPZONE - Initialisation de l\'application');
    
    // Charger les données
    console.log('📊 Données chargées:', AppData);
    
    // Initialiser la navigation
    Navigation.init();
    
    // Charger l'écran d'accueil
    this.loadHomeScreen();
    
    // Vérifier la compatibilité
    this.checkCompatibility();
    
    console.log('✅ CARPZONE - Prête');
  },

  // Charge l'écran d'accueil
  loadHomeScreen() {
    const homeScreen = document.querySelector('.home-screen');
    if (homeScreen) {
      homeScreen.innerHTML = UIGenerator.generateHomeScreen();
    }
  },

  // Recharge tous les écrans avec les nouvelles données
  reloadAllScreens() {
    Navigation.switchScreen(Navigation.currentScreen);
  },

  // Expose les fonctions pour onclick
  showAddMenu() {
    Navigation.showAddMenu();
  },

  viewSessionDetails(id) {
    Navigation.viewSessionDetails(id);
  },

  viewCatchDetails(id) {
    Navigation.viewCatchDetails(id);
  },

  viewSpotDetails(id) {
    Navigation.viewSpotDetails(id);
  },

  useGPS() {
    Navigation.useGPS();
  },

  useGPSForSpot() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latInput = document.querySelector('input[name="latitude"]');
          const lngInput = document.querySelector('input[name="longitude"]');
          if (latInput && lngInput) {
            latInput.value = position.coords.latitude.toFixed(6);
            lngInput.value = position.coords.longitude.toFixed(6);
            showNotification('Position trouvée ✓');
          }
        },
        () => showNotification('❌ GPS non disponible')
      );
    } else {
      showNotification('❌ GPS non disponible');
    }
  },

  showAddSpotMenu() {
    openAddSpotForm();
  },

  // Recharger la page actuelle après modification
  refreshCurrentScreen() {
    Navigation.switchScreen(Navigation.currentScreen);
  },

  // Vérification de compatibilité
  checkCompatibility() {
    const features = {
      geolocation: 'geolocation' in navigator,
      localStorage: typeof(Storage) !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator
    };

    console.log('📱 Compatibilité:', features);

    // Sauvegarder les données (optionnel)
    if (features.localStorage) {
      this.setupLocalStorage();
    }
  },

  // Configuration du stockage local
  setupLocalStorage() {
    try {
      const existingData = localStorage.getItem('carpzone_data');
      if (!existingData) {
        localStorage.setItem('carpzone_data', JSON.stringify(AppData));
        console.log('💾 Données sauvegardées localement');
      }
    } catch (e) {
      console.warn('⚠️ localStorage indisponible:', e);
    }
  },

  // Exporte les données
  exportData() {
    const dataStr = JSON.stringify(AppData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carpzone-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('📤 Données exportées');
  },

  // Importe des données
  importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        Object.assign(AppData, importedData);
        localStorage.setItem('carpzone_data', JSON.stringify(AppData));
        this.loadHomeScreen();
        alert('✅ Données importées avec succès');
        console.log('📥 Données importées');
      } catch (error) {
        alert('❌ Erreur lors de l\'import: ' + error.message);
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  },

  // Réinitialise les données
  resetData() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes les données?\nCette action est irréversible.')) {
      localStorage.removeItem('carpzone_data');
      location.reload();
    }
  },

  // Affiche les infos
  showInfo() {
    const info = `
CARPZONE v1.0
Analyse. Prépare. Capture.

Application de pêche à la carpe

Statistiques:
- Sessions: ${AppData.sessions.length}
- Prises: ${AppData.catches.length}
- Spots: ${AppData.spots.length}
- Appâts: ${AppData.baits.length}
- Montages: ${AppData.rigs.length}

Contact: contact@carpzone.app
www.carpzone.app
    `;
    alert(info);
  }
};

// Initialise l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
  console.error('❌ Erreur:', event.error);
});

// Prévention du zoom sur double-tap (mobile)
document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, false);

// Prévention du zoom au focus des inputs
document.addEventListener('touchmove', function(event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, false);

// Service Worker (pour PWA - optionnel)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {
    // Service Worker non disponible (normal en développement)
  });
}
