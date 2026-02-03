import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Transaction, NewTransaction } from '../types'
import { transactionApi } from '../services/api'
import { useAuth } from './AuthContext'

// ====================================
// TYPES
// ====================================

interface TransactionContextType {
  // Data
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  
  // Actions
  addTransaction: (transaction: NewTransaction) => Promise<void>
  updateTransaction: (id: string, transaction: NewTransaction) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  refreshTransactions: () => Promise<void>
  
  // Computed values
  totalIncome: number
  totalExpenses: number
  balance: number
}

interface TransactionProviderProps {
  children: ReactNode
}

// ====================================
// CREATE CONTEXT
// ====================================

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)
const { isAuthenticated } = useAuth()
// ====================================
// PROVIDER COMPONENT
// ====================================

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ====================================
  // FETCH TRANSACTIONS
  // ====================================
  
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await transactionApi.getAll()
      
      if (response.success && response.data) {
        // Transform _id to id for frontend compatibility
        const transformedData = response.data.map((t: any) => ({
          ...t,
          id: t._id || t.id,
        }))
        setTransactions(transformedData)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions'
      setError(message)
      console.error('Error fetching transactions:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

// Fetch on mount ONLY if authenticated
useEffect(() => {
  if (isAuthenticated) {
    fetchTransactions()
  }
}, [isAuthenticated, fetchTransactions])
  // ====================================
  // ACTIONS
  // ====================================

  // Add new transaction
  const addTransaction = async (newTransaction: NewTransaction) => {
    try {
      setError(null)
      const response = await transactionApi.create(newTransaction)
      
      if (response.success && response.data) {
        const transformedTransaction = {
          ...response.data,
          id: (response.data as any)._id || response.data.id,
        }
        setTransactions(prev => [transformedTransaction, ...prev])
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add transaction'
      setError(message)
      throw err
    }
  }

  // Update existing transaction
  const updateTransaction = async (id: string, updatedData: NewTransaction) => {
    try {
      setError(null)
      const response = await transactionApi.update(id, updatedData)
      
      if (response.success && response.data) {
        setTransactions(prev =>
          prev.map(t =>
            (t.id === id || (t as any)._id === id)
              ? { ...response.data!, id: (response.data as any)._id || response.data!.id }
              : t
          )
        )
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update transaction'
      setError(message)
      throw err
    }
  }

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    try {
      setError(null)
      const response = await transactionApi.delete(id)
      
      if (response.success) {
        setTransactions(prev => prev.filter(t => t.id !== id && (t as any)._id !== id))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction'
      setError(message)
      throw err
    }
  }

  // Refresh transactions
  const refreshTransactions = async () => {
    await fetchTransactions()
  }

  // ====================================
  // COMPUTED VALUES
  // ====================================

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  // ====================================
  // PROVIDE VALUE
  // ====================================

  const value: TransactionContextType = {
    transactions,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    totalIncome,
    totalExpenses,
    balance,
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

// ====================================
// CUSTOM HOOK
// ====================================

export function useTransactions(): TransactionContextType {
  const context = useContext(TransactionContext)
  
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  
  return context
}

export default TransactionContext