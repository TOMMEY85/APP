# 📖 GUIDE D'INSTALLATION - CARPZONE

Vous trouverez ci-dessous les instructions détaillées pour lancer CARPZONE sur votre PC, Mac ou Linux.

---

## 🪟 WINDOWS

### Méthode 1 : Double-cliquer sur le fichier (Le plus simple)

1. **Ouvrez** le dossier `carpzone-app`
2. **Double-cliquez** sur `index.html`
3. ✅ L'app s'ouvre automatiquement dans votre navigateur par défaut

**C'est tout !**

### Méthode 2 : Utilisez le script batch (Recommandé)

1. **Double-cliquez** sur `INSTALLER_WINDOWS.bat`
2. Une fenêtre de terminal s'ouvre
3. Copiez l'URL : `http://localhost:8000`
4. Ouvrez-la dans votre navigateur
5. Appuyez sur Ctrl+C pour arrêter

**Prérequis** : Python 3 doit être installé et dans le PATH
- Téléchargez Python : https://www.python.org/downloads/
- **Important** : Cochez "Add Python to PATH" lors de l'installation
- Redémarrez votre PC après l'installation de Python

### Méthode 3 : Manuel avec invite de commande

1. **Ouvrez** l'invite de commande (Win+R → `cmd`)
2. **Allez** dans le dossier :
   ```cmd
   cd C:\chemin\vers\carpzone-app
   ```
3. **Lancez** le serveur :
   ```cmd
   python -m http.server 8000
   ```
4. **Ouvrez** : http://localhost:8000

### Méthode 4 : Avec VS Code

1. **Ouvrez** VS Code
2. **Installez** l'extension "Live Server"
3. **Ouvrez** le dossier `carpzone-app`
4. **Clic-droit** sur `index.html` → "Open with Live Server"

---

## 🍎 MAC

### Méthode 1 : Double-cliquer (Le plus simple)

1. **Ouvrez** le dossier `carpzone-app`
2. **Double-cliquez** sur `index.html`
3. ✅ L'app s'ouvre dans Safari (ou votre navigateur par défaut)

**C'est tout !**

### Méthode 2 : Utilisez le script shell

1. **Double-cliquez** sur `demarrer.sh`
2. Ou **terminal** : `./demarrer.sh`
3. Copiez l'URL : `http://localhost:8000`
4. Ouvrez-la dans votre navigateur Safari ou Chrome
5. Appuyez sur Ctrl+C pour arrêter

### Méthode 3 : Terminal manuel

1. **Ouvrez** Terminal (Cmd+Espace → tapez "Terminal")
2. **Allez** dans le dossier :
   ```bash
   cd /chemin/vers/carpzone-app
   ```
3. **Lancez** le serveur :
   ```bash
   python3 -m http.server 8000
   ```
4. **Ouvrez** : http://localhost:8000

### Méthode 4 : Avec VS Code

1. **Ouvrez** VS Code (ou installez depuis App Store)
2. **Installez** l'extension "Live Server"
3. **Ouvrez** le dossier `carpzone-app`
4. **Clic-droit** sur `index.html` → "Open with Live Server"

---

## 🐧 LINUX

### Méthode 1 : Double-cliquer (Le plus simple)

1. **Ouvrez** le dossier `carpzone-app` (Nautilus/Dolphin)
2. **Double-cliquez** sur `index.html`
3. ✅ L'app s'ouvre dans votre navigateur par défaut (Firefox, Chrome, etc.)

**C'est tout !**

### Méthode 2 : Utilisez le script shell

1. **Terminal** : `cd carpzone-app && ./demarrer.sh`
2. Copiez l'URL : `http://localhost:8000`
3. Ouvrez-la dans votre navigateur
4. Appuyez sur Ctrl+C pour arrêter

### Méthode 3 : Terminal manuel

1. **Terminal** : 
   ```bash
   cd chemin/vers/carpzone-app
   python3 -m http.server 8000
   ```
2. **Ouvrez** : http://localhost:8000

### Méthode 4 : Avec VS Code

1. **Installez** : `sudo snap install --classic code`
2. **Ouvrez** VS Code
3. **Installez** l'extension "Live Server"
4. **Ouvrez** le dossier `carpzone-app`
5. **Clic-droit** sur `index.html` → "Open with Live Server"

---

