# CARPZONE PWA - Guide de déploiement sur Netlify + GitHub

## 🎯 Objectif Final

```
GitHub (Code Source)
    ↓
Netlify (Déploiement automatique)
    ↓
Safari iPhone → Ajouter à l'écran d'accueil
    ↓
CARPZONE installée comme application native
```

---

## 📋 Prérequis

- ✅ Compte GitHub (gratuit)
- ✅ Compte Netlify (gratuit, lié à GitHub)
- ✅ Git installé localement
- ✅ Dossier carpzone-pwa avec tous les fichiers

---

## 🚀 Étape 1 : Créer le dépôt GitHub

### 1.1 Sur GitHub.com

1. Allez sur **github.com** → Connectez-vous
2. Cliquez **"+"** → **"New repository"**
3. Nom du dépôt : `carpzone` (ou ce que vous voulez)
4. Description : `CARPZONE - Application PWA de pêche à la carpe`
5. **Public** (important pour Netlify gratuit)
6. ✅ Cliquez **"Create repository"**

### 1.2 Sur votre ordinateur (Terminal/PowerShell)

```bash
# Allez dans le dossier carpzone-pwa
cd /chemin/vers/carpzone-pwa

# Initialiser Git
git init

# Ajouter GitHub comme remote
git remote add origin https://github.com/VOTRE_USERNAME/carpzone.git

# Exemple réel:
# git remote add origin https://github.com/dupont-francois/carpzone.git

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit: CARPZONE PWA"

# Envoyer sur GitHub
git branch -M main
git push -u origin main
```

---

## 🔗 Étape 2 : Connecter Netlify à GitHub

### 2.1 Sur Netlify.com

1. Allez sur **netlify.com** → Connectez-vous (ou créez un compte)
2. Cliquez **"Add new site"** → **"Connect to Git"**
3. Choisissez **GitHub**
4. Autorisez Netlify à accéder à votre GitHub
5. Sélectionnez votre dépôt `carpzone`

### 2.2 Configuration de Netlify

**Build settings:**
- **Base directory:** (laisser vide)
- **Build command:** (laisser vide - pas de build)
- **Publish directory:** `./` (la racine)

**Ou plus simplement:**
- Laissez tout vide (Netlify lira netlify.toml automatiquement)

Cliquez **"Deploy"**

---

## ⏳ Étape 3 : Attendre le déploiement

Netlify va:
1. ✅ Cloner votre dépôt
2. ✅ Lire netlify.toml
3. ✅ Déployer les fichiers
4. ✅ Générer une URL (environ 30 secondes)

Vous verrez: `https://XXXX.netlify.app`

---

## 📱 Étape 4 : Tester sur iPhone

### 4.1 Sur un vrai iPhone

1. Ouvrez **Safari** sur l'iPhone
2. Allez à: `https://XXXX.netlify.app`
3. Attendez que la page se charge
4. Tapez l'icône **Partager** (carré avec flèche)
5. Tapez **"Ajouter à l'écran d'accueil"**
6. Donnez un nom (CARPZONE)
7. Tapez **"Ajouter"**
8. L'app apparaît sur votre écran d'accueil !
9. Tapez l'icône CARPZONE → App lancée en plein écran

### 4.2 Vérifications

- ✅ Pas de barre d'adresse Safari visible
- ✅ Barre de statut noire
- ✅ Navigation CARPZONE visible
- ✅ Tous les boutons répondent
- ✅ Les données persistent
- ✅ Fonctionne hors ligne (après visite)

---

## 🔄 Étape 5 : Mises à jour futures

Chaque fois que vous modifiez le code:

```bash
# 1. Faire vos modifications
# (modifier des fichiers JavaScript, CSS, etc.)

# 2. Ajouter les changements
git add .

# 3. Faire un commit
git commit -m "Description de la modification"

# 4. Envoyer sur GitHub
git push

# 5. Netlify redéploie automatiquement (30 sec)
# Vérifiez: https://app.netlify.com/sites/votre-site/deploys

# 6. Sur iPhone: Actualisez Safari (tirez vers le bas)
# ou fermez/rouvrez l'app installée
```

---

## ⚙️ Fichiers importants

| Fichier | Rôle |
|---------|------|
| `index.html` | Point d'entrée (doit être à la racine) |
| `manifest.webmanifest` | Configuration PWA |
| `sw.js` | Service Worker (cache et offline) |
| `netlify.toml` | Configuration Netlify |
| `_redirects` | Redirects SPA |
| `assets/icons/*.png` | Icônes PWA/iOS |
| `css/` | Styles |
| `js/` | JavaScript |
| `data/` | Données |

---

## 🐛 Dépannage

### L'app ne s'installe pas sur iPhone

**Cause:** Pas HTTPS (Netlify fourni automatiquement ✓)
**Cause:** Manifest invalide
→ Ouvrez console (F12) → Cherchez les erreurs

### Les données ne persistent pas

**Cause:** Service Worker non mis en cache
**Vérifier:** F12 → Application → Service Workers
→ Doit être "active" et "registered"

### La page affiche 404

**Cause:** _redirects non configuré
**Solution:** Vérifiez que `_redirects` est à la racine
**Ou:** netlify.toml mal formé

### Netlify ne trouve pas les fichiers

**Cause:** Mauvais "Publish directory"
**Solution:** Doit être `./` (racine du dépôt)

---

## 📊 Vérifier le déploiement

1. Allez sur **app.netlify.com**
2. Cliquez sur votre site
3. Onglet **"Deploys"** → Dernier déploiement
4. Status = **"Published"** ✅
5. Cliquez **"Preview"** pour tester

---

## 🔐 Domain personnalisé (optionnel)

Si vous voulez `https://carpzone.com` au lieu de `https://xxx.netlify.app`:

1. Achetez un domaine (Namecheap, OVH, Google Domains...)
2. Sur Netlify: **Site settings** → **Domain settings**
3. Cliquez **"Add custom domain"**
4. Suivez les instructions pour pointer vers Netlify

---

## 📈 Performances

Netlify fournit automatiquement:
- ✅ HTTPS/SSL
- ✅ CDN global
- ✅ Compression automatique
- ✅ Cache intelligent

CARPZONE chargera très rapidement partout dans le monde!

---

## 💡 Bonus: GitHub Pages (alternative)

Vous pouvez aussi déployer directement sur GitHub Pages:

```bash
# Sur votre compte GitHub:
# 1. Allez sur Settings → Pages
# 2. Source: Branch "main"
# 3. Folder: "/ (root)"
# 4. Save

# L'app sera disponible à:
# https://VOTRE_USERNAME.github.io/carpzone/

# (Note: sans Netlify, moins de flexibilité)
```

---

## 🎉 Voilà !

Vous avez une **PWA CARPZONE** :
- ✅ Hébergée sur Netlify
- ✅ Accessible en HTTPS
- ✅ Installable sur iPhone
- ✅ Fonctionne hors ligne
- ✅ Se met à jour automatiquement depuis GitHub

**Prêt à la pêche ! 🎣**

---

## 📞 Aide supplémentaire

- Docs Netlify: https://docs.netlify.com/
- PWA Docs: https://web.dev/progressive-web-apps/
- iOS PWA: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
