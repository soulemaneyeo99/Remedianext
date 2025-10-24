# ⚡ Quick Start Guide - REMEDIA v2.0

**Lancez votre projet en 10 minutes !**

---

## 🎯 Pour les Impatients

```bash
# 1. Cloner
git clone <your-repo>
cd remedia-v2

# 2. Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# ➡️ AJOUTEZ VOTRE GEMINI_API_KEY dans .env
uvicorn app.main:app --reload

# 3. Frontend (nouveau terminal)
cd ../frontend
npm install
npm run dev

# 4. Ouvrir http://localhost:3000
```

---

## 📋 Prérequis (Check-list)

- [ ] **Python 3.11+** installé (`python --version`)
- [ ] **Node.js 18+** installé (`node --version`)
- [ ] **npm** installé (`npm --version`)
- [ ] **Git** installé (`git --version`)
- [ ] **Clé API Gemini** (gratuite sur https://ai.google.dev/)

---

## 🔧 Installation Détaillée

### Étape 1 : Backend FastAPI

```bash
# Naviguer dans le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Mac/Linux :
source venv/bin/activate
# Sur Windows :
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configuration
cp .env.example .env
```

**⚠️ IMPORTANT :** Éditez le fichier `.env` et ajoutez votre clé API Gemini :

```env
GEMINI_API_KEY=votre_clé_api_ici
```

Comment obtenir une clé Gemini (2 minutes) :
1. Allez sur https://ai.google.dev/
2. Cliquez sur "Get API Key"
3. Créez un compte Google (si nécessaire)
4. Copiez la clé générée

```bash
# Tester le backend
uvicorn app.main:app --reload

# Vous devriez voir :
# INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Testez dans votre navigateur :**
- http://localhost:8000 → Page d'accueil de l'API
- http://localhost:8000/docs → Documentation interactive Swagger
- http://localhost:8000/health → Health check

### Étape 2 : Frontend Next.js

Ouvrez un **nouveau terminal** (le backend doit rester actif) :

```bash
# Naviguer dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Configuration
cp .env.example .env.local

# Vérifier que .env.local contient :
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Lancer le serveur de développement
npm run dev

# Vous devriez voir :
# ✓ Ready in 3.2s
# ○ Local:        http://localhost:3000
```

**Testez dans votre navigateur :**
- http://localhost:3000 → Page d'accueil
- http://localhost:3000/scan → Page de scan

---

## ✅ Vérification

### Backend est OK si :

```bash
# Dans un nouveau terminal :
curl http://localhost:8000/health
```

Retourne :
```json
{
  "status": "healthy",
  "gemini_configured": true
}
```

### Frontend est OK si :

- Vous voyez la page d'accueil avec le titre "L'Intelligence Verte pour l'Afrique"
- Pas d'erreurs dans la console du navigateur (F12)

---

## 🧪 Premier Test

### Test 1 : Scanner une plante

1. Allez sur http://localhost:3000/scan
2. Uploadez une image de plante (cherchez "moringa" ou "neem" sur Google Images)
3. Cliquez sur "Scanner maintenant"
4. Attendez 2-3 secondes
5. Vous devriez voir les résultats !

### Test 2 : Chatbot

1. Allez sur http://localhost:3000/chat (vous devrez créer cette page)
2. Tapez : "Comment traiter le paludisme naturellement ?"
3. L'IA devrait répondre avec des plantes recommandées

---

## 🐛 Troubleshooting

### Problème : "GEMINI_API_KEY non configurée"

**Solution :**
```bash
cd backend
nano .env  # ou vim, ou votre éditeur
# Ajoutez : GEMINI_API_KEY=votre_clé
```

### Problème : "Module google.generativeai not found"

**Solution :**
```bash
cd backend
source venv/bin/activate
pip install --upgrade google-generativeai
```

### Problème : "Port 8000 already in use"

**Solution :**
```bash
# Tuer le processus sur le port 8000
lsof -ti:8000 | xargs kill -9
# Ou changez le port :
uvicorn app.main:app --reload --port 8001
```

### Problème : "Port 3000 already in use"

**Solution :**
```bash
# Tuer le processus sur le port 3000
lsof -ti:3000 | xargs kill -9
# Ou changez le port :
npm run dev -- -p 3001
```

### Problème : Erreur CORS dans le frontend

**Solution :**
Vérifiez que `backend/.env` contient :
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Problème : "Failed to fetch" dans le scan

**Solution :**
1. Vérifiez que le backend tourne (`http://localhost:8000/health`)
2. Vérifiez `frontend/.env.local` :
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Rechargez la page

---

## 📚 Ressources

### Documentation

- **Backend API :** http://localhost:8000/docs
- **Frontend :** Voir `frontend/README.md`
- **Pitch Deck :** `docs/PITCH_DECK.md`

### Liens Utiles

- [Documentation Gemini](https://ai.google.dev/docs)
- [Documentation FastAPI](https://fastapi.tiangolo.com/)
- [Documentation Next.js](https://nextjs.org/docs)

---

## 🚀 Prochaines Étapes

1. ✅ Testez le scan avec plusieurs images
2. ✅ Créez la page Chat (copie du code fourni)
3. ✅ Lisez le PITCH_DECK.md pour préparer la présentation
4. ✅ Ajoutez plus de plantes dans `backend/app/data/plants_database.json`
5. ✅ Personnalisez les couleurs dans `frontend/tailwind.config.js`

---

## 💬 Besoin d'Aide ?

- 📧 Email : contact@remedia.africa
- 💬 Issues GitHub : [Créez une issue](https://github.com/votre-repo/issues)
- 📚 Documentation complète : `README.md`

---

**Bon développement ! 🚀**
