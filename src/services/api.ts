import { Transaction, NewTransaction, CategoryInfo } from '../types'

// ====================================
// API CONFIGURATION
// ====================================
const API_BASE_URL = 'https://victorious-playfulness-production.up.railway.app/api'

// ====================================
// TOKEN MANAGEMENT
// ====================================

let authToken: string | null = localStorage.getItem('token')

export const setAuthToken = (token: string | null) => {
  authToken = token
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export const getAuthToken = () => authToken

// ====================================
// TYPES
// ====================================

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  count?: number
}

interface StatsResponse {
  totalIncome: number
  totalExpenses: number
  balance: number
  categoryBreakdown: Array<{ _id: string; total: number }>
  monthlyData: Array<{
    _id: { year: number; month: number; type: string }
    total: number
  }>
}

interface NewCategory {
  id: string
  label: string
  icon: string
  color: string
}

interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthResponse {
  user: AuthUser
  token: string
}

// ====================================
// HELPER FUNCTION
// ====================================

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }
  
  return headers
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    // If unauthorized, clear token
    if (response.status === 401) {
      setAuthToken(null)
    }
    throw new Error(data.message || 'Something went wrong')
  }
  
  return data
}

// ====================================
// TRANSACTION API
// ====================================

export const transactionApi = {
  // Get all transactions
  getAll: async (filters?: {
    type?: string
    category?: string
    startDate?: string
    endDate?: string
    search?: string
  }): Promise<ApiResponse<Transaction[]>> => {
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.type && filters.type !== 'all') params.append('type', filters.type)
      if (filters.category && filters.category !== 'all') params.append('category', filters.category)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.search) params.append('search', filters.search)
    }
    
    const url = `${API_BASE_URL}/transactions${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, { headers: getHeaders() })
    return handleResponse<ApiResponse<Transaction[]>>(response)
  },

  // Get single transaction
  getById: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, { 
      headers: getHeaders() 
    })
    return handleResponse<ApiResponse<Transaction>>(response)
  },

  // Create transaction
  create: async (transaction: NewTransaction): Promise<ApiResponse<Transaction>> => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(transaction),
    })
    return handleResponse<ApiResponse<Transaction>>(response)
  },

  // Update transaction
  update: async (id: string, transaction: NewTransaction): Promise<ApiResponse<Transaction>> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(transaction),
    })
    return handleResponse<ApiResponse<Transaction>>(response)
  },

  // Delete transaction
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<ApiResponse<null>>(response)
  },

  // Get statistics
  getStats: async (): Promise<ApiResponse<StatsResponse>> => {
    const response = await fetch(`${API_BASE_URL}/transactions/stats`, {
      headers: getHeaders(),
    })
    return handleResponse<ApiResponse<StatsResponse>>(response)
  },
}

// ====================================
// AUTH API
// ====================================

export const authApi = {
  // Signup
  signup: async (name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    return handleResponse<ApiResponse<AuthResponse>>(response)
  },

  // Login
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<ApiResponse<AuthResponse>>(response)
  },

  // Get current user
  getMe: async (): Promise<ApiResponse<AuthUser>> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    })
    return handleResponse<ApiResponse<AuthUser>>(response)
  },
}

// ====================================
// CATEGORY API
// ====================================

export const categoryApi = {
  // Get all categories
  getAll: async (): Promise<ApiResponse<CategoryInfo[]>> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getHeaders(),
    })
    return handleResponse<ApiResponse<CategoryInfo[]>>(response)
  },

  // Get single category
  getById: async (id: string): Promise<ApiResponse<CategoryInfo>> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`)
    return handleResponse<ApiResponse<CategoryInfo>>(response)
  },

  // Create category
  create: async (category: NewCategory): Promise<ApiResponse<CategoryInfo>> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    })
    return handleResponse<ApiResponse<CategoryInfo>>(response)
  },

  // Update category
  update: async (id: string, category: Partial<NewCategory>): Promise<ApiResponse<CategoryInfo>> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    })
    return handleResponse<ApiResponse<CategoryInfo>>(response)
  },

  // Delete category
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    })
    return handleResponse<ApiResponse<null>>(response)
  },
}

// ====================================
// EMAIL API
// ====================================

export const emailApi = {
  // Send expense report
  sendReport: async (period: 'week' | 'month' | 'year', currency: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/email/report`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ period, currency }),
    })
    return handleResponse<ApiResponse<null>>(response)
  },

  // Send budget alert
  sendBudgetAlert: async (categoryId: string, currency: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/email/budget-alert`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ categoryId, currency }),
    })
    return handleResponse<ApiResponse<null>>(response)
  },

  // Test email configuration
  testEmail: async (): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/email/test`, {
      method: 'POST',
      headers: getHeaders(),
    })
    return handleResponse<ApiResponse<null>>(response)
  },
}

// ====================================
// HEALTH CHECK
// ====================================

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    const data = await response.json()
    return data.success === true
  } catch {
    return false
  }
}

export default transactionApi