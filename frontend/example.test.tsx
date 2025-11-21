import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

// Example test to demonstrate testing patterns
describe('Example Test Suite', () => {
  test('should render a simple component', () => {
    const TestComponent = () => <div>Hello Test</div>;

    render(<TestComponent />);

    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });

  test('should handle user interactions', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    const ButtonComponent = ({ onClick }: { onClick: () => void }) => (
      <button onClick={onClick}>Click me</button>
    );

    render(<ButtonComponent onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('should handle async operations', async () => {
    const AsyncComponent = () => {
      const [data, setData] = React.useState<string>('');

      React.useEffect(() => {
        // Simulate async data loading
        setTimeout(() => setData('Loaded data'), 100);
      }, []);

      return <div>{data || 'Loading...'}</div>;
    };

    render(<AsyncComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for async operation to complete
    await screen.findByText('Loaded data');
    expect(screen.getByText('Loaded data')).toBeInTheDocument();
  });
});
