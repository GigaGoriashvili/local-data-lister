import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import LocalItemList from '../components/LocalItemList';
import type { LocalItem as ILocalItem } from '../types/localItem';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LocalItemList', () => {
  const mockItems: ILocalItem[] = [
    { _id: 'item1', name: 'Coffee Shop', type: 'Restaurant', address: '123 Main', description: 'Great coffee', tags: ['coffee', 'cafe'] },
    { _id: 'item2', name: 'Central Park', type: 'Park', address: '456 Elm', description: 'Green space', tags: ['outdoor', 'nature'] },
    { _id: 'item3', name: 'Sushi Bar', type: 'Restaurant', address: '789 Oak', description: 'Fresh fish', tags: ['japanese', 'food'] },
  ];

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockItems });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

    it('filters items by search term (case-insensitive name)', async () => {
    render(<LocalItemList />);
    await waitFor(() => expect(screen.getByText('Coffee Shop (Restaurant)')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Search by name, type, description or tags.../i);
    fireEvent.change(searchInput, { target: { value: 'coffee' } });

    expect(screen.getByText('Coffee Shop (Restaurant)')).toBeInTheDocument();
    expect(screen.queryByText('Central Park (Park)')).not.toBeInTheDocument();
    expect(screen.queryByText('Sushi Bar (Restaurant)')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'COFFEE' } }); // Test case-insensitivity
    expect(screen.getByText('Coffee Shop (Restaurant)')).toBeInTheDocument();
    expect(screen.queryByText('Central Park (Park)')).not.toBeInTheDocument();
  });

  it('filters items by search term (description)', async () => {
    render(<LocalItemList />);
    await waitFor(() => expect(screen.getByText('Coffee Shop (Restaurant)')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Search by name, type, description or tags.../i);
    fireEvent.change(searchInput, { target: { value: 'Green space' } });

    expect(screen.queryByText('Coffee Shop (Restaurant)')).not.toBeInTheDocument();
    expect(screen.getByText('Central Park (Park)')).toBeInTheDocument();
  });

  it('filters items by search term (tags)', async () => {
    render(<LocalItemList />);
    await waitFor(() => expect(screen.getByText('Coffee Shop (Restaurant)')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Search by name, type, description or tags.../i);
    fireEvent.change(searchInput, { target: { value: 'japanese' } });

    expect(screen.queryByText('Coffee Shop (Restaurant)')).not.toBeInTheDocument();
    expect(screen.getByText('Sushi Bar (Restaurant)')).toBeInTheDocument();
  });

  it('displays "No matching items found" when filter yields no results', async () => {
    render(<LocalItemList />);
    await waitFor(() => expect(screen.getByText('Coffee Shop (Restaurant)')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Search by name, type, description or tags.../i);
    fireEvent.change(searchInput, { target: { value: 'xyz_non_existent' } });

    expect(screen.queryByText('Coffee Shop (Restaurant)')).not.toBeInTheDocument();
    expect(screen.getByText('No matching items found.')).toBeInTheDocument();
  });

  it('clears filter when search term is empty', async () => {
    render(<LocalItemList />);
    await waitFor(() => expect(screen.getByText('Coffee Shop (Restaurant)')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Search by name, type, description or tags.../i);
    fireEvent.change(searchInput, { target: { value: 'coffee' } });
    expect(screen.queryByText('Central Park (Park)')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Coffee Shop (Restaurant)')).toBeInTheDocument();
    expect(screen.getByText('Central Park (Park)')).toBeInTheDocument();
  });
});