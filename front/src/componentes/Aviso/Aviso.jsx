// eslint-disable-next-line no-unused-vars
import React from 'react';
import '../../App.css'; // Estilo para la tarjeta

// eslint-disable-next-line react/prop-types
export function Aviso({ message, buttonText, onButtonClick }) {
  return (
    <div className="message-card">
      <p>{message}</p>
      <button onClick={onButtonClick} className="message-card-button">
        {buttonText}
      </button>
    </div>
  );
}