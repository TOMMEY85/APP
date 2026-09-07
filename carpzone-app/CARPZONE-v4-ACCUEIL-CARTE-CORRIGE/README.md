# 🎣 CARPZONE - Application Mobile de Pêche à la Carpe

## À propos

**CARPZONE** est une application web progressive (PWA) professionnelle et moderne dédiée à la pêche de la carpe. Elle permet aux carpistes de gérer leurs sessions, enregistrer leurs prises, organiser leurs spots de pêche et analyser les conditions de pêche en temps réel.

**Slogan:** Analyse. Prépare. Capture.

### Caractéristiques

✅ Interface moderne noir/rouge/blanc premium  
✅ Optimisée pour mobile et tactile  
✅ Gestion complète des sessions de pêche  
✅ Carnet détaillé des prises  
✅ Carte interactive des spots  
✅ Données météo et indice d'activité  
✅ Système de badges et accomplissements  
✅ Responsive et rapide  
✅ Zéro dépendances externes (sauf Font Awesome pour les icônes)  
✅ Données locales (localStorage)  

---

## 📋 Structure du Projet

```
carpzone-app/
├── index.html              # Fichier HTML principal
├── README.md              # Ce fichier
├── package.json           # Métadonnées du projet
├── css/
│   ├── styles.css         # Variables et styles globaux
│   ├── phone-frame.css    # Styles du cadre téléphone
│   ├── screens.css        # Styles des écrans
│   ├── components.css     # Styles des composants
│   └── animations.css     # Animations et transitions
├── js/
│   ├── app.js            # Application principale
│   ├── navigation.js      # Gestion de la navigation
│   └── ui-generator.js    # Générateur d'interface
├── data/
│   └── app-data.js       # Données et état de l'application
└── assets/
    └── (images, icônes, etc.)
```

---

## 🚀 Installation & Lancement

### Option 1 : Lancer directement (Recommandé pour commencer)

1. **Téléchargez les fichiers**
   - Récupérez tous les fichiers du projet

2. **Ouvrez simplement `index.html`**
   - Double-cliquez sur `index.html` dans l'explorateur, OU
   - Faites glisser `index.html` dans votre navigateur

L'application se lancera immédiatement dans votre navigateur par défaut.

### Option 2 : Avec un serveur local (Recommandé pour le développement)

#### Avec Python 3 :
```bash
# Accédez au dossier du projet
cd carpzone-app

# Lancez le serveur
python -m http.server 8000

# Ouvrez dans le navigateur
# http://localhost:8000
```

#### Avec Python 2 :
```bash
python -m SimpleHTTPServer 8000
```

#### Avec Node.js :
```bash
# Installation de http-server (une seule fois)
npm install -g http-server

# Lancez le serveur
cd carpzone-app
http-server

# Ouvrez dans le navigateur
# http://localhost:8080
```

#### Avec PHP :
```bash
cd carpzone-app
php -S localhost:8000
```

#### Avec Live Server (VS Code) :
1. Installez l'extension "Live Server" dans VS Code
2. Faites clic-droit sur `index.html` → "Open with Live Server"

### Option 3 : Sur un vrai serveur web

Uploadez tous les fichiers sur votre serveur web (Apache, Nginx, etc.) et accédez via l'URL de votre site.

---

## 💻 Utilisation

### Navigation Principale

L'application utilise une barre de navigation inférieure avec 5 onglets :

| Onglet | Icône | Description |
|--------|-------|-------------|
| **Accueil** | 🏠 | Tableau de bord avec météo et statistiques |
| **Carte** | 🗺️ | Gestion des spots de pêche |
| **Sessions** | 📋 | Liste et gestion des sessions |
| **Prises** | 🐟 | Carnet des carpes capturées |
| **Profil** | 👤 | Profil pêcheur et badges |

### Bouton Central (+)

Cliquez sur le bouton rouge central pour :
- ➕ Ajouter une nouvelle session
- 🐟 Enregistrer une prise
- 📍 Ajouter un spot de pêche
- 🍞 Ajouter un appât
- 📝 Ajouter une note personnelle

### Écran d'Accueil

Affiche :
- Prochaine session programmée
- Conditions météo actuelles
- Phase lunaire
- **Indice d'activité de la carpe** (0-100)
- Dernières prises enregistrées
- Statistiques globales
- Badges débloqués

### Gestion des Données

Les données sont sauvegardées automatiquement dans le navigateur (localStorage).

**Exporter les données :**
```javascript
App.exportData()  // Dans la console du navigateur
```

**Importer les données :**
```javascript
// Créez un input file et sélectionnez un fichier JSON
App.importData(file)
```

**Réinitialiser les données :**
```javascript
App.resetData()  // Attention : irréversible !
```

---

## 🎨 Personnalisation

### Changer les couleurs

Éditez les variables CSS dans `css/styles.css` :

```css
:root {
  --primary-dark: #080808;      /* Fond principal */
  --accent-red: #D00000;         /* Couleur d'accent (rouge) */
  --text-primary: #ffffff;       /* Texte principal */
  /* ... autres variables */
}
```

### Modifier les données utilisateur

Éditez `data/app-data.js` et modifiez l'objet `AppData.user` :

```javascript
user: {
  name: 'Votre Nom',
  bio: 'Votre bio',
  avatar: '👤',
  // ...
}
```

