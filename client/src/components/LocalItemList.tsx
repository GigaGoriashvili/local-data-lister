import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import SearchFilter from './SearchFilter';
import LocalItem from './LocalItem';
import type { LocalItem as ILocalItem } from '../types/localItem';

const API_BASE_URL = 'http://localhost:5000/api/local-items'; // Adjust if backend runs on different port

const getFavourites = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('favouriteEvents') || '[]');
  } catch {
    return [];
  }
};

const LocalItemList: React.FC = () => {
  const [items, setItems] = useState<ILocalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFavourites, setShowFavourites] = useState(false);
  const [favourites, setFavourites] = useState<string[]>(getFavourites());

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

  // Listen for favourite changes in localStorage (in case multiple tabs)
  useEffect(() => {
    const onStorage = () => setFavourites(getFavourites());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    setFavourites(getFavourites());
  }, [showFavourites, searchTerm]);

  const filteredItems = useMemo(() => {
    let list = items;
    if (showFavourites) {
      list = list.filter(item => favourites.includes(item._id));
    }
    if (!searchTerm) {
      return list;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return list.filter(item =>
      item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [items, searchTerm, showFavourites, favourites]);

  if (loading) {
    return <div>Loading local data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <>
      <div style={{ width:'650px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <button
          style={{
            height: '52px',
            borderRadius: '24px',
            border: showFavourites ? '2px solid #FFD600' : '1.5px solid #6c63ff',
            background: showFavourites ? '#fffbe6' : '#fff',
            color: '#3b3b5c',
            fontWeight: 600,
            fontSize: '1em',
            padding: '5px 12px',
            cursor: 'pointer',
            boxShadow: showFavourites ? '0 2px 8px rgba(255,214,0,0.10)' : '0 2px 8px rgba(60,60,100,0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            outline: 'none',
            transition: 'all 0.18s cubic-bezier(.4,1.3,.6,1)',
            transform: showFavourites ? 'scale(1.08) rotate(-4deg)' : 'scale(1)',
            filter: showFavourites ? 'drop-shadow(0 0 8px #ffe066)' : 'none',
          }}
          onClick={() => setShowFavourites(f => !f)}
          aria-pressed={showFavourites}
        >
          <span style={{
            display: 'inline-block',
            transition: 'transform 0.18s cubic-bezier(.4,1.3,.6,1)',
            transform: showFavourites ? 'scale(1.25) rotate(-10deg)' : 'scale(1)',
            color: showFavourites ? '#FFD600' : '#bbb',
            textShadow: showFavourites ? '0 2px 8px #ffe066' : 'none',
          }}>{showFavourites ? '★' : '☆'}</span> 
          Show favourites
        </button>
      </div>
      {filteredItems.length === 0 ? (
        <div>No matching items found.</div>
      ) : (
        filteredItems.map((item) => (
          <LocalItem key={item._id} item={item} />
        ))
      )}
    </>
  );
};


export default LocalItemList;