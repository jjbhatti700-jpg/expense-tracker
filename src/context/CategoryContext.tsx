import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { CategoryInfo, NewCategory } from '../types'
import { categoryApi } from '../services/api'
import { useAuth } from './AuthContext'

// ====================================
// TYPES
// ====================================

interface CategoryContextType {
  // Data
  categories: CategoryInfo[]
  isLoading: boolean
  error: string | null

  // Actions
  addCategory: (category: NewCategory) => Promise<void>
  updateCategory: (id: string, category: Partial<NewCategory>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  refreshCategories: () => Promise<void>

  // Helpers
  getCategoryById: (id: string) => CategoryInfo | undefined
  getCategoriesMap: () => Record<string, CategoryInfo>
}

interface CategoryProviderProps {
  children: ReactNode
}

// ====================================
// CREATE CONTEXT
// ====================================

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

// ====================================
// PROVIDER COMPONENT
// ====================================

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<CategoryInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
const { isAuthenticated } = useAuth() 

  // ====================================
  // FETCH CATEGORIES
  // ====================================

  const fetchCategories = useCallback(async () => {
     // Don't fetch if no token
  const token = localStorage.getItem('token')
  if (!token) {
    setIsLoading(false)
    return
  }

  try {
    setIsLoading(true)
    setError(null)
    
    const response = await categoryApi.getAll()
    
    if (response.success && response.data) {
      const transformedData = response.data.map((t: any) => ({
        ...t,
        id: t._id || t.id,
      }))
      setCategories(transformedData)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch transactions'
    setError(message)
    console.error('Error fetching transactions:', err)
  } finally {
    setIsLoading(false)
  }
}, [])

 // Fetch categories ONLY if authenticated
useEffect(() => {
  if (isAuthenticated) {
    fetchCategories()
  }
}, [isAuthenticated, fetchCategories])
  // ====================================
  // ACTIONS
  // ====================================

  // Add new category
  const addCategory = async (newCategory: NewCategory) => {
    try {
      setError(null)
      const response = await categoryApi.create(newCategory)

      if (response.success && response.data) {
        setCategories(prev => [...prev, response.data!])
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add category'
      setError(message)
      throw err
    }
  }

  // Update existing category
  const updateCategory = async (id: string, updatedData: Partial<NewCategory>) => {
    try {
      setError(null)
      const response = await categoryApi.update(id, updatedData)

      if (response.success && response.data) {
        setCategories(prev =>
          prev.map(c => (c.id === id ? response.data! : c))
        )
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update category'
      setError(message)
      throw err
    }
  }

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      setError(null)
      const response = await categoryApi.delete(id)

      if (response.success) {
        setCategories(prev => prev.filter(c => c.id !== id))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category'
      setError(message)
      throw err
    }
  }

  // Refresh categories
  const refreshCategories = async () => {
    await fetchCategories()
  }

  // ====================================
  // HELPERS
  // ====================================

  const getCategoryById = (id: string): CategoryInfo | undefined => {
    return categories.find(c => c.id === id)
  }

  const getCategoriesMap = (): Record<string, CategoryInfo> => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat
      return acc
    }, {} as Record<string, CategoryInfo>)
  }

  // ====================================
  // PROVIDE VALUE
  // ====================================

  const value: CategoryContextType = {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    getCategoryById,
    getCategoriesMap,
  }

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  )
}

// ====================================
// CUSTOM HOOK
// ====================================

export function useCategories(): CategoryContextType {
  const context = useContext(CategoryContext)

  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider')
  }

  return context
}

export default CategoryContext