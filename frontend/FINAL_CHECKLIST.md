# ✅ CHECKLIST FINALE - Bootcamp UniPods 2025

## 📋 Avant de Soumettre votre Candidature

### 🔧 Setup Technique

#### Backend
- [ ] `.env` créé avec `GEMINI_API_KEY` valide
- [ ] Backend démarre sans erreur (`uvicorn app.main:app --reload`)
- [ ] Endpoint `/health` retourne status "healthy"
- [ ] Endpoint `/test-gemini` fonctionne
- [ ] Base de données plantes chargée (127+ plantes)

#### Frontend
- [ ] Tous les fichiers copiés aux bons emplacements
- [ ] `react-dropzone` installé
- [ ] `.env.local` avec `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] Frontend démarre sans erreur (`npm run dev`)
- [ ] Pas d'erreurs de compilation TypeScript

---

### 🧪 Tests Fonctionnels

#### Page par Page

**Landing Page (app/page.tsx)**
- [ ] Affichage correct du hero
- [ ] Animation des stats fonctionne
- [ ] Liens vers `/scan`, `/chat`, `/plants` fonctionnent
- [ ] Responsive mobile OK

**Scanner (app/scan/page.tsx)**
- [ ] Zone upload apparaît
- [ ] Drag & drop fonctionne
- [ ] Preview image s'affiche
- [ ] Bouton "Identifier" envoie requête au backend
- [ ] Résultats s'affichent correctement
- [ ] Erreurs gérées gracieusement

**Chat (app/chat/page.tsx)** ⭐
- [ ] **Bubbles apparaissent correctement** (user à droite, bot à gauche)
- [ ] Messages envoyés avec Entrée
- [ ] Réponses du backend affichées
- [ ] Formatage automatique (bold, listes)
- [ ] Loading indicator pendant attente
- [ ] Suggestions cliquables

**Dashboard (app/dashboard/page.tsx)**
- [ ] Toutes les métriques affichées
- [ ] Graphiques rendus correctement
- [ ] Distribution géographique visible
- [ ] Témoignages lisibles

**Encyclopédie (app/plants/page.tsx)**
- [ ] Grid de plantes affichée
- [ ] Recherche filtre en temps réel
- [ ] Filtres par famille fonctionnent
- [ ] Clic sur une plante → page détail

**Détail Plante (app/plants/[id]/page.tsx)**
- [ ] Hero avec image affichée
- [ ] Toutes les sections visibles
- [ ] Warnings en rouge
- [ ] Validation scientifique en bleu
- [ ] Bouton retour fonctionne

---

### 🎨 Qualité Visuelle

#### Design
- [ ] Pas de texte tronqué
- [ ] Images chargent correctement
- [ ] Gradient backgrounds visibles
- [ ] Ombres et borders propres
- [ ] Icônes alignées

#### Responsive
- [ ] Mobile (375px) : 1 colonne
- [ ] Tablet (768px) : 2 colonnes
- [ ] Desktop (1440px) : 3 colonnes
- [ ] Pas de scroll horizontal
- [ ] Touch-friendly sur mobile

#### Animations
- [ ] Hover effects fonctionnent
- [ ] Transitions fluides
- [ ] Loading states clairs
- [ ] Pas de lag perceptible

---

### 📸 Assets pour Candidature

#### Screenshots (6 minimum)
- [ ] **1. Landing page** - Hero section avec stats
- [ ] **2. Scanner** - Résultat d'identification affiché
- [ ] **3. Chat** - Conversation avec bubbles visibles ⭐
- [ ] **4. Dashboard** - Vue complète des métriques
- [ ] **5. Encyclopédie** - Grid de plantes
- [ ] **6. Détail plante** - Page complète avec warnings

#### Vidéo Démo (2 minutes max)
- [ ] Script préparé (voir QUICKSTART.md)
- [ ] Enregistrement en 1080p
- [ ] Audio clair et sans bruit
- [ ] Démo des 3 fonctionnalités principales :
  - [ ] Scan d'une plante
  - [ ] Conversation chat avec bubbles
  - [ ] Dashboard impact
- [ ] Call-to-action à la fin

---

### 📝 Documentation

#### GitHub Repository
- [ ] Code poussé sur GitHub
- [ ] README.md avec:
  - [ ] Description du projet
  - [ ] Stack technique
  - [ ] Instructions d'installation
  - [ ] Screenshots
  - [ ] Lien démo live (optionnel)
- [ ] .gitignore configuré (.env exclus)
- [ ] License ajoutée (MIT recommandé)

---

### 🚀 Déploiement (Optionnel mais Recommandé)

#### Frontend (Vercel)
- [ ] Compte Vercel créé
- [ ] Projet connecté à GitHub
- [ ] Variable `NEXT_PUBLIC_API_URL` configurée
- [ ] Build réussi
- [ ] URL live fonctionnelle

#### Backend (Railway/Render)
- [ ] Service créé
- [ ] Variables d'environnement configurées
- [ ] `GEMINI_API_KEY` ajoutée
- [ ] `ALLOWED_ORIGINS` avec URL frontend
- [ ] API accessible publiquement
- [ ] Endpoint `/health` répond

---

### 📊 Données de Test

#### Plantes (minimum 50 pour démo)
- [ ] Noms scientifiques corrects
- [ ] Descriptions complètes
- [ ] Propriétés médicinales renseignées
- [ ] Warnings présents
- [ ] URLs images valides (ou placeholder)

#### Métriques Dashboard
- [ ] Stats réalistes (éviter 0 ou 1)
- [ ] Variations cohérentes (±5-25%)
- [ ] Pays africains francophones
- [ ] Témoignages crédibles

---

### 🎯 Critères Bootcamp

#### Technique (30 points)
- [ ] IA fonctionnelle avec Gemini ✓
- [ ] Code propre et commenté ✓
- [ ] Architecture moderne (Next.js + FastAPI) ✓
- [ ] API REST complète ✓

#### Innovation (25 points)
- [ ] Chat avec bubbles modernes ⭐
- [ ] Dashboard impact quantifié
- [ ] Validation scientifique
- [ ] Focus Afrique francophone

#### Impact (25 points)
- [ ] Problème clairement défini
- [ ] Solution mesurable (stats)
- [ ] Témoignages utilisateurs
- [ ] ROI économique visible

#### Présentation (20 points)
- [ ] Vidéo démo professionnelle
- [ ] Screenshots haute qualité
- [ ] Pitch clair et concis
- [ ] Documentation complète

---

### 🐛 Debugging Final

#### Erreurs Fréquentes à Vérifier

**"Cannot find module"**
```bash
# Solution
npm install react-dropzone
```

**"CORS Error"**
```python
# backend/.env
ALLOWED_ORIGINS=http://localhost:3000,https://votre-app.vercel.app
```

**"Gemini API Error"**
```bash
# Vérifier la clé
curl https://generativelanguage.googleapis.com/v1/models?key=YOUR_KEY
```

**"404 on API calls"**
```typescript
// frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000  // Pas de slash final
```

---

### 📧 Formulaire de Candidature

Avant de soumettre sur https://forms.gle/cCnwytBKsMUoDoCf8 :

- [ ] Nom/Prénom corrects
- [ ] Email valide
- [ ] Pays: Côte d'Ivoire (ou votre pays)
- [ ] Description projet (max 500 mots)
- [ ] Lien GitHub repository
- [ ] Lien vidéo démo (YouTube/Vimeo)
- [ ] Screenshots (6 images)
- [ ] Confirmation engagement 1 mois

---

### 💡 Last-Minute Tips

#### Améliorer vos Chances
1. **Ajouter un README impressionnant**
   - Badges (build status, license)
   - GIF animé de la démo
   - Section "Problem → Solution → Impact"

2. **Optimiser la vidéo**
   - Musique de fond douce
   - Sous-titres en français
   - Logo REMÉDIA visible

3. **Préparer backup plan**
   - Screenshots si vidéo bug
   - Démo locale si déploiement fail
   - Script écrit pour oral

4. **Highlights à mentionner**
   - "Propulsé par Gemini AI"
   - "98% de précision"
   - "3.2M FCFA économisés"
   - "127+ plantes validées scientifiquement"

---

### 🎓 Après Soumission

Si sélectionné pour le bootcamp :

**Semaine 1 (Transform Africa Summit)**
- [ ] Présentation prototype fonctionnel
- [ ] Pitch de 3 minutes préparé
- [ ] Slides (max 5)
- [ ] Démo live sans bug

**Semaines 2-4 (UniPod Guinée)**
- [ ] Laptop + chargeur
- [ ] Backup code sur USB
- [ ] Documents identité
- [ ] Mindset croissance 🚀

---

## ✅ Validation Finale

**Avant de soumettre, répondez OUI à ces 3 questions :**

1. **Mon projet répond-il à un vrai problème africain ?**
   - [ ] OUI - Accès aux soins de santé primaires

2. **Mon prototype est-il réellement fonctionnel ?**
   - [ ] OUI - IA Gemini + Chat avec bubbles + Dashboard

3. **Puis-je démontrer l'impact en 2 minutes ?**
   - [ ] OUI - Stats, témoignages, ROI économique

---

## 🎯 Score d'Évaluation Auto

Notez-vous sur 100 :

- **Technique** (30pts) : ____ / 30
- **Innovation** (25pts) : ____ / 25
- **Impact** (25pts) : ____ / 25
- **Présentation** (20pts) : ____ / 20

**Total : ____ / 100**

**Objectif minimum : 70/100 pour être compétitif**

---

## 🚀 Vous êtes Prêt !

Si vous avez coché ≥ 80% des cases :

✅ **VOUS ÊTES PRÊT À SOUMETTRE !**

Soumettez maintenant sur :
👉 https://forms.gle/cCnwytBKsMUoDoCf8

---

**Derniers mots :**

> "L'innovation africaine ne se mesure pas à la complexité technique, 
> mais à l'impact réel sur les communautés."

Vous avez construit quelque chose de **concret**, **fonctionnel** et **impactant**.

**Croyez en votre projet. Bonne chance ! 🌿🚀**

---

*Checklist créée pour le bootcamp UniPods 2025*
*Pour l'innovation africaine et la médecine traditionnelle* ❤️