## 🌐 SERVEUR DISTANT

### Hébergement sur un serveur web

1. **Connectez-vous** à votre serveur (FTP/SFTP)
2. **Uploadez** tous les fichiers du dossier `carpzone-app`
3. **Ouvrez** : `http://votresite.com/carpzone-app`

### Avec Heroku (Gratuit)

```bash
# 1. Installer Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Créer une app
heroku create mon-carpzone

# 3. Déployer
git push heroku main

# 4. Ouvrir
heroku open
```

### Avec Netlify (Gratuit)

1. Connectez-vous sur https://netlify.com
2. Glissez-déposez le dossier `carpzone-app`
3. ✅ C'est déployé !

### Avec GitHub Pages (Gratuit)

```bash
# Push sur GitHub
git add .
git commit -m "CARPZONE deployment"
git push origin main

# Activer GitHub Pages dans Settings → Pages
# Choisir le branch "main"
```

---

## 🔍 VÉRIFICATION

Après le lancement, vérifiez que vous voyez :

✅ Logo CARPZONE  
✅ Navigation en bas avec 5 onglets  
✅ Bouton rouge central (+)  
✅ Contenu du tableau de bord  
✅ Données d'exemple (43 prises, 28 sessions, etc.)  

Si tout est visible, **l'installation est réussie !** 🎉

---

## ❌ DÉPANNAGE

### "L'app ne s'ouvre pas"

**Solution :**
- Vérifiez que `index.html` existe
- Essayez la Méthode 1 (double-cliquer)
- Si ça ne marche pas, essayez une autre méthode

### "Le serveur refuse de démarrer"

**Erreur : "Port déjà utilisé"**
```
# Utilisez un autre port
python -m http.server 9000
# Ouvrez : http://localhost:9000
```

### "Python n'est pas trouvé"

**Solution :**
1. Installez Python depuis https://python.org
2. **Windows uniquement** : Cochez "Add Python to PATH"
3. Redémarrez votre PC
4. Réessayez

### "Les icônes ne s'affichent pas"

**Solution :**
- Les icônes viennent d'Internet
- Vérifiez votre connexion
- Videz le cache (Ctrl+Shift+R)

### "Rien ne s'affiche"

**Solution :**
- Ouvrez la console (F12)
- Cherchez les erreurs en rouge
- Vérifiez que tous les fichiers sont présents

---

## 📱 SUR TÉLÉPHONE MOBILE

### iOS (iPhone/iPad)

1. Ouvrez Safari
2. Allez à : `http://[IP-de-votre-PC]:8000`
   - Trouvez l'IP : Win: `ipconfig`, Mac/Linux: `ifconfig`
3. Cliquez la flèche (en bas)
4. "Ajouter à l'écran d'accueil"
5. ✅ L'app est maintenant sur votre accueil !

### Android

1. Ouvrez Chrome
2. Allez à : `http://[IP-de-votre-PC]:8000`
3. Menu (3 points) → "Installer l'app"
4. ✅ L'app est maintenant sur votre accueil !

---

## 🔐 SÉCURITÉ

- ✅ Aucune donnée n'est envoyée à un serveur
- ✅ Tous les données restent sur votre PC
- ✅ Compatible RGPD
- ✅ Pas de cookies tiers

---

## 🆘 BESOIN D'AIDE ?

1. **Consultez** `DEMARRAGE_RAPIDE.md` pour le résumé
2. **Consultez** `README.md` pour les détails
3. **Vérifiez** la console (F12) pour les erreurs
4. **Contactez** : contact@carpzone.app

---

## ✅ CHECKLIST FINALE

- [ ] Tous les fichiers du projet sont présents
- [ ] L'app se lance sans erreur
- [ ] Les 5 onglets fonctionnent
- [ ] Les données d'exemple s'affichent
- [ ] Le bouton (+) central fonctionne
- [ ] Les icônes s'affichent correctement
- [ ] La console ne montre aucune erreur

**Si tout est coché, CARPZONE est prêt ! 🎉**

---

## 📞 SUPPORT

Pour toute question ou problème :
- 📧 Email: contact@carpzone.app
- 🌐 Site: www.carpzone.app
- 📱 Instagram: @carpzone_app

---

**Bon courage ! Que vos lignes ramènent des carpes ! 🎣**

---

*Dernière mise à jour : Août 2024*
