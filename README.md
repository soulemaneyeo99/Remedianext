# 🌿 REMEDIA v2.0 - Intelligence Verte pour l'Afrique

<div align="center">

![REMEDIA Logo](https://img.shields.io/badge/REMEDIA-Intelligence_Verte-22c55e?style=for-the-badge&logo=leaf)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Plateforme IA de reconnaissance de plantes médicinales africaines**

[🚀 Demo](#) • [📖 Documentation](#) • [🎯 Hackathon UniPods](#)

</div>

---

## 🎯 Projet pour le Bootcamp UniPods AI 2025

Ce projet a été développé dans le cadre du **UniPods AI Training and Product Development Bootcamp** (Novembre 2025, Conakry, Guinée).

### 🏆 Objectif du Hackathon
Créer une solution IA impactante pour résoudre un problème urgent en Afrique de l'Ouest dans les domaines :
- ✅ **Santé** (notre focus)
- Agriculture
- Finance
- Éducation
- Résilience climatique

---

## 🌍 Le Problème

**58% des populations rurales africaines n'ont pas accès aux soins de santé modernes** (OMS 2024)

Pendant ce temps :
- 🌿 **80% de la population** utilise la médecine traditionnelle comme soin primaire
- 📚 Les **savoirs ancestraux** se perdent avec les générations
- ⚠️ **Risque de toxicité** par manque de validation scientifique
- 🗺️ Absence de **cartographie** des plantes médicinales

---

## 💡 Notre Solution : REMEDIA 2.0

**"L'assistant médical IA qui démocratise l'accès aux soins de santé primaires en Afrique"**

### Fonctionnalités Clés

#### 🔬 1. Scan IA Instantané (Gemini Vision)
- Upload photo → Identification en **2 secondes**
- Reconnaissance de **50+ plantes** médicinales d'Afrique de l'Ouest
- Score de confiance + sources scientifiques
- Mode de préparation + posologie + contre-indications

#### 💬 2. Assistant Médical Conversationnel (RAG)
- Chatbot spécialisé en **phytothérapie africaine**
- Réponses basées sur **corpus scientifique validé**
- Multilingue : Français + langues locales
- **TOUJOURS** rappelle de consulter un professionnel

#### 🗺️ 3. Géolocalisation & Communauté
- Carte interactive des **observations**
- Réseau de **tradipraticiens certifiés**
- Système de **validation communautaire**
- **Gamification** (badges, points, niveaux)

#### 📊 4. Dashboard d'Impact
- **Métriques temps réel** : plantes identifiées, utilisateurs, consultations
- **Impact écologique** : CO2 économisé vs médecine conventionnelle
- **Graphiques interactifs** (Recharts)
- **Rapports exportables** pour ONG/Gouvernements

#### 📱 5. PWA Mode Hors-Ligne
- Service Worker pour **cache intelligent**
- **Base de données locale** (50+ plantes essentielles)
- Synchronisation différée
- **Crucial pour zones rurales** sans internet stable

---

## 🏗️ Architecture Technique

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Scanner    │  │  Chatbot IA  │  │  Dashboard   │      │
│  │   (Vision)   │  │     (RAG)    │  │   (Stats)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    Axios REST API                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  FastAPI Server │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼──────┐  ┌─────────▼────────┐  ┌──────▼─────┐
│ Gemini Vision │  │ Gemini Text      │  │  ChromaDB  │
│ (Scan Plantes)│  │ (Chat Médical)   │  │    (RAG)   │
└───────────────┘  └──────────────────┘  └────────────┘
```

### Stack Complète

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Frontend** | Next.js 14 (App Router) | SSR, Performance, SEO |
| **UI Framework** | Tailwind + Shadcn/ui | Design system moderne |
| **Backend** | FastAPI (Python 3.11) | Rapide, async, typage fort |
| **IA** | Gemini 1.5 Flash | Gratuit, multimodal, français natif |
| **Vector DB** | ChromaDB | RAG pour contexte médical |
| **Base de données** | SQLite → PostgreSQL | Dev → Prod migration |
| **Déploiement** | Vercel + Railway | Gratuit, CI/CD automatique |

---

## 🚀 Installation & Démarrage

### Prérequis

```bash
Node.js 18+
Python 3.11+
Git
Compte Gemini AI (gratuit)
```

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/votre-username/remedia-v2.git
cd remedia-v2
```

### Étape 2 : Backend FastAPI

```bash
cd backend

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Configuration
cp .env.example .env
nano .env  # Ajouter votre GEMINI_API_KEY

# Lancer le serveur
uvicorn app.main:app --reload
```

**Backend disponible sur : http://localhost:8000**

### Étape 3 : Frontend Next.js

```bash
cd frontend

# Installer dépendances
npm install

# Configuration
cp .env.example .env.local
# Vérifier que NEXT_PUBLIC_API_URL=http://localhost:8000

# Lancer le serveur
npm run dev
```

**Frontend disponible sur : http://localhost:3000**

### Étape 4 : Obtenir une clé API Gemini (GRATUIT)

1. Aller sur https://ai.google.dev/
2. Cliquer sur **"Get API Key"**
3. Copier la clé
4. La mettre dans `backend/.env` :
   ```
   GEMINI_API_KEY=votre_clé_ici
   ```

---

## 📊 Différenciation vs Concurrents

| Critère | PlantNet | iNaturalist | **REMEDIA** |
|---------|----------|-------------|-------------|
| **Cible** | Scientifiques | Grand public | Populations rurales africaines |
| **Focus** | Identification | Biodiversité | Santé + Traitement |
| **IA** | CNN classique | Crowdsourcing | Gemini multimodal + RAG |
| **Validation** | Communauté | Experts | Sources scientifiques + Tradipraticiens |
| **Hors-ligne** | ❌ | ❌ | ✅ PWA avec cache |
| **Langues** | EN, FR | Multi | FR + langues locales africaines |
| **Gratuit** | ✅ | ✅ | ✅ |
| **Impact social** | Faible | Moyen | **ÉLEVÉ** |

---

## 📈 Impact Projeté

### Année 1 (2026)
- 🎯 **10,000 utilisateurs** actifs
- 🌿 **100,000 plantes** identifiées
- 💊 **5,000 consultations** médicales gratuites
- 🗺️ **500 tradipraticiens** inscrits
- 💰 **$50,000** économisés en frais médicaux

### Année 3 (2028)
- 🎯 **500,000 utilisateurs** (7 pays)
- 🌿 **5M plantes** identifiées
- 💊 **200,000 consultations**
- 🗺️ **5,000 tradipraticiens**
- 💰 **$5M** économisés

---

## 💼 Modèle Économique

### Phase 1 : Impact Social (Gratuit)
- Application 100% gratuite pour utilisateurs finaux
- Financé par **subventions** (ONG, gouvernements)
- **Partenaires** : OMS, Ministères de la Santé

### Phase 2 : Microfranchise (2027)
```
Tradipraticiens : 50,000 FCFA/an (~$85)
├─ Listing vérifié sur la plateforme
├─ Formation continue IA-assistée
├─ Outils de gestion patients
└─ Certification progressive

→ 1,000 praticiens × $85 = $85,000/an
```

### Phase 3 : B2B & Scale (2028+)
- Partenariats **ministères** (programmes santé publique)
- Licence pour **ONG médicales**
- **API** pour intégration dans apps existantes
- **White-label** pour pays voisins

---

## 🎬 Pitch pour le Jury

**"Imaginez une grand-mère au village qui identifie la bonne plante pour soigner son petit-fils en 2 secondes, avec validation scientifique, sans internet."**

### Pourquoi REMEDIA va gagner ?

1. ✅ **Problème urgent** : 58% sans accès aux soins
2. ✅ **Solution scalable** : IA + PWA hors-ligne
3. ✅ **Prototype fonctionnel** : Gemini AI opérationnel
4. ✅ **Impact mesurable** : Métriques concrètes
5. ✅ **Modèle économique** : Gratuit → Microfranchise → B2B
6. ✅ **Alignement UniPods** : Santé + Tech + Afrique

---

## 🔬 Validation Scientifique

Nous nous appuyons sur :
- 📚 **Pharmacopée africaine** (OMS)
- 🔬 **PubMed** (études cliniques)
- 🏛️ **Ethnobotanique** (universités africaines)
- 🌿 **Tradipraticiens certifiés** (validation terrain)

---

## 👥 Équipe (Mettez vos noms ici)

- **[Votre Nom]** - Lead Developer & AI Engineer
- **[Co-fondateur]** - Product & Design
- **Mentors UniPods** - Technical Advisors

---

## 📅 Roadmap Post-Bootcamp

### Q1 2026 (Jan-Mar)
- [ ] Ajouter 150+ plantes supplémentaires
- [ ] Multilingue : Bambara, Wolof, Dioula
- [ ] Intégration WhatsApp Bot
- [ ] Tests utilisateurs (1,000 personnes)

### Q2 2026 (Apr-Jun)
- [ ] Lancement public (Côte d'Ivoire + Sénégal)
- [ ] Partenariats ONG (Médecins Sans Frontières)
- [ ] Système de certification tradipraticiens
- [ ] Dashboard analytics avancé

### Q3 2026 (Jul-Sep)
- [ ] Expansion (Mali, Guinée, Bénin, Togo)
- [ ] API publique v1.0
- [ ] Programme de microfranchise
- [ ] Levée de fonds (seed round)

### Q4 2026 (Oct-Dec)
- [ ] 50,000 utilisateurs
- [ ] Plateforme marketplace (vente de plantes)
- [ ] Application mobile native (Flutter)
- [ ] Certification ISO qualité

---

## 🤝 Contribution

Ce projet est **open-source** pour maximiser l'impact social.

```bash
# Forker le projet
git checkout -b feature/ma-feature
git commit -m "feat: ajout de ma feature"
git push origin feature/ma-feature
# Créer une Pull Request
```

---

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE)

---

## 🙏 Remerciements

- **UniPods** pour l'opportunité du bootcamp
- **Google Gemini** pour l'API gratuite
- **Communauté africaine** de tradipraticiens
- **Nos familles** pour le soutien

---

## 📞 Contact

- 📧 Email : contact@remedia.africa
- 🌐 Website : https://remedia.vercel.app
- 🐦 Twitter : @RemediaAfrica
- 💼 LinkedIn : Remedia Platform

---

<div align="center">

**Fait avec ❤️ pour l'Afrique | Powered by Gemini AI**

[![Bootcamp UniPods](https://img.shields.io/badge/UniPods-AI_Bootcamp_2025-orange?style=for-the-badge)](https://unipods.africa)

</div>
