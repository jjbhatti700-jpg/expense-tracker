import { InputHTMLAttributes, forwardRef } from 'react'
import './Input.css'

// ====================================
// TYPES
// ====================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string           // Label text above input
  error?: string           // Error message below input
  helperText?: string      // Helper text below input
}

// ====================================
// COMPONENT
// ====================================

// forwardRef allows parent components to access the input element
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...rest }, ref) => {
    
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="input-wrapper">
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}

        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...rest}
        />

        {/* Error or helper text */}
        {error && <span className="input-error-text">{error}</span>}
        {!error && helperText && (
          <span className="input-helper-text">{helperText}</span>
        )}
      </div>
    )
  }
)

// Display name for debugging
Input.displayName = 'Input'

export default Input