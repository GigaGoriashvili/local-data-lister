import React from 'react';
import type { LocalItem as ILocalItem } from '../types/localItem';

interface LocalItemProps {
  item: ILocalItem;
}

const LocalItem: React.FC<LocalItemProps> = ({ item }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px' }}>
      <h3>{item.name} ({item.type})</h3>
      <p><strong>Address:</strong> {item.address}</p>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Tags:</strong> {item.tags.join(', ')}</p>
    </div>
  );
};

export default LocalItem;