### Ajouter des sessions/prises

Dans la console du navigateur :

```javascript
// Ajouter une nouvelle prise
AppData.addCatch({
  species: 'Carpe miroir',
  weight: 25.5,
  length: 75,
  location: 'Lac de Créteil',
  bait: 'Bouillette',
  rig: 'D-Rig'
});

// Ajouter une nouvelle session
AppData.addSession({
  name: 'Ma Session',
  location: 'Lac de mon choix'
});

// Ajouter un spot
AppData.addSpot({
  name: 'Nouveau Spot',
  type: 'Lac',
  latitude: 48.777,
  longitude: 2.434,
  depth: 4.5,
  distance: 35
});
```

---

## 🔧 Développement

### Architecture

L'application est construite en vanilla JavaScript sans framework :

- **`app-data.js`** : Gère les données et l'état global
- **`ui-generator.js`** : Génère le HTML pour chaque écran
- **`navigation.js`** : Gère la navigation et les interactions
- **`app.js`** : Point d'entrée et orchestration

### Ajouter une nouvelle fonctionnalité

1. **Ajouter les données** dans `app-data.js`
2. **Créer le générateur UI** dans `ui-generator.js`
3. **Connecter la navigation** dans `navigation.js`
4. **Ajouter le style CSS** dans `css/components.css`

### Déboguer

Ouvrez la console du navigateur (F12) :

```javascript
// Voir toutes les données
console.log(AppData);

// Voir les statistiques
console.log(AppData.getStatistics());

// Vérifier la session active
console.log(AppData.sessions.find(s => s.status === 'active'));
```

---

## 📱 Optimisations Mobile

L'application est fully optimisée pour mobile :

- ✅ Vue responsive
- ✅ Tactile-friendly (zones de clic 44px+)
- ✅ Lisible en plein soleil (interface sombre)
- ✅ Utilisable d'une seule main
- ✅ Pas de zoom involontaire
- ✅ Performance optimale

### Ajouter à l'écran d'accueil (iOS/Android)

1. Ouvrez l'application dans un navigateur mobile
2. Cliquez le menu de partage
3. Sélectionnez "Ajouter à l'écran d'accueil"

---

## 🌐 Fichiers Serveur (Optionnel)

### `.htaccess` (Apache)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### `web.config` (IIS)

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="main" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

## 🔐 Confidentialité & Sécurité

- **Données locales** : Toutes les données sont stockées localement dans le navigateur
- **Pas de serveur** : Aucune donnée n'est envoyée à un serveur
- **Spots privés** : Les coordonnées GPS restent privées par défaut
- **Compatible RGPD** : Aucune collecte de données personnelles

---

## 🐛 Dépannage

### L'application ne se charge pas

**Solution :**
- Assurez-vous que tous les fichiers CSS et JS sont présents
- Vérifiez la console (F12) pour les erreurs
- Rafraîchissez la page (Ctrl+R)
- Videz le cache (Ctrl+Shift+R)

### Les icônes ne s'affichent pas

**Solution :**
- Font Awesome doit être chargé depuis CDN
- Vérifiez votre connexion Internet
- Vérifiez que le lien CDN n'est pas bloqué

### Les données ne se sauvegardent pas

**Solution :**
- localStorage doit être activé dans votre navigateur
- Vérifiez les paramètres de confidentialité du navigateur
- En mode navigation privée, localStorage est désactivé

### Performance lente

**Solution :**
- Fermez les autres onglets
- Videz le cache du navigateur
- Redémarrez le navigateur
- Mettez à jour votre navigateur

---

## 📊 Statistiques

L'application inclut 5 écrans fonctionnels avec :

- 43 prises enregistrées (données de démo)
- 28 sessions
- 4 spots de pêche
- 8 badges débloqués
- Toutes les fonctionnalités complètement intégrées

---

## 🎯 Roadmap Future

- [ ] Synchronisation cloud (Google Drive, Dropbox)
- [ ] Partage de sessions et statistiques
- [ ] Graphiques avancés
- [ ] Notifications push
- [ ] Mode hors ligne amélioré
- [ ] Export PDF et images
- [ ] Integration caméra (photos de prises)
- [ ] API de météo en temps réel
- [ ] Base de données utilisateurs
- [ ] Application native (Cordova/React Native)

---

## 📝 Licence

CARPZONE est fourni à titre d'exemple éducatif et professionnel.

---

## 👨‍💻 Créé par

**CARPZONE Development**  
Application créée en août 2024

**Contacts & Support :**
- 📧 Email: contact@carpzone.app
- 🌐 Site: www.carpzone.app
- 📱 Instagram: @carpzone_app

---

## 🎣 Pour les Carpistes

> « Analyse. Prépare. Capture. »
>
> Que vous soyez un carpiste débutant ou expérimenté, CARPZONE vous aide à :
> - Suivre vos sessions et vos prises
> - Analyser les conditions de pêche
> - Gérer vos spots et appâts
> - Progresser et battre vos records

Bonne pêche ! 🎣✨

---

## Changelog

### v1.0 (Août 2024)
- ✅ Interface complète et fonctionnelle
- ✅ 5 écrans principaux
- ✅ Gestion des sessions, prises, spots
- ✅ Indice d'activité de la carpe
- ✅ Système de badges
- ✅ Design premium noir/rouge

---

**Dernière mise à jour** : Août 2024
