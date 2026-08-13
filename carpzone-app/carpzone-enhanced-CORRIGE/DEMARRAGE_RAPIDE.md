# 🚀 DEMARRAGE RAPIDE - CARPZONE

## ⚡ Lancer l'app en 30 secondes

### Méthode 1 : Le plus simple (Recommandé)

1. **Ouvrez le dossier** `carpzone-app`
2. **Double-cliquez** sur `index.html`
3. ✅ C'est tout ! L'app s'ouvre dans votre navigateur

---

## 🖥️ Autres méthodes

### Méthode 2 : Avec Python (Windows/Mac/Linux)

```bash
# 1. Ouvrez un terminal/invite de commande
# 2. Allez dans le dossier : cd chemin/vers/carpzone-app

# 3. Tapez la commande (selon votre version Python)
python -m http.server 8000          # Python 3
# ou
python -m SimpleHTTPServer 8000     # Python 2

# 4. Ouvrez http://localhost:8000 dans votre navigateur
```

### Méthode 3 : Avec Node.js

```bash
# 1. Ouvrez un terminal
# 2. Allez dans le dossier : cd chemin/vers/carpzone-app

# 3. Tapez :
npx http-server

# 4. Ouvrez l'URL affichée dans votre navigateur
```

### Méthode 4 : Avec VS Code

1. Installez l'extension **"Live Server"**
2. Ouvrez `index.html` avec clic-droit → **"Open with Live Server"**
3. L'app s'ouvre automatiquement

---

## 📱 Sur téléphone mobile

### Sur le même réseau :

1. Trouvez votre adresse IP locale :
   - **Windows** : `ipconfig` dans le terminal
   - **Mac/Linux** : `ifconfig` dans le terminal
   
2. Sur le téléphone, ouvrez : `http://[votre-IP]:8000`

3. Cliquez le menu → "Ajouter à l'écran d'accueil"

---

## 🎮 Test rapide

Une fois l'app ouverte :

✅ Naviguez entre les 5 onglets (bas de l'écran)  
✅ Cliquez le bouton rouge central (+)  
✅ Consultez les données d'exemple  
✅ Explorez chaque écran  

---

## 📝 Modifier les données

Ouvrez la **console** (F12) et tapez :

```javascript
// Voir tous les données
AppData

// Voir les statistiques
AppData.getStatistics()

// Ajouter une prise
AppData.addCatch({
  species: 'Carpe commune',
  weight: 25,
  length: 75,
  location: 'Lac de Créteil',
  bait: 'Bouillette',
  rig: 'D-Rig'
});

// Exporter les données (télécharge un fichier)
App.exportData()
```

---

## 🎨 Personnaliser les couleurs

Ouvrez `css/styles.css` et modifiez :

```css
--accent-red: #D00000;      /* Changez la couleur rouge */
--primary-dark: #080808;    /* Changez le noir */
```

Sauvegardez et rafraîchissez (Ctrl+R).

---

## 🔧 Dépannage

**L'app ne se charge pas ?**
- ✅ Vérifiez que `index.html` existe
- ✅ Utilisez la Méthode 1 ou 2
- ✅ Rafraîchissez (Ctrl+R)

**Les icônes ne s'affichent pas ?**
- ✅ Vérifiez votre connexion Internet
- ✅ Videz le cache (Ctrl+Shift+R)

**Rien ne s'affiche ?**
- ✅ Ouvrez la console (F12)
- ✅ Cherchez des messages d'erreur en rouge
- ✅ Vérifiez les chemins des fichiers

---

## 📂 Structure fichiers

```
carpzone-app/
├── index.html              ← Fichier principal (double-cliquez)
├── css/
│   ├── styles.css
│   ├── phone-frame.css
│   ├── screens.css
│   ├── components.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── navigation.js
│   └── ui-generator.js
└── data/
    └── app-data.js
```

---

## 💡 Astuces

- **Raccourci clavier** : F12 = Console de développement
- **Rafraichiissement dur** : Ctrl+Shift+R (vide le cache)
- **Mode responsive** : F12 → Cliquez l'icône téléphone
- **Données** : Toutes sauvegardées automatiquement localement
- **Export** : Tapez `App.exportData()` dans la console

---

## 🎯 Prochaines étapes

1. ✅ Explorez l'interface
2. ✅ Modifiez les données d'exemple
3. ✅ Personnalisez les couleurs
4. ✅ Testez sur votre téléphone
5. ✅ Déployez sur un serveur (optionnel)

---

## 🆘 Besoin d'aide ?

Consultez `README.md` pour :
- Guide complet d'installation
- Architecture du projet
- API et fonctionnalités avancées
- Dépannage détaillé
- Roadmap future

---

**Bon courage ! 🎣** Vous êtes prêt à utiliser CARPZONE !

---

*Dernière mise à jour : Août 2024*
