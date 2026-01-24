import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useTransactions, useCategories, useCurrency } from '../../context'
import { Icon } from '../ui'
import './BudgetProgress.css'

// ====================================
// TYPES
// ====================================

interface BudgetStatus {
  categoryId: string
  label: string
  icon: string
  color: string
  budget: number
  spent: number
  percentage: number
  status: 'ok' | 'warning' | 'exceeded'
}

// ====================================
// COMPONENT
// ====================================

function BudgetProgress() {
  const { transactions } = useTransactions()
  const { categories } = useCategories()
  const { formatAmount } = useCurrency()

  // Get current month's start and end dates
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Calculate spending per category for current month
  const monthlySpending = transactions
    .filter(t => {
      const date = new Date(t.date)
      return t.type === 'expense' && date >= monthStart && date <= monthEnd
    })
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  // Get categories with budgets
  const budgetStatuses: BudgetStatus[] = categories
    .filter(cat => cat.budget && cat.budget > 0)
    .map(cat => {
      const spent = monthlySpending[cat.id] || 0
      const percentage = (spent / cat.budget!) * 100
      
      let status: 'ok' | 'warning' | 'exceeded' = 'ok'
      if (percentage >= 100) {
        status = 'exceeded'
      } else if (percentage >= 80) {
        status = 'warning'
      }

      return {
        categoryId: cat.id,
        label: cat.label,
        icon: cat.icon,
        color: cat.color,
        budget: cat.budget!,
        spent,
        percentage,
        status,
      }
    })
    .sort((a, b) => b.percentage - a.percentage) // Sort by percentage (highest first)

  // If no budgets set, show message
  if (budgetStatuses.length === 0) {
    return (
      <div className="budget-empty">
        <p>No budgets set</p>
        <span>Set budgets in Settings → Categories</span>
      </div>
    )
  }

  return (
    <div className="budget-progress-list">
      {budgetStatuses.map(item => (
        <div key={item.categoryId} className={`budget-item ${item.status}`}>
          <div className="budget-item-header">
            <div className="budget-category">
              <div 
                className="budget-icon"
                style={{ backgroundColor: item.color + '20' }}
              >
                <Icon name={item.icon} size={16} color={item.color} />
              </div>
              <span className="budget-label">{item.label}</span>
            </div>
            <div className="budget-status-icon">
              {item.status === 'ok' && <CheckCircle size={16} className="status-ok" />}
              {item.status === 'warning' && <AlertTriangle size={16} className="status-warning" />}
              {item.status === 'exceeded' && <XCircle size={16} className="status-exceeded" />}
            </div>
          </div>
          
          <div className="budget-bar-container">
            <div 
              className={`budget-bar ${item.status}`}
              style={{ width: `${Math.min(item.percentage, 100)}%` }}
            />
          </div>
          
          <div className="budget-details">
            <span className="budget-spent">
              {formatAmount(item.spent)} spent
            </span>
            <span className="budget-limit">
              of {formatAmount(item.budget)}
            </span>
            <span className={`budget-percentage ${item.status}`}>
              {item.percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BudgetProgress