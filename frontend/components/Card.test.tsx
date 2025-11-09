import React from 'react'
import { render, screen, fireEvent } from '../test-utils'
import { Card } from './Card'

describe('Card Component', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should render children correctly', () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Description</p>
        </Card>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('variants', () => {
    it('should apply default variant styles by default', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('shadow-[var(--shadow-sm)]')
    })

    it('should apply elevated variant styles', () => {
      const { container } = render(<Card variant="elevated">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('shadow-[var(--shadow-md)]')
    })

    it('should apply flat variant styles', () => {
      const { container } = render(<Card variant="flat">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('border-[var(--color-border-light)]')
      expect(card.className).not.toContain('shadow')
    })
  })

  describe('padding', () => {
    it('should apply large padding by default', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('p-5')
    })

    it('should apply no padding', () => {
      const { container } = render(<Card padding="none">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).not.toContain('p-')
    })

    it('should apply small padding', () => {
      const { container } = render(<Card padding="sm">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('p-3')
    })

    it('should apply medium padding', () => {
      const { container } = render(<Card padding="md">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('p-4')
    })

    it('should apply large padding', () => {
      const { container } = render(<Card padding="lg">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('p-5')
    })
  })

  describe('interactive behavior', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn()
      const { container } = render(<Card onClick={handleClick}>Content</Card>)
      const card = container.firstChild as HTMLElement
      fireEvent.click(card)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should have button role when onClick is provided', () => {
      const handleClick = jest.fn()
      render(<Card onClick={handleClick}>Content</Card>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should not have button role when onClick is not provided', () => {
      render(<Card>Content</Card>)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should be keyboard accessible with Enter key', () => {
      const handleClick = jest.fn()
      const { container } = render(<Card onClick={handleClick}>Content</Card>)
      const card = container.firstChild as HTMLElement
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be keyboard accessible with Space key', () => {
      const handleClick = jest.fn()
      const { container } = render(<Card onClick={handleClick}>Content</Card>)
      const card = container.firstChild as HTMLElement
      fireEvent.keyDown(card, { key: ' ', code: 'Space' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle Space key correctly', () => {
      const handleClick = jest.fn()
      const { container } = render(<Card onClick={handleClick}>Content</Card>)
      const card = container.firstChild as HTMLElement

      // Space key should trigger the onClick handler
      fireEvent.keyDown(card, { key: ' ', code: 'Space' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not trigger on other keys', () => {
      const handleClick = jest.fn()
      const { container } = render(<Card onClick={handleClick}>Content</Card>)
      const card = container.firstChild as HTMLElement
      fireEvent.keyDown(card, { key: 'a', code: 'KeyA' })
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should have tabIndex when onClick is provided', () => {
      const handleClick = jest.fn()
      const { container } = render(<Card onClick={handleClick}>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('should not have tabIndex when onClick is not provided', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveAttribute('tabIndex')
    })

    it('should apply interactive styles when onClick is provided', () => {
      const handleClick = jest.fn()
      const { container } = render(<Card onClick={handleClick}>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('cursor-pointer')
    })

    it('should not apply interactive styles when onClick is not provided', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).not.toContain('cursor-pointer')
    })
  })

  describe('variant and padding combinations', () => {
    it('should combine variant and padding correctly', () => {
      const { container } = render(<Card variant="elevated" padding="sm">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('shadow-[var(--shadow-md)]')
      expect(card.className).toContain('p-3')
    })

    it('should combine all props correctly', () => {
      const handleClick = jest.fn()
      const { container } = render(
        <Card variant="flat" padding="md" onClick={handleClick} className="extra-class">
          Content
        </Card>
      )
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('border-[var(--color-border-light)]')
      expect(card.className).toContain('p-4')
      expect(card.className).toContain('cursor-pointer')
      expect(card.className).toContain('extra-class')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA attributes when interactive', () => {
      const handleClick = jest.fn()
      render(<Card onClick={handleClick}>Interactive Card</Card>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('tabIndex', '0')
    })

    it('should support keyboard navigation', () => {
      const handleClick = jest.fn()
      const { container } = render(<Card onClick={handleClick}>Content</Card>)
      const card = container.firstChild as HTMLElement

      // Focus the element
      card.focus()
      expect(document.activeElement).toBe(card)

      // Trigger with Enter
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})
