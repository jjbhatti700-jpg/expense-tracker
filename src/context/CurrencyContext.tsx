import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CurrencyCode } from '../types'
import { saveCurrency, loadCurrency } from '../utils/storage'
import { formatCurrency as formatCurrencyUtil, getCurrencySymbol } from '../utils/helpers'

// ====================================
// TYPES
// ====================================

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  formatAmount: (amount: number) => string
  currencySymbol: string
}

interface CurrencyProviderProps {
  children: ReactNode
}

// ====================================
// CREATE CONTEXT
// ====================================

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// ====================================
// PROVIDER COMPONENT
// ====================================

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return loadCurrency()
  })

  // Save to localStorage when currency changes
  useEffect(() => {
    saveCurrency(currency)
  }, [currency])

  // Set currency
  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency)
  }

  // Format amount with current currency
  const formatAmount = (amount: number): string => {
    return formatCurrencyUtil(amount, currency)
  }

  // Get current currency symbol
  const currencySymbol = getCurrencySymbol(currency)

  // ====================================
  // PROVIDE VALUE
  // ====================================

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatAmount,
    currencySymbol,
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

// ====================================
// CUSTOM HOOK
// ====================================

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext)
  
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  
  return context
}

export default CurrencyContext