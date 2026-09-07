# CARPZONE – mise à jour météo Open‑Meteo

- météo réelle via `https://api.open-meteo.com/v1/forecast`
- géolocalisation GPS au démarrage
- température, humidité, pression MSL, pression locale
- vent, direction et rafales
- lever/coucher du soleil
- actualisation manuelle
- fallback sur le cache local si réseau indisponible
- l'application reste utilisable si le GPS est refusé
- Service Worker passé à `carpzone-pwa-v2-openmeteo` avec stratégie network-first
