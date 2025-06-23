import React from 'react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div style={{
      marginBottom: '32px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    }}>
      <input
        type="text"
        placeholder="Search by name, type, description or tags..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          padding: '14px 18px',
          width: '100%',
          maxWidth: 400,
          borderRadius: '24px',
          border: '1.5px solid #6c63ff',
          background: '#fff',
          color: '#3b3b5c',
          fontSize: '1.08em',
          boxShadow: '0 2px 8px rgba(60,60,100,0.07)',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      />
    </div>
  );
};

export default SearchFilter;