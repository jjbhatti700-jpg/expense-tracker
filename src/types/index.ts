// ====================================
// TRANSACTION TYPES
// ====================================

// Transaction can be either income or expense
export type TransactionType = 'income' | 'expense'

// Category is now a string to support custom categories
export type Category = string

// Main Transaction interface
export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: Category
  description: string
  date: string // ISO date string: "2025-01-22"
}

// For creating new transaction (id is generated automatically)
export interface NewTransaction {
  type: TransactionType
  amount: number
  category: Category
  description: string
  date: string
}

// ====================================
// CATEGORY TYPES
// ====================================

export interface CategoryInfo {
  id: string
  label: string
  color: string
  icon: string // Icon name from lucide-react
  isDefault?: boolean
  budget?: number | null  // Monthly budget limit
}

export interface NewCategory {
  id: string
  label: string
  icon: string
  color: string
  budget?: number | null
}

// ====================================
// CURRENCY TYPES
// ====================================

// Allow any string as currency code for flexibility
export type CurrencyCode = string

export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
  locale: string
}

// ====================================
// FILTER TYPES
// ====================================

export interface TransactionFilters {
  type: TransactionType | 'all'
  category: Category | 'all'
  startDate: string | null
  endDate: string | null
  searchTerm: string
}

// ====================================
// THEME TYPES
// ====================================

export type Theme = 'light' | 'dark'

// ====================================
// CHART DATA TYPES
// ====================================

export interface CategoryChartData {
  name: string
  value: number
  color: string
}

export interface MonthlyChartData {
  month: string
  income: number
  expenses: number
}