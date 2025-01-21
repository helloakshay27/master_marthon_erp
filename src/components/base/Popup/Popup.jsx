import React from 'react';
import PropTypes from 'prop-types';

const PopupBox = ({ 
  title, 
  show, 
  onClose, 
  children, 
  footerButtons 
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50px',
        right: '0',
        zIndex: 1000,
        width: '300px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '16px',
      }}
    >
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h5 style={{ margin: 0 }}>{title}</h5>
        <button 
          onClick={onClose} 
          style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
        >
          ✖
        </button>
      </div>

      {/* Body Content */}
      <div>{children}</div>

      {/* Footer Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        {footerButtons?.map((btn, index) => (
          <button
            key={index}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={btn.onClick}
            {...btn.props}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopupBox;
