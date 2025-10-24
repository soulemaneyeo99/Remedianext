# 🌿 REMEDIA Backend API v2.0

API FastAPI avec intelligence artificielle (Gemini) pour la reconnaissance et l'information sur les plantes médicinales africaines.

## 🚀 Démarrage Rapide

### 1. Prérequis

```bash
Python 3.11+
pip ou poetry
```

### 2. Installation

```bash
# Cloner le projet
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Linux/Mac:
source venv/bin/activate
# Sur Windows:
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

### 3. Configuration

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env et ajouter votre clé API Gemini
nano .env  # ou vim, ou votre éditeur préféré
```

**⚠️ OBLIGATOIRE: Obtenir une clé API Gemini gratuite**

1. Aller sur https://ai.google.dev/
2. Cliquer sur "Get API Key"
3. Copier la clé et la mettre dans `.env`:
   ```
   GEMINI_API_KEY=votre_clé_ici
   ```

### 4. Lancer le serveur

```bash
# Mode développement (avec rechargement automatique)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Ou simplement:
python -m app.main
```

Le serveur démarre sur: **http://localhost:8000**

### 5. Tester l'API

```bash
# Health check
curl http://localhost:8000/health

# Test Gemini
curl http://localhost:8000/test-gemini

# Documentation interactive
# Ouvrir dans le navigateur: http://localhost:8000/docs
```

---

## 📚 Documentation API

### Endpoints Principaux

#### 🔍 **Scan de Plantes**

**POST** `/api/v1/scan/identify`
```bash
curl -X POST "http://localhost:8000/api/v1/scan/identify" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@photo_plante.jpg"
```

**POST** `/api/v1/scan/validate/{plant_name}`
```bash
curl -X POST "http://localhost:8000/api/v1/scan/validate/Moringa%20oleifera"
```

#### 💬 **Chatbot Médical**

**POST** `/api/v1/chat/message`
```bash
curl -X POST "http://localhost:8000/api/v1/chat/message" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Comment traiter naturellement le paludisme ?",
    "conversation_history": []
  }'
```

**GET** `/api/v1/chat/suggestions`
```bash
curl "http://localhost:8000/api/v1/chat/suggestions"
```

#### 🌱 **Base de Données de Plantes**

**GET** `/api/v1/plants/list`
```bash
curl "http://localhost:8000/api/v1/plants/list?limit=10&offset=0"
```

**GET** `/api/v1/plants/search?q=paludisme`
```bash
curl "http://localhost:8000/api/v1/plants/search?q=paludisme&limit=5"
```

**GET** `/api/v1/plants/{id}`
```bash
curl "http://localhost:8000/api/v1/plants/1"
```

**GET** `/api/v1/plants/by-condition/{condition}`
```bash
curl "http://localhost:8000/api/v1/plants/by-condition/diabète"
```

**GET** `/api/v1/plants/stats/overview`
```bash
curl "http://localhost:8000/api/v1/plants/stats/overview"
```

---

## 🏗️ Architecture

```
backend/
├── app/
│   ├── main.py                 # Application FastAPI principale
│   ├── core/
│   │   ├── config.py           # Configuration (settings)
│   │   └── __init__.py
│   ├── api/
│   │   └── v1/
│   │       ├── scan.py         # Routes scan IA
│   │       ├── chat.py         # Routes chatbot
│   │       └── plants.py       # Routes base de données
│   ├── services/
│   │   ├── gemini_service.py   # Service Gemini AI
│   │   └── __init__.py
│   └── data/
│       └── plants_database.json # 50+ plantes médicinales
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🔧 Configuration Avancée

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `GEMINI_API_KEY` | **OBLIGATOIRE** - Clé API Gemini | - |
| `GEMINI_MODEL` | Modèle Gemini à utiliser | `gemini-1.5-flash` |
| `DATABASE_URL` | URL base de données | `sqlite:///./remedia.db` |
| `ALLOWED_ORIGINS` | URLs autorisées (CORS) | `http://localhost:3000` |
| `DEBUG` | Mode debug | `True` |

### Modèles Gemini disponibles

- `gemini-1.5-flash` (recommandé - gratuit, rapide)
- `gemini-1.5-pro` (plus puissant, limite gratuite inférieure)

---

## 🧪 Tests

```bash
# Installer pytest
pip install pytest pytest-asyncio httpx

# Lancer les tests
pytest tests/ -v

# Avec couverture
pytest tests/ --cov=app --cov-report=html
```

---

## 📦 Déploiement

### Railway.app (Recommandé - Gratuit)

```bash
# 1. Créer un compte sur railway.app
# 2. Installer Railway CLI
npm install -g @railway/cli

# 3. Login
railway login

# 4. Initialiser le projet
railway init

# 5. Ajouter les variables d'environnement
railway variables set GEMINI_API_KEY=votre_clé

# 6. Déployer
railway up
```

### Render.com

```bash
# 1. Créer un compte sur render.com
# 2. New Web Service → Connect Git
# 3. Configuration:
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
# 4. Ajouter GEMINI_API_KEY dans Environment Variables
```

### Docker

```bash
# Build
docker build -t remedia-backend .

# Run
docker run -p 8000:8000 \
  -e GEMINI_API_KEY=votre_clé \
  remedia-backend
```

---

## 🐛 Troubleshooting

### Erreur "GEMINI_API_KEY non configurée"

✅ **Solution**: Vérifiez que vous avez bien créé le fichier `.env` avec votre clé API

### Erreur "Module google.generativeai not found"

✅ **Solution**: 
```bash
pip install --upgrade google-generativeai
```

### Erreur CORS

✅ **Solution**: Ajoutez l'URL de votre frontend dans `ALLOWED_ORIGINS` dans `.env`

### Rate limit Gemini

✅ **Solution**: Gemini Free offre 15 req/min. Pour plus, utilisez un plan payant ou ajoutez un système de queue.

---

## 📈 Performance

- **Latence moyenne scan**: ~2-3 secondes
- **Latence moyenne chat**: ~1-2 secondes
- **Taille base de données**: 50+ plantes (extensible)
- **Limite gratuite Gemini**: 15 requêtes/minute, 1500/jour

---

## 🤝 Contribution

Pour le hackathon UniPods, focus sur:

1. ✅ Ajouter plus de plantes dans `plants_database.json`
2. ✅ Améliorer les prompts Gemini
3. ✅ Ajouter des tests unitaires
4. ✅ Optimiser les performances

---

## 📄 Licence

MIT License - Projet REMEDIA 2025

---

## 🆘 Support

- **Email**: contact@remedia.africa
- **Documentation Gemini**: https://ai.google.dev/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

**Fait avec ❤️ pour l'Afrique | Powered by Gemini AI**
