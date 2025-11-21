import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import { Button } from './Button';

describe('Button Component', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(<Button>Test Content</Button>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('variants', () => {
    it('should apply primary variant styles by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-[var(--color-primary)]');
    });

    it('should apply secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('border-[var(--color-accent-clay)]');
    });

    it('should apply ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
    });
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-11');
    });

    it('should apply small size styles', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-10');
    });

    it('should apply large size styles', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-12');
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when loading is true', () => {
      render(<Button loading>Loading</Button>);
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should disable button when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should set aria-busy when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should not show spinner when not loading', () => {
      render(<Button loading={false}>Not Loading</Button>);
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should disable button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('disabled:opacity-50');
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} loading>
          Click
        </Button>
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('forwarded ref', () => {
    it('should forward ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('accessibility', () => {
    it('should have correct role', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should support additional button attributes', () => {
      render(
        <Button type="submit" aria-label="Submit form">
          Submit
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('aria-label', 'Submit form');
    });
  });

  describe('variant combinations', () => {
    it('should combine variant and size correctly', () => {
      render(
        <Button variant="secondary" size="lg">
          Large Secondary
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button.className).toContain('border-[var(--color-accent-clay)]');
      expect(button.className).toContain('h-12');
    });

    it('should apply ghost variant with correct radius', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('rounded-lg');
    });
  });
});
