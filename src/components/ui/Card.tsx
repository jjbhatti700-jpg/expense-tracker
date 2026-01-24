import { HTMLAttributes, ReactNode } from 'react'
import './Card.css'

// ====================================
// TYPES
// ====================================

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// ====================================
// COMPONENT
// ====================================

function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...rest
}: CardProps) {
  
  const classNames = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  )
}

// ====================================
// SUB-COMPONENTS
// ====================================

// Card Header
interface CardHeaderProps {
  children: ReactNode
  className?: string
}

function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  )
}

// Card Title
interface CardTitleProps {
  children: ReactNode
  className?: string
}

function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`card-title ${className}`}>
      {children}
    </h3>
  )
}

// Card Content
interface CardContentProps {
  children: ReactNode
  className?: string
}

function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`card-content ${className}`}>
      {children}
    </div>
  )
}

// ====================================
// EXPORTS
// ====================================

export { Card, CardHeader, CardTitle, CardContent }
export default Card