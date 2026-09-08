// ============================================
// CARPZONE - Authentification + sauvegarde cloud Supabase
// ============================================

const SupabaseConfig = {
  url: "https://qlircjuawebmrowvtfkv.supabase.co",
  publishableKey: "sb_publishable_modZRoN50Pu_9LzSyCUovw_nNuFtRTD"
};

const CloudManager = {
  client: null,
  user: null,
  syncTimer: null,
  syncing: false,
  lastSyncAt: null,

  initClient() {
    if (this.client) return this.client;
    if (!window.supabase || !window.supabase.createClient) {
      console.warn('Supabase JS non chargé');
      return null;
    }
    this.client = window.supabase.createClient(
      SupabaseConfig.url,
      SupabaseConfig.publishableKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
    return this.client;
  },

  async init() {
    const client = this.initClient();
    if (!client) return;

    const { data } = await client.auth.getSession();
    this.user = data?.session?.user || null;

    client.auth.onAuthStateChange(async (event, session) => {
      this.user = session?.user || null;

      if (event === 'SIGNED_IN' && this.user) {
        await this.loadOrMigrate();
      }

      if (typeof App !== 'undefined') {
        setTimeout(() => App.reloadAllScreens(), 50);
      }
    });

    if (this.user) {
      await this.loadOrMigrate();
    }
  },

  isLoggedIn() {
    return !!this.user;
  },

  getEmail() {
    return this.user?.email || '';
  },

  async signUp(email, password) {
    const client = this.initClient();
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw error;

    if (data?.session) {
      this.user = data.session.user;
      await this.loadOrMigrate();
      return { confirmed: true };
    }

    return { confirmed: false };
  },

  async signIn(email, password) {
    const client = this.initClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.user = data.user;
    await this.loadOrMigrate();
    return data;
  },

  async signOut() {
    const client = this.initClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
    this.user = null;
    if (typeof showNotification === 'function') showNotification('Déconnecté ✓');
    if (typeof App !== 'undefined') App.reloadAllScreens();
  },

  async resetPassword(email) {
    const client = this.initClient();
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  },

  async loadOrMigrate() {
    if (!this.user) return;

    const client = this.initClient();
    const { data, error } = await client
      .from('carpzone_user_data')
      .select('payload, updated_at')
      .eq('user_id', this.user.id)
      .maybeSingle();

    if (error) {
      console.error('Chargement cloud:', error);
      return;
    }

    if (!data) {
      // Première connexion : on envoie les données déjà présentes sur cet appareil.
      await this.syncNow();
      if (typeof showNotification === 'function') {
        showNotification('Données actuelles sauvegardées dans votre compte ☁️');
      }
      return;
    }

    if (data.payload && typeof data.payload === 'object') {
      AppData = data.payload;
      DataManager.save(AppData);
      if (typeof recalculateSessionStats === 'function') recalculateSessionStats();
      this.lastSyncAt = data.updated_at ? new Date(data.updated_at) : new Date();

      if (typeof App !== 'undefined') {
        App.loadHomeScreen();
        App.reloadAllScreens();
      }
    }
  },

  scheduleSync(delay = 900) {
    if (!this.user) return;
    clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => this.syncNow(), delay);
  },

  async syncNow() {
    if (!this.user || this.syncing) return false;

    const client = this.initClient();
    this.syncing = true;

    try {
      const row = {
        user_id: this.user.id,
        payload: AppData,
        updated_at: new Date().toISOString()
      };

      const { error } = await client
        .from('carpzone_user_data')
        .upsert(row, { onConflict: 'user_id' });

      if (error) throw error;

      this.lastSyncAt = new Date();
      if (typeof showNotification === 'function') {
        showNotification('Synchronisation cloud ✓');
      }
      return true;
    } catch (error) {
      console.error('Synchronisation cloud:', error);
      if (typeof showNotification === 'function') {
        showNotification('Sauvegarde locale OK • cloud indisponible');
      }
      return false;
    } finally {
      this.syncing = false;
    }
  },

  getStatusLabel() {
    if (!this.user) return 'Non connecté';
    if (!this.lastSyncAt) return 'Connecté • synchronisation en attente';
    const mins = Math.floor((Date.now() - this.lastSyncAt.getTime()) / 60000);
    if (mins < 1) return 'Synchronisé à l’instant';
    if (mins < 60) return `Synchronisé il y a ${mins} min`;
    return 'Synchronisé';
  }
};

