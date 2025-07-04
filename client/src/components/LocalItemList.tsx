import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import SearchFilter from './SearchFilter';
import LocalItem from './LocalItem';
import type { LocalItem as ILocalItem } from '../types/localItem';
import ReactDOM from 'react-dom';

const API_BASE_URL = 'http://54.221.74.132/api/local-items';

const getFavourites = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('favouriteEvents') || '[]');
  } catch {
    return [];
  }
};

const PAGE_SIZE = 10;
const CACHE_KEY_PREFIX = 'localItemsPage_';

const LocalItemList: React.FC = () => {
  const [items, setItems] = useState<ILocalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFavourites, setShowFavourites] = useState(false);
  const [favourites, setFavourites] = useState<string[]>(getFavourites());
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchItems = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setSkip(0);
        // Clear cache on reset
        Object.keys(sessionStorage)
          .filter(key => key.startsWith(CACHE_KEY_PREFIX))
          .forEach(key => sessionStorage.removeItem(key));
      } else {
        setLoadingMore(true);
      }
      const pageSkip = reset ? 0 : skip;
      const cacheKey = `${CACHE_KEY_PREFIX}${pageSkip}`;
      let newItems: ILocalItem[] = [];
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        newItems = JSON.parse(cached);
      } else {
        const response = await axios.get<ILocalItem[]>(API_BASE_URL + `?limit=${PAGE_SIZE}&skip=${pageSkip}`);
        newItems = response.data;
        sessionStorage.setItem(cacheKey, JSON.stringify(newItems));
      }
      if (reset) {
        setItems(newItems);
        setHasMore(newItems.length === PAGE_SIZE);
        setSkip(newItems.length);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setHasMore(newItems.length === PAGE_SIZE);
        setSkip(prev => prev + newItems.length);
      }
    } catch (err: any) {
      setError('Failed to fetch local data: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchItems(true);
    // eslint-disable-next-line
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

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      {hasMore && !showFavourites && !searchTerm && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button onClick={() => fetchItems(false)} disabled={loadingMore} style={{
            padding: '10px 24px',
            fontSize: '1.1em',
            borderRadius: '20px',
            border: '1.5px solid #6c63ff',
            background: '#f7f7ff',
            color: '#3b3b5c',
            fontWeight: 600,
            cursor: loadingMore ? 'not-allowed' : 'pointer',
            opacity: loadingMore ? 0.6 : 1,
            marginTop: 10
          }}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      {showScrollTop && ReactDOM.createPortal(
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: 50,
            right: 130,
            zIndex: 1000,
            background: '#6c63ff',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            boxShadow: '0 2px 12px rgba(60,60,100,0.18)',
            fontSize: 28,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, transform 0.18s cubic-bezier(.4,1.3,.6,1)',
            outline: 'none',
          }}
          aria-label="Scroll to top"
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.85)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ↑
        </button>,
        document.body
      )}
    </>
  );
};


export default LocalItemList;