// ============================================
// CARPZONE - Gestion du Profil
// ============================================

const ProfileManager = {
  // Profil par défaut
  defaults: {
    firstName: 'Olivier',
    lastName: 'Mercier',
    username: 'olivier_carpiste',
    bio: 'Carpiste passionné • Île-de-France',
    joinDate: '2022-01-15',
    avatar: '👤'
  },

  // Charger le profil depuis localStorage
  load() {
    const saved = localStorage.getItem('carpzone_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Erreur chargement profil:', e);
      }
    }
    return { ...this.defaults };
  },

  // Sauvegarder le profil
  save(profile) {
    try {
      localStorage.setItem('carpzone_profile', JSON.stringify(profile));
      console.log('✓ Profil sauvegardé');
      return true;
    } catch (e) {
      console.error('Erreur sauvegarde profil:', e);
      return false;
    }
  },

  // Mettre à jour le profil
  update(updates) {
    const profile = this.load();
    const updated = { ...profile, ...updates };
    this.save(updated);
    return updated;
  },

  // Obtenir le prénom (pour affichage dans accueil)
  getFirstName() {
    return this.load().firstName;
  },

  // Ouvrir le formulaire de modification
  openEditForm() {
    const profile = this.load();
    
    const content = `
      <form style="display: grid; gap: 12px;">
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Prénom</label>
          <input type="text" name="firstName" value="${profile.firstName}" placeholder="Prénom" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
        </div>
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Nom</label>
          <input type="text" name="lastName" value="${profile.lastName}" placeholder="Nom" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
        </div>
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Pseudo</label>
          <input type="text" name="username" value="${profile.username}" placeholder="Pseudo" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
        </div>
        
        <div>
          <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Bio</label>
          <textarea name="bio" placeholder="Bio courte" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff; min-height: 60px; resize: none;">${profile.bio}</textarea>
        </div>
      </form>
    `;
    
    openModal('✏️ Modifier le profil', content, (data) => {
      ProfileManager.update({
        firstName: data.firstName || profile.firstName,
        lastName: data.lastName || profile.lastName,
        username: data.username || profile.username,
        bio: data.bio || profile.bio
      });
      showNotification('Profil mis à jour ✓');
      
      // Recharger l'écran d'accueil
      if (Navigation.currentScreen === 'home') {
        Navigation.switchScreen('home');
      }
      
      return true;
    });
  }
};

// Charger le profil au démarrage
let UserProfile = ProfileManager.load();