function openAccountModal(mode = 'signin') {
  const isSignup = mode === 'signup';

  const content = `
    <form style="display:grid;gap:12px;">
      <div style="text-align:center;margin-bottom:4px;">
        <div style="font-size:30px;">🎣</div>
        <div style="font-weight:800;font-size:18px;">CARPZONE</div>
        <div style="font-size:11px;color:#888;">${isSignup ? 'Créer votre compte' : 'Connexion à votre compte'}</div>
      </div>

      <div>
        <label style="display:block;color:#a6b5a9;font-size:12px;margin-bottom:4px;">Email</label>
        <input type="email" name="email" required autocomplete="email"
          style="width:100%;padding:11px;background:#14271f;color:#fff;border:1px solid #365046;border-radius:7px;">
      </div>

      <div>
        <label style="display:block;color:#a6b5a9;font-size:12px;margin-bottom:4px;">Mot de passe</label>
        <input type="password" name="password" required minlength="6"
          autocomplete="${isSignup ? 'new-password' : 'current-password'}"
          style="width:100%;padding:11px;background:#14271f;color:#fff;border:1px solid #365046;border-radius:7px;">
        <small style="color:#94a69b;">6 caractères minimum.</small>
      </div>

      <div style="font-size:11px;color:#94a69b;line-height:1.4;">
        Vos sessions, prises, spots, appâts et réglages pourront être retrouvés après connexion sur un autre appareil.
      </div>
    </form>

    <div style="margin-top:12px;text-align:center;">
      <button type="button"
        onclick="closeModal();setTimeout(()=>openAccountModal('${isSignup ? 'signin' : 'signup'}'),250)"
        style="background:none;border:none;color:#b7cc85;font-size:12px;cursor:pointer;">
        ${isSignup ? 'Déjà un compte ? Se connecter' : 'Pas encore de compte ? Créer un compte'}
      </button>
      ${!isSignup ? `
        <button type="button" onclick="AccountUI.forgotPassword()"
          style="display:block;width:100%;margin-top:8px;background:none;border:none;color:#888;font-size:11px;cursor:pointer;">
          Mot de passe oublié
        </button>
      ` : ''}
    </div>
  `;

  openModal(isSignup ? 'Créer un compte' : 'Se connecter', content, async (data) => {
    try {
      if (isSignup) {
        const result = await CloudManager.signUp(data.email.trim(), data.password);
        if (result.confirmed) {
          showNotification('Compte créé et connecté ✓');
        } else {
          showNotification('Compte créé • vérifiez votre email');
        }
      } else {
        await CloudManager.signIn(data.email.trim(), data.password);
        showNotification('Connexion réussie ✓');
      }
      return true;
    } catch (error) {
      console.error(error);
      showNotification(error.message || 'Erreur de connexion');
      return false;
    }
  });
}

const AccountUI = {
  openSignIn() { openAccountModal('signin'); },
  openSignUp() { openAccountModal('signup'); },

  async forgotPassword() {
    const email = prompt('Adresse email de votre compte CARPZONE :');
    if (!email) return;
    try {
      await CloudManager.resetPassword(email.trim());
      showNotification('Email de réinitialisation envoyé ✓');
    } catch (error) {
      console.error(error);
      showNotification(error.message || 'Impossible d’envoyer l’email');
    }
  },

  async syncNow() {
    await CloudManager.syncNow();
    if (typeof App !== 'undefined') App.reloadAllScreens();
  },

  async signOut() {
    if (confirm('Se déconnecter de CARPZONE ?')) {
      await CloudManager.signOut();
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  CloudManager.init().catch(err => console.error('Initialisation Supabase:', err));
});
