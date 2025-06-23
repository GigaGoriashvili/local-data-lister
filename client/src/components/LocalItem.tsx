import React, { useState } from 'react';
import type { LocalItem as ILocalItem } from '../types/localItem';

interface LocalItemProps {
  item: ILocalItem;
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(44, 44, 60, 0.45)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeInOverlay 0.25s',
};

const modalContentStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)',
  borderRadius: '18px',
  boxShadow: '0 4px 32px rgba(60,60,100,0.18)',
  width: '60vw',
  maxWidth: 800,
  minWidth: 320,
  padding: '32px',
  position: 'relative',
  animation: 'modalPopIn 0.33s cubic-bezier(0.23, 1, 0.32, 1)',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 18,
  right: 24,
  background: 'transparent',
  border: 'none',
  fontSize: '2rem',
  color: '#6c63ff',
  cursor: 'pointer',
  zIndex: 1001,
};

// Add keyframes for modal animation
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes modalPopIn {
  0% { opacity: 0; transform: scale(0.85) translateY(40px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes fadeInOverlay {
  0% { opacity: 0; }
  100% { opacity: 1; }
}`;
if (!document.head.querySelector('#modal-animations')) {
  styleSheet.id = 'modal-animations';
  document.head.appendChild(styleSheet);
}

const LocalItem: React.FC<LocalItemProps> = ({ item }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(false);
  };

  return (
    <>
      <div
        style={{
          border: '1px solid #e0e0e0',
          padding: '20px',
          margin: '16px 0',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)',
          boxShadow: '0 2px 8px rgba(60,60,100,0.08)',
          transition: 'box-shadow 0.2s',
          maxWidth: 600,
          width: '100%',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={handleOpenModal}
        tabIndex={0}
        role="button"
        aria-label={`Open details for ${item.name}`}
      >
        <h3 style={{
          margin: '0 0 10px 0',
          color: '#3b3b5c',
          fontSize: '1.5em',
          fontWeight: 700,
          letterSpacing: '0.02em',
        }}>{item.name} <span style={{
          fontWeight: 400,
          fontSize: '0.8em',
          color: '#6c63ff',
          background: '#f0f0ff',
          borderRadius: '6px',
          padding: '2px 8px',
          marginLeft: 8,
        }}>{item.type}</span></h3>
        <p style={{ margin: '8px 0', color: '#444' }}><strong style={{ color: '#6c63ff' }}>Address:</strong> {item.address}</p>
        <p style={{ margin: '8px 0', color: '#444' }}><strong style={{ color: '#6c63ff' }}>Description:</strong> {item.description}</p>
        <p style={{ margin: '8px 0', color: '#444' }}><strong style={{ color: '#6c63ff' }}>Tags:</strong> {item.tags.map(tag => (
          <span key={tag} style={{
            display: 'inline-block',
            background: '#e0e7ff',
            color: '#3b3b5c',
            borderRadius: '4px',
            padding: '2px 8px',
            margin: '0 6px 0 0',
            fontSize: '0.9em',
          }}>{tag}</span>
        ))}</p>
      </div>
      {showModal && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div
            style={modalContentStyle}
            onClick={e => e.stopPropagation()}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${item.name}`}
          >
            <button style={closeButtonStyle} onClick={handleCloseModal} aria-label="Close modal">&times;</button>
            <h2 style={{
              color: '#3b3b5c',
              fontSize: '2em',
              fontWeight: 700,
              marginBottom: 16,
            }}>{item.name} <span style={{
              fontWeight: 400,
              fontSize: '0.9em',
              color: '#6c63ff',
              background: '#f0f0ff',
              borderRadius: '6px',
              padding: '2px 10px',
              marginLeft: 8,
            }}>{item.type}</span></h2>
            <p style={{ margin: '16px 0', color: '#444', fontSize: '1.1em' }}><strong style={{ color: '#6c63ff' }}>Address:</strong> {item.address}</p>
            <p style={{ margin: '16px 0', color: '#444', fontSize: '1.1em' }}><strong style={{ color: '#6c63ff' }}>Description:</strong> {item.description}</p>
            <p style={{ margin: '16px 0', color: '#444', fontSize: '1.1em' }}><strong style={{ color: '#6c63ff' }}>Tags:</strong> {item.tags.map(tag => (
              <span key={tag} style={{
                display: 'inline-block',
                background: '#e0e7ff',
                color: '#3b3b5c',
                borderRadius: '4px',
                padding: '2px 10px',
                margin: '0 8px 0 0',
                fontSize: '1em',
              }}>{tag}</span>
            ))}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default LocalItem;