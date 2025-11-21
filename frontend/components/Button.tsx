import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary:
        'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] active:scale-[0.98] focus-visible:outline-[var(--color-primary)] shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-hover)]',
      secondary:
        'bg-transparent border-2 border-[var(--color-accent-clay)] text-[var(--color-accent-clay)] hover:bg-[var(--color-accent-sand)] active:border-[#755D4E]',
      ghost:
        'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)] active:bg-[var(--color-accent-sand)]',
    };

    const sizeStyles = {
      sm: 'h-10 px-4 text-sm rounded-lg',
      md: 'h-11 px-6 text-base rounded-3xl md:h-[44px]',
      lg: 'h-12 px-6 text-base rounded-3xl',
    };

    // Adjust radius for ghost buttons
    const radiusOverride = variant === 'ghost' ? 'rounded-lg' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${radiusOverride} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
