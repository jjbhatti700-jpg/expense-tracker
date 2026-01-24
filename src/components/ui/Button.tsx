import { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

// ====================================
// TYPES
// ====================================

// Button variants for different styles
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

// Button sizes
type ButtonSize = 'sm' | 'md' | 'lg'

// Props interface - extends native button attributes
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode          // Button text/content
  variant?: ButtonVariant      // Style variant
  size?: ButtonSize            // Size variant
  fullWidth?: boolean          // Take full width of parent
  isLoading?: boolean          // Show loading state
}

// ====================================
// COMPONENT
// ====================================

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  ...rest  // All other native button props (onClick, type, etc.)
}: ButtonProps) {
  
  // Build class names based on props
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    isLoading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="btn-spinner" />
      ) : (
        children
      )}
    </button>
  )
}

export default Button