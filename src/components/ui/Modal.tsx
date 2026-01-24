import { ReactNode, useEffect } from 'react'
import './Modal.css'

// ====================================
// TYPES
// ====================================

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

// ====================================
// COMPONENT
// ====================================

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Don't render if not open
  if (!isOpen) return null

  // Handle backdrop click (close modal)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal modal-${size}`}>
        {/* Header */}
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal