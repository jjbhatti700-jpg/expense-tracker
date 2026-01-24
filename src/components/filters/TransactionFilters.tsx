import { Search, Filter, X } from 'lucide-react'
import { Button, Input, Select } from '../ui'
import { CATEGORIES } from '../../utils/constants'
import { TransactionFilters as FilterType, Category, TransactionType } from '../../types'
import './TransactionFilters.css'

// ====================================
// TYPES
// ====================================

interface TransactionFiltersProps {
  filters: FilterType
  onFilterChange: (filters: FilterType) => void
  onClearFilters: () => void
}

// ====================================
// COMPONENT
// ====================================

function TransactionFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}: TransactionFiltersProps) {

  // Check if any filter is active
  const hasActiveFilters = 
    filters.type !== 'all' || 
    filters.category !== 'all' || 
    filters.searchTerm !== '' ||
    filters.startDate !== null ||
    filters.endDate !== null

  // Category options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...Object.values(CATEGORIES).map(cat => ({
      value: cat.id,
      label: cat.label,
    }))
  ]

  // Type options
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ]

  return (
    <div className="filters-container">
      {/* Search */}
      <div className="filter-search">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange({ 
            ...filters, 
            searchTerm: e.target.value 
          })}
          className="search-input"
        />
        {filters.searchTerm && (
          <button
            className="search-clear"
            onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <div className="filter-group">
          <Select
            options={typeOptions}
            value={filters.type}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              type: e.target.value as TransactionType | 'all' 
            })}
          />
        </div>

        <div className="filter-group">
          <Select
            options={categoryOptions}
            value={filters.category}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              category: e.target.value as Category | 'all' 
            })}
          />
        </div>

        <div className="filter-group date-filter">
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              startDate: e.target.value || null 
            })}
            className="date-input"
            placeholder="From"
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              endDate: e.target.value || null 
            })}
            className="date-input"
            placeholder="To"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearFilters}
            className="clear-filters-btn"
          >
            <X size={16} />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

export default TransactionFilters