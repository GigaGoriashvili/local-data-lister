import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import SearchFilter from './SearchFilter';
import LocalItem from './LocalItem';
import type { LocalItem as ILocalItem } from '../types/localItem';

const API_BASE_URL = 'http://localhost:5000/api/local-items'; // Adjust if backend runs on different port

const LocalItemList: React.FC = () => {
  const [items, setItems] = useState<ILocalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get<ILocalItem[]>(API_BASE_URL);
        setItems(response.data);
      } catch (err: any) {
        setError('Failed to fetch local data: ' + err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [items, searchTerm]); // Recalculate only when items or searchTerm changes

  if (loading) {
    return <div>Loading local data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Local Items</h2>
      <SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} /> {/* Integrate SearchFilter */}
      {filteredItems.length === 0 ? (
        <div>No matching items found.</div>
      ) : (
        filteredItems.map((item) => (
          <LocalItem key={item._id} item={item} />
        ))
      )}
    </div>
  );
};


export default LocalItemList;