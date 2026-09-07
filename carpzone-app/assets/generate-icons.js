#!/usr/bin/env node

/**
 * Script pour générer les icônes PWA CARPZONE
 * 
 * À exécuter une fois avec Node.js + imagemagick ou utiliser des outils en ligne:
 * https://icons.modulify.io/
 * https://www.favicon-generator.org/
 * 
 * Les icônes doivent être en PNG avec ces dimensions:
 * - 180x180px (Apple Touch Icon)
 * - 192x192px (PWA standard)
 * - 512x512px (PWA standard)
 * - 512x512px maskable (PWA maskable)
 * 
 * Format: CARPZONE noir avec lettre C rouge et or
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    CRÉATION DES ICÔNES CARPZONE               ║
╚════════════════════════════════════════════════════════════════╝

Les icônes suivantes sont requises:
✓ icon-180.png (180x180px) - Apple Touch Icon
✓ icon-192.png (192x192px) - PWA Android
✓ icon-512.png (512x512px) - PWA
✓ icon-maskable-512.png (512x512px) - Maskable pour adaptative icons

Étapes:

1. Créer une icône CARPZONE (fond noir, lettre C en rouge/or)
2. Redimensionner en 180x180px → icon-180.png
3. Redimensionner en 192x192px → icon-192.png
4. Redimensionner en 512x512px → icon-512.png
5. Créer une version maskable (512x512px avec espace autour) → icon-maskable-512.png

OUTILS RECOMMANDÉS:

Option 1: Utiliser un site de génération d'icônes
├─ https://icons.modulify.io/
├─ https://www.favicon-generator.org/
└─ https://www.pwabuilder.com/imageGenerator

Option 2: Utiliser ImageMagick en ligne de commande
  convert -size 512x512 xc:'#080808' \\
    -fill '#D00000' -pointsize 200 -gravity center -annotate +0+0 'C' \\
    -sharpen 0x1 icon-512.png

Option 3: Utiliser un éditeur graphique
├─ Photoshop
├─ GIMP
├─ Affinity Designer
└─ Figma

SPÉCIFICATIONS:

Fond: Noir (#080808)
Texte: C en rouge (#D00000)
Accent: Or/Orange optionnel
Padding: Laisser 10-15% de marge autour (important pour maskable)
Format: PNG transparence optionnelle

Une fois créées, placer les fichiers PNG dans ce dossier.
`);
