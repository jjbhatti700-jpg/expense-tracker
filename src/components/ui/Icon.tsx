import * as LucideIcons from 'lucide-react'
import { LucideProps } from 'lucide-react'

// ====================================
// TYPES
// ====================================

interface IconProps extends LucideProps {
  name: string
}

// ====================================
// COMPONENT
// ====================================

/**
 * Dynamic Icon component
 * Renders any Lucide icon by name
 * 
 * Usage: <Icon name="Wallet" size={24} color="#fff" />
 */
function Icon({ name, ...props }: IconProps) {
  // Get the icon component from lucide-react
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<LucideProps>
  
  // If icon not found, return a default
  if (!LucideIcon) {
    const DefaultIcon = LucideIcons.HelpCircle
    return <DefaultIcon {...props} />
  }
  
  return <LucideIcon {...props} />
}

export default Icon