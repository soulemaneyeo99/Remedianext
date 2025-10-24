/**
 * 🎯 QUESTIONS STRATÉGIQUES REMÉDIA
 * 
 * Collection complète de questions prédéfinies pour maximiser l'impact
 * du chatbot lors du hackathon. Organisées par catégories stratégiques.
 * 
 * Usage: Import dans ChatInterface ou comme seed data pour le backend
 */

export interface QuestionCategory {
  id: string
  category: string
  emoji: string
  description: string
  color: string
  questions: string[]
}

export const STRATEGIC_QUESTIONS: QuestionCategory[] = [
  {
    id: 'discovery',
    category: 'Découverte',
    emoji: '🌿',
    description: 'Explorer les plantes médicinales africaines',
    color: 'green',
    questions: [
      "Quelles sont les 5 plantes médicinales les plus efficaces en Afrique ?",
      "Comment utiliser le Moringa pour renforcer mon système immunitaire ?",
      "Quelle plante peut remplacer les antibiotiques pour les infections légères ?",
      "Artemisia annua : vraiment efficace contre le paludisme ?",
      "Différence entre Aloe vera sauvage et cultivé ?",
      "Quelles plantes poussent facilement en zone urbaine ?",
      "Comment identifier une plante médicinale dans la nature ?",
      "Top 10 des plantes à avoir dans sa pharmacie naturelle",
      "Plantes médicinales endémiques à mon pays (Côte d'Ivoire) ?",
      "Comment le Neem peut purifier l'eau naturellement ?"
    ]
  },
  {
    id: 'treatments',
    category: 'Traitements',
    emoji: '💊',
    description: 'Solutions naturelles pour les maladies courantes',
    color: 'blue',
    questions: [
      "Comment traiter naturellement le paludisme avec des plantes locales ?",
      "Quels remèdes traditionnels pour soulager les douleurs menstruelles ?",
      "Comment préparer une tisane anti-inflammatoire efficace ?",
      "Traitement naturel des infections urinaires sans antibiotiques",
      "Soigner l'hypertension avec des plantes : protocole complet",
      "Remède naturel pour le diabète de type 2",
      "Comment traiter les maux de tête persistants naturellement ?",
      "Plantes pour améliorer la digestion et éviter les ballonnements",
      "Traitement traditionnel des hémorroïdes",
      "Comment soulager l'arthrite avec des cataplasmes de plantes ?",
      "Remèdes naturels contre l'insomnie chronique",
      "Traiter la toux grasse avec des sirops maison",
      "Soigner naturellement les plaies et cicatriser plus vite",
      "Comment traiter l'eczéma avec des plantes locales ?",
      "Remède contre les parasites intestinaux chez l'adulte"
    ]
  },
  {
    id: 'family-health',
    category: 'Santé Familiale',
    emoji: '👶',
    description: 'Soins naturels pour toute la famille',
    color: 'pink',
    questions: [
      "Quelles plantes sont sûres pour traiter la toux chez les enfants ?",
      "Comment soigner naturellement les coliques du nourrisson ?",
      "Remèdes naturels pour renforcer l'immunité des enfants ?",
      "Traiter la fièvre chez un enfant avec des plantes : protocole",
      "Plantes pour faciliter la dentition des bébés",
      "Comment traiter naturellement les vers intestinaux chez l'enfant ?",
      "Remèdes pour les éruptions cutanées des bébés",
      "Fortifier les femmes enceintes avec des plantes : lesquelles ?",
      "Plantes à éviter absolument pendant la grossesse",
      "Favoriser la lactation naturellement après l'accouchement",
      "Soigner l'anémie chez les femmes avec des plantes locales",
      "Remèdes pour la ménopause : bouffées de chaleur et irritabilité",
      "Comment traiter les troubles érectiles naturellement ?",
      "Augmenter la fertilité masculine avec des plantes",
      "Renforcer l'immunité des personnes âgées"
    ]
  },
  {
    id: 'emergency',
    category: 'Urgences',
    emoji: '🏥',
    description: 'Premiers secours avec plantes médicinales',
    color: 'red',
    questions: [
      "Premiers secours naturels en cas de brûlure légère ?",
      "Comment arrêter un saignement avec des plantes médicinales ?",
      "Plantes pour calmer une crise d'asthme en attendant les secours ?",
      "Traiter une piqûre de scorpion : premiers gestes avec plantes",
      "Comment réduire une entorse avec des cataplasmes ?",
      "Remède d'urgence contre les intoxications alimentaires",
      "Traiter naturellement un choc anaphylactique léger",
      "Premiers soins pour une morsure de serpent (en attendant l'hôpital)",
      "Comment faire baisser rapidement une forte fièvre ?",
      "Traiter une déshydratation sévère avec des infusions",
      "Remède d'urgence contre les convulsions infantiles",
      "Calmer une crise de panique avec des plantes relaxantes",
      "Comment traiter naturellement un coup de chaleur ?",
      "Premiers soins pour les coupures profondes",
      "Plantes hémostatiques : arrêter un saignement de nez"
    ]
  },
  {
    id: 'social-impact',
    category: 'Impact Social',
    emoji: '🌍',
    description: 'Transformer les communautés avec REMÉDIA',
    color: 'purple',
    questions: [
      "Comment REMÉDIA peut-il réduire les coûts de santé dans ma communauté ?",
      "Économies possibles en utilisant la médecine traditionnelle validée ?",
      "Comment préserver les savoirs ancestraux avec la technologie ?",
      "Créer une coopérative de tradipraticiens dans mon village : guide",
      "Comment monétiser mes connaissances en plantes médicinales ?",
      "Projet pilote REMÉDIA : impact sur les consultations médicales",
      "Réduire la mortalité infantile avec les plantes : cas d'études",
      "REMÉDIA vs pharmacies : comparaison coûts et efficacité",
      "Comment former les femmes rurales à la phytothérapie ?",
      "Créer un jardin médicinal communautaire : étapes pratiques",
      "Statistiques : impact de REMÉDIA sur les villages pilotes",
      "Comment convaincre mon centre de santé d'intégrer REMÉDIA ?",
      "Générer des revenus avec la culture de plantes médicinales",
      "Certification tradipraticien : parcours et opportunités",
      "Comment REMÉDIA lutte contre les charlatans ?"
    ]
  },
  {
    id: 'education',
    category: 'Éducation',
    emoji: '📚',
    description: 'Apprendre et maîtriser la phytothérapie',
    color: 'indigo',
    questions: [
      "Différence entre usage traditionnel et validation scientifique ?",
      "Comment cultiver mes propres plantes médicinales à la maison ?",
      "Quelle formation pour devenir tradipraticien certifié ?",
      "Apprendre à identifier 50 plantes médicinales en 30 jours",
      "Livre/ressources pour approfondir la médecine traditionnelle africaine",
      "Comment sécher et conserver les plantes médicinales ?",
      "Préparer des teintures mères : méthode professionnelle",
      "Différence entre infusion, décoction, macération : quand utiliser quoi ?",
      "Dosages précis : éviter le surdosage en phytothérapie",
      "Comment tester l'efficacité d'une plante scientifiquement ?",
      "Interactions médicamenteuses : plantes à éviter avec traitements modernes",
      "Monter un laboratoire de transformation de plantes médicinales",
      "Législation africaine sur la vente de plantes médicinales",
      "Comment documenter les recettes familiales ancestrales ?",
      "Créer une encyclopédie numérique de plantes de ma région"
    ]
  },
  {
    id: 'prevention',
    category: 'Prévention',
    emoji: '🛡️',
    description: 'Rester en bonne santé naturellement',
    color: 'teal',
    questions: [
      "Plantes pour booster l'immunité toute l'année : protocole",
      "Détox naturelle du foie : plantes et posologie",
      "Comment prévenir le paludisme avec des répulsifs naturels ?",
      "Renforcer ses défenses avant la saison des pluies",
      "Plantes adaptogènes pour gérer le stress chronique",
      "Prévenir les maladies cardiovasculaires avec les plantes",
      "Comment purifier son sang naturellement chaque mois ?",
      "Plantes pour maintenir une glycémie stable (prévention diabète)",
      "Améliorer sa vue avec des plantes riches en antioxydants",
      "Prévenir les infections sexuellement transmissibles naturellement",
      "Fortifier ses os et prévenir l'ostéoporose avec les plantes",
      "Plantes pour une peau saine et prévenir le vieillissement",
      "Comment améliorer sa mémoire et prévenir Alzheimer ?",
      "Renforcer ses reins et prévenir les calculs rénaux",
      "Plantes pour un sommeil réparateur et prévenir l'insomnie"
    ]
  },
  {
    id: 'business',
    category: 'Entrepreneuriat',
    emoji: '💼',
    description: 'Créer son activité en phytothérapie',
    color: 'amber',
    questions: [
      "Business plan : vendre des plantes médicinales en ligne",
      "Comment créer sa marque de tisanes médicinales ?",
      "Monter une pépinière de plantes médicinales rentable",
      "Devenir consultant en phytothérapie : formation et débouchés",
      "Exporter des plantes médicinales africaines : réglementation",
      "Créer une application mobile de reconnaissance de plantes",
      "Partenariat REMÉDIA : opportunités pour entrepreneurs",
      "Comment lever des fonds pour un projet phytothérapie ?",
      "Certification bio pour plantes médicinales : processus",
      "Créer des cosmétiques à base de plantes locales : guide",
      "Transformer les plantes en gélules : équipement nécessaire",
      "Marketing digital pour promouvoir ses produits naturels",
      "Créer un éco-lodge avec jardin médicinal : business model",
      "Vendre aux pharmacies : normes et certifications requises",
      "Franchise REMÉDIA : comment devenir partenaire local ?"
    ]
  },
  {
    id: 'science',
    category: 'Science',
    emoji: '🔬',
    description: 'Comprendre la science des plantes',
    color: 'cyan',
    questions: [
      "Principes actifs des plantes : comment ça marche vraiment ?",
      "Études cliniques validant l'Artemisia contre le paludisme",
      "Molécules médicinales du Moringa : analyse scientifique",
      "Comment la médecine moderne redécouvre les plantes africaines ?",
      "Recherches récentes sur les plantes anti-cancer africaines",
      "Pourquoi certaines plantes sont plus efficaces que les médicaments ?",
      "Biodisponibilité des principes actifs : optimiser l'absorption",
      "Synergie des plantes : pourquoi les mélanges sont plus efficaces",
      "Pharmacognosie : science de l'identification des plantes médicinales",
      "Comment extraire scientifiquement les huiles essentielles ?",
      "Toxicologie végétale : comprendre les doses létales",
      "Mécanismes d'action des plantes adaptogènes sur le stress",
      "Plantes et épigénétique : modifier l'expression des gènes",
      "Microbiome intestinal : comment les plantes le modulent",
      "Intelligence végétale : les plantes communiquent-elles ?"
    ]
  },
  {
    id: 'culture',
    category: 'Culture & Tradition',
    emoji: '🎭',
    description: 'Sagesse ancestrale africaine',
    color: 'orange',
    questions: [
      "Histoire de la médecine traditionnelle en Afrique de l'Ouest",
      "Rituels de guérison : part culturelle vs efficacité réelle",
      "Grands guérisseurs africains : qui sont-ils ?",
      "Transmission orale des savoirs : comment la moderniser ?",
      "Plantes sacrées dans les religions africaines",
      "Médecine traditionnelle vs colonisation : histoire occultée",
      "Comment l'OMS reconnaît la médecine traditionnelle africaine",
      "Syncrétisme : intégrer médecine moderne et traditionnelle",
      "Sagesse des anciens : proverbes sur les plantes médicinales",
      "Rôle social du guérisseur dans les sociétés africaines",
      "Chants et danses de guérison : efficacité psychosomatique",
      "Plantes dans les cérémonies d'initiation africaines",
      "Médecine traditionnelle chinoise vs africaine : comparaison",
      "Comment Haïti a préservé les savoirs africains sur les plantes",
      "Futur de la médecine : fusion tradition et innovation"
    ]
  }
]

/**
 * Fonction pour obtenir N questions aléatoires de catégories différentes
 */
export function getRandomQuestions(count: number = 6): string[] {
  const questions: string[] = []
  const categoriesUsed = new Set<string>()
  const shuffledCategories = [...STRATEGIC_QUESTIONS].sort(() => Math.random() - 0.5)

  for (const category of shuffledCategories) {
    if (questions.length >= count) break
    if (categoriesUsed.has(category.id)) continue

    const randomQuestion = category.questions[Math.floor(Math.random() * category.questions.length)]
    questions.push(randomQuestion)
    categoriesUsed.add(category.id)
  }

  return questions
}

/**
 * Fonction pour obtenir toutes les questions d'une catégorie
 */
export function getQuestionsByCategory(categoryId: string): string[] {
  const category = STRATEGIC_QUESTIONS.find(c => c.id === categoryId)
  return category ? category.questions : []
}

/**
 * Fonction pour rechercher des questions par mot-clé
 */
export function searchQuestions(keyword: string): string[] {
  const results: string[] = []
  const searchTerm = keyword.toLowerCase()

  STRATEGIC_QUESTIONS.forEach(category => {
    category.questions.forEach(question => {
      if (question.toLowerCase().includes(searchTerm)) {
        results.push(question)
      }
    })
  })

  return results
}

/**
 * Statistiques de la base de questions
 */
export function getQuestionsStats() {
  const totalQuestions = STRATEGIC_QUESTIONS.reduce((sum, cat) => sum + cat.questions.length, 0)
  const avgQuestionsPerCategory = totalQuestions / STRATEGIC_QUESTIONS.length

  return {
    totalCategories: STRATEGIC_QUESTIONS.length,
    totalQuestions,
    avgQuestionsPerCategory: Math.round(avgQuestionsPerCategory),
    categories: STRATEGIC_QUESTIONS.map(cat => ({
      id: cat.id,
      name: cat.category,
      count: cat.questions.length
    }))
  }
}

// Export pour usage direct
export default STRATEGIC_QUESTIONS