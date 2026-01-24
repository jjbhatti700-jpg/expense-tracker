import { CurrencyCode } from '../types'
import { CURRENCIES } from './constants'

// ====================================
// CURRENCY FORMATTING
// ====================================

/**
 * Format number as currency based on selected currency
 */
export const formatCurrency = (amount: number, currencyCode: CurrencyCode = 'USD'): string => {
  const currency = CURRENCIES[currencyCode]
  
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currencyCode: CurrencyCode): string => {
  return CURRENCIES[currencyCode]?.symbol || '$'
}

// ====================================
// DATE FORMATTING
// ====================================

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string, format: 'short' | 'long' = 'short'): string => {
  const date = new Date(dateString)
  
  if (format === 'long') {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0]
}

/**
 * Get relative time (Today, Yesterday, X days ago)
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return formatDate(dateString)
}

// ====================================
// ID GENERATION
// ====================================

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// ====================================
// VALIDATION HELPERS
// ====================================

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (value: string): boolean => {
  return value.trim().length === 0
}

/**
 * Check if amount is valid positive number
 */
export const isValidAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount > 0
}

// ====================================
// FILTER HELPERS
// ====================================

import { Transaction, TransactionFilters } from '../types'

/**
 * Filter transactions based on filter criteria
 */
export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  return transactions.filter(t => {
    // Type filter
    if (filters.type !== 'all' && t.type !== filters.type) {
      return false
    }

    // Category filter
    if (filters.category !== 'all' && t.category !== filters.category) {
      return false
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const matchesDescription = t.description.toLowerCase().includes(searchLower)
      if (!matchesDescription) {
        return false
      }
    }

    // Start date filter
    if (filters.startDate) {
      const transactionDate = new Date(t.date)
      const startDate = new Date(filters.startDate)
      if (transactionDate < startDate) {
        return false
      }
    }

    // End date filter
    if (filters.endDate) {
      const transactionDate = new Date(t.date)
      const endDate = new Date(filters.endDate)
      if (transactionDate > endDate) {
        return false
      }
    }

    return true
  })
}