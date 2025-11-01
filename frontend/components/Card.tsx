import React from 'react'

export interface CardProps {
  variant?: 'default' | 'elevated' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'lg',
  className = '',
  children,
  onClick
}) => {
  const baseStyles = 'bg-white rounded-2xl transition-all duration-200'

  const variantStyles = {
    default: 'border border-[var(--color-border-light)] shadow-[var(--shadow-sm)]',
    elevated: 'border border-[var(--color-border-light)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]',
    flat: 'border border-[var(--color-border-light)]'
  }

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5'
  }

  const interactiveStyles = onClick
    ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]'
    : ''

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {children}
    </div>
  )
}
