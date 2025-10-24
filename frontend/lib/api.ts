import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes
})

// Intercepteur pour logger les requêtes (dev only)
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use((config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  })
}

// Types
export interface PlantIdentification {
  plant_name: string
  confidence: number
  family: string
  description: string
  traditional_uses: string[]
  medicinal_properties: string[]
  preparation: string
  warnings: string[]
  found_in: string[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface Plant {
  id: string
  scientific_name: string
  common_names: string[]
  local_names: Record<string, string>
  family: string
  description: string
  traditional_uses: string[]
  medicinal_properties: string[]
  preparation: string
  dosage: string
  warnings: string[]
  found_in: string[]
  scientific_validation: string
  image_url: string
}

// API Functions
export const scanAPI = {
  /**
   * Identifie une plante à partir d'une image
   */
  identifyPlant: async (imageFile: File): Promise<{ success: boolean; data: PlantIdentification }> => {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await apiClient.post<{ success: boolean; data: PlantIdentification }>(
      '/api/v1/scan/identify',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  },

  /**
   * Valide les informations d'une plante
   */
  validatePlant: async (plantName: string) => {
    const response = await apiClient.post(`/api/v1/scan/validate/${encodeURIComponent(plantName)}`)
    return response.data
  },
}

export const chatAPI = {
  /**
   * Envoie un message au chatbot médical
   */
  sendMessage: async (message: string, history: ChatMessage[] = []): Promise<{ success: boolean; response: string }> => {
    const response = await apiClient.post<{ success: boolean; response: string }>(
      '/api/v1/chat/message',
      {
        message,
        conversation_history: history,
      }
    )

    return response.data
  },

  /**
   * Obtient un conseil médical rapide
   */
  getQuickAdvice: async (symptom: string) => {
    const response = await apiClient.post('/api/v1/chat/quick-advice', null, {
      params: { symptom },
    })
    return response.data
  },

  /**
   * Récupère les questions suggérées
   */
  getSuggestions: async (): Promise<{ success: boolean; suggestions: string[] }> => {
    const response = await apiClient.get<{ success: boolean; suggestions: string[] }>(
      '/api/v1/chat/suggestions'
    )
    return response.data
  },
}

export const plantsAPI = {
  /**
   * Récupère la liste de toutes les plantes
   */
  getAll: async (limit = 50, offset = 0): Promise<{ success: boolean; data: Plant[]; pagination: any }> => {
    const response = await apiClient.get<{ success: boolean; data: Plant[]; pagination: any }>(
      '/api/v1/plants/list',
      {
        params: { limit, offset },
      }
    )
    return response.data
  },

  /**
   * Recherche des plantes
   */
  search: async (query: string, limit = 10): Promise<{ success: boolean; data: Plant[]; results_count: number }> => {
    const response = await apiClient.get<{ success: boolean; data: Plant[]; results_count: number }>(
      '/api/v1/plants/search',
      {
        params: { q: query, limit },
      }
    )
    return response.data
  },

  /**
   * Récupère une plante par son ID
   */
  getById: async (id: string): Promise<{ success: boolean; data: Plant }> => {
    const response = await apiClient.get<{ success: boolean; data: Plant }>(
      `/api/v1/plants/${id}`
    )
    return response.data
  },

  /**
   * Récupère les plantes pour une condition médicale
   */
  getByCondition: async (condition: string): Promise<{ success: boolean; data: any[]; results_count: number }> => {
    const response = await apiClient.get<{ success: boolean; data: any[]; results_count: number }>(
      `/api/v1/plants/by-condition/${encodeURIComponent(condition)}`
    )
    return response.data
  },

  /**
   * Récupère les statistiques de la base de données
   */
  getStats: async () => {
    const response = await apiClient.get('/api/v1/plants/stats/overview')
    return response.data
  },
}

// Health check
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health')
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    return { status: 'unhealthy' }
  }
}

export default apiClient
