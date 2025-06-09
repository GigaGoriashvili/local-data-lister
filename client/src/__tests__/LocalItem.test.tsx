import { render, screen } from '@testing-library/react';
import LocalItem from '../components/LocalItem';
import type { LocalItem as ILocalItem } from '../types/localItem'; // Alias to avoid conflict

describe('LocalItem', () => {
  const mockItem: ILocalItem = {
    _id: 'test-id-123',
    name: 'Test Cafe',
    type: 'Restaurant',
    address: '1 Test Street',
    description: 'A place for testing.',
    tags: ['coffee', 'test'],
  };

  it('renders item details correctly', () => {
    render(<LocalItem item={mockItem} />);

    expect(screen.getByText('Test Cafe (Restaurant)')).toBeInTheDocument();
    expect(screen.getByText('Address: 1 Test Street')).toBeInTheDocument();
    expect(screen.getByText('Description: A place for testing.')).toBeInTheDocument();
    expect(screen.getByText('Tags: coffee, test')).toBeInTheDocument();
  });
});