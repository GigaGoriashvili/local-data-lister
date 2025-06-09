import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LocalItem from './LocalItem';
import type { LocalItem as ILocalItem } from '../types/localItem';

const API_BASE_URL = 'http://localhost:5000/api/local-items'; // Adjust if backend runs on different port

const LocalItemList: React.FC = () => {
  const [items, setItems] = useState<ILocalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div>Loading local data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (items.length === 0) {
    return <div>No local items found.</div>;
  }

  return (
    <div>
      <h2>Local Items</h2>
      {items.map((item) => (
        <LocalItem key={item._id} item={item} />
      ))}
    </div>
  );
};

export default LocalItemList;