#!/bin/bash

# 🚀 Script d'installation automatique REMEDIA Frontend
# Ce script crée la structure de dossiers et copie les fichiers

echo "🌿 Installation REMEDIA Frontend v2.0"
echo "======================================"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "${YELLOW}⚠️  Attention: package.json non trouvé${NC}"
    echo "Assurez-vous d'être dans le dossier frontend/"
    exit 1
fi

echo "${BLUE}📁 Création de la structure de dossiers...${NC}"

# Créer les dossiers nécessaires
mkdir -p app/scan
mkdir -p app/chat
mkdir -p app/dashboard
mkdir -p app/plants/\[id\]

echo "${GREEN}✅ Structure de dossiers créée${NC}"
echo ""

# Vérifier si les fichiers source existent
SOURCE_DIR="../frontend"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "${YELLOW}⚠️  Dossier source non trouvé: $SOURCE_DIR${NC}"
    echo "Placez les fichiers .tsx dans ce dossier d'abord"
    exit 1
fi

echo "${BLUE}📄 Copie des fichiers...${NC}"

# Copier les fichiers
cp "$SOURCE_DIR/page.tsx" app/page.tsx
cp "$SOURCE_DIR/scan-page.tsx" app/scan/page.tsx
cp "$SOURCE_DIR/chat-page.tsx" app/chat/page.tsx
cp "$SOURCE_DIR/dashboard-page.tsx" app/dashboard/page.tsx
cp "$SOURCE_DIR/plants-page.tsx" app/plants/page.tsx
cp "$SOURCE_DIR/plant-detail-page.tsx" app/plants/[id]/page.tsx

echo "${GREEN}✅ Fichiers copiés${NC}"
echo ""

# Vérifier si react-dropzone est installé
echo "${BLUE}📦 Vérification des dépendances...${NC}"

if ! grep -q "react-dropzone" package.json; then
    echo "${YELLOW}⚠️  react-dropzone non installé${NC}"
    echo "Installation en cours..."
    npm install react-dropzone
    echo "${GREEN}✅ react-dropzone installé${NC}"
else
    echo "${GREEN}✅ react-dropzone déjà installé${NC}"
fi

echo ""
echo "======================================"
echo "${GREEN}✅ Installation terminée !${NC}"
echo ""
echo "📋 Structure créée :"
echo "   app/"
echo "   ├── page.tsx              (Landing page)"
echo "   ├── scan/page.tsx         (Scanner)"
echo "   ├── chat/page.tsx         (Chat médical)"
echo "   ├── dashboard/page.tsx    (Métriques)"
echo "   └── plants/"
echo "       ├── page.tsx          (Encyclopédie)"
echo "       └── [id]/page.tsx     (Détail plante)"
echo ""
echo "🚀 Pour lancer l'application :"
echo "   ${BLUE}npm run dev${NC}"
echo ""
echo "🌐 Puis ouvrez: http://localhost:3000"
echo ""
echo "💡 N'oubliez pas de :"
echo "   1. Démarrer le backend (port 8000)"
echo "   2. Configurer NEXT_PUBLIC_API_URL dans .env.local"
echo ""
echo "📚 Consultez QUICKSTART.md pour plus d'infos"
echo ""
echo "Bonne chance pour le hackathon ! 🌿🚀"
