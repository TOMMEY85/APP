# Installer CARPZONE sur iPhone (PWA)

## Important
Une PWA doit être ouverte depuis une adresse **HTTPS** pour être installée correctement sur un iPhone. Ouvrir `index.html` directement depuis un ZIP ou avec une adresse `file://` ne suffit pas.

## Étapes
1. Publier tout le contenu du dossier `carpzone-app` sur un hébergement web statique HTTPS.
2. Ouvrir l'adresse de CARPZONE dans **Safari** sur l'iPhone.
3. Appuyer sur le bouton **Partager** de Safari.
4. Choisir **Ajouter à l'écran d'accueil**.
5. Vérifier le nom `CARPZONE`, puis appuyer sur **Ajouter**.
6. Ouvrir ensuite CARPZONE depuis l'icône ajoutée à l'écran d'accueil.

## Ce qui est inclus
- manifeste PWA (`manifest.webmanifest`)
- icônes iPhone et PWA
- mode plein écran / standalone
- service worker (`sw.js`) pour mettre en cache les fichiers principaux
- conservation du stockage local déjà utilisé par l'application

## Test sur PC
Pour tester la PWA localement depuis le dossier du projet :

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

Le service worker ne fonctionne pas correctement lorsque l'application est ouverte directement avec `file://`.
