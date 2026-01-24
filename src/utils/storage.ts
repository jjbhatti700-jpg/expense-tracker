import { Transaction, Theme, CurrencyCode } from '../types'
import { STORAGE_KEYS, APP_CONFIG } from './constants'

// ====================================
// TRANSACTION STORAGE
// ====================================

/**
 * Save transactions to localStorage
 */
export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    )
  } catch (error) {
    console.error('Error saving transactions:', error)
  }
}

/**
 * Load transactions from localStorage
 */
export const loadTransactions = (): Transaction[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error loading transactions:', error)
    return null
  }
}

// ====================================
// THEME STORAGE
// ====================================

/**
 * Save theme preference
 */
export const saveTheme = (theme: Theme): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  } catch (error) {
    console.error('Error saving theme:', error)
  }
}

/**
 * Load theme preference
 */
export const loadTheme = (): Theme => {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME)
    return (theme as Theme) || 'dark'
  } catch (error) {
    console.error('Error loading theme:', error)
    return 'dark'
  }
}

// ====================================
// CURRENCY STORAGE
// ====================================

/**
 * Save currency preference
 */
export const saveCurrency = (currency: CurrencyCode): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency)
  } catch (error) {
    console.error('Error saving currency:', error)
  }
}

/**
 * Load currency preference
 */
export const loadCurrency = (): CurrencyCode => {
  try {
    const currency = localStorage.getItem(STORAGE_KEYS.CURRENCY)
    return (currency as CurrencyCode) || APP_CONFIG.DEFAULT_CURRENCY
  } catch (error) {
    console.error('Error loading currency:', error)
    return APP_CONFIG.DEFAULT_CURRENCY
  }
}