#!/bin/bash

# ============================================
# CARPZONE - Démarreur Mac/Linux
# ============================================

echo ""
echo "╔════════════════════════════════════════╗"
echo "║    CARPZONE - Application Launcher     ║"
echo "║     Analyse. Prépare. Capture.        ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    echo ""
    echo "Installation sur Mac:"
    echo "  brew install python3"
    echo ""
    echo "Installation sur Linux:"
    echo "  sudo apt-get install python3"
    echo ""
    exit 1
fi

echo "✅ Python 3 trouvé"
echo ""

# Obtenir le chemin du répertoire du script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Démarrage du serveur CARPZONE..."
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  http://localhost:8000                 ║"
echo "║                                        ║"
echo "║  Ouvrez l'URL ci-dessus dans votre     ║"
echo "║  navigateur pour accéder à l'app       ║"
echo "║                                        ║"
echo "║  Appuyez sur Ctrl+C pour arrêter       ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Changer de répertoire
cd "$SCRIPT_DIR"

# Lancer le serveur
python3 -m http.server 8000

if [ $? -ne 0 ]; then
    echo "❌ Erreur au lancement du serveur"
    echo ""
    echo "Essayez manuellement:"
    echo "cd $SCRIPT_DIR"
    echo "python3 -m http.server 8000"
    echo ""
    exit 1
fi
