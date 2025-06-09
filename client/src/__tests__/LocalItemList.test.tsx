import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import LocalItemList from '../components/LocalItemList';
import type { LocalItem as ILocalItem } from '../types/localItem';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LocalItemList', () => {
  const mockItems: ILocalItem[] = [
    {
      _id: 'item1',
      name: 'Mock Park',
      type: 'Park',
      address: '1 Mock St',
      description: 'A mock park.',
      tags: ['mock', 'park'],
    },
  ];

  it('displays loading message initially', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockItems }); 
    render(<LocalItemList />);
    expect(screen.getByText('Loading local data...')).toBeInTheDocument();
  });

  it('fetches and displays local items', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockItems });
    render(<LocalItemList />);

    // Wait for the loading state to clear and data to appear
    await waitFor(() => {
      expect(screen.queryByText('Loading local data...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Local Items')).toBeInTheDocument();
    expect(screen.getByText('Mock Park (Park)')).toBeInTheDocument();
    expect(screen.getByText('Address: 1 Mock St')).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    render(<LocalItemList />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch local data: Network Error/i)).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading local data...')).not.toBeInTheDocument();
    expect(screen.queryByText('Local Items')).not.toBeInTheDocument();
  });

  it('displays "No local items found" when API returns empty array', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    render(<LocalItemList />);

    await waitFor(() => {
      expect(screen.getByText('No local items found.')).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading local data...')).not.toBeInTheDocument();
    expect(screen.queryByText('Local Items')).not.toBeInTheDocument();
  });
});