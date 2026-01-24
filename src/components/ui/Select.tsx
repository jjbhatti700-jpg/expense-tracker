import { SelectHTMLAttributes, forwardRef } from 'react'
import './Select.css'

// ====================================
// TYPES
// ====================================

interface Option {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Option[]
  placeholder?: string
}

// ====================================
// COMPONENT
// ====================================

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...rest }, ref) => {
    
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="select-wrapper">
        {/* Label */}
        {label && (
          <label htmlFor={selectId} className="select-label">
            {label}
          </label>
        )}

        {/* Select field */}
        <div className="select-container">
          <select
            ref={ref}
            id={selectId}
            className={`select ${error ? 'select-error' : ''} ${className}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom arrow icon */}
          <span className="select-arrow">▼</span>
        </div>

        {/* Error text */}
        {error && <span className="select-error-text">{error}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select