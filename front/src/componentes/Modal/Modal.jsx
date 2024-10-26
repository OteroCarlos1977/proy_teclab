// eslint-disable-next-line no-unused-vars
import React from 'react';
import './Modal.css'; 

// eslint-disable-next-line react/prop-types
const Modal = ({ isOpen, message, data, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{message}</h2>
        {data && (
          <div>
            <p>{data}</p>
          </div>
        )}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
