# CARPZONE v4 – correction Accueil + Carte

- Correction de `lastUpdated` manquant dans la page Accueil quand la météo est chargée.
- Initialisation Leaflet déplacée hors du HTML injecté : la carte est maintenant créée après insertion du DOM.
- Destruction/recréation propre de Leaflet lors des changements de page.
- Le GPS de la carte ne force plus un retour automatique vers l'Accueil.
- Cache PWA : `carpzone-pwa-v4-home-map-fix`.
