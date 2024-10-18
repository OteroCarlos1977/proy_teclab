// src/componentes/Navbar/Navbar.jsx

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";

// eslint-disable-next-line react/prop-types
export function Navbar({ isLoggedIn, onLogoutClick }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      onLogoutClick(); // Ejecuta la función de logout
      navigate('/');   // Redirige al usuario a la página principal
    } else {
      navigate('/login'); // Redirige al usuario a la página de login
    }
  };

  return (
    <nav className="navbar">
      <img src="/logo_Cast.png" alt="Logo" className="navbar-logo" /> {/* Asegúrate de que la ruta es correcta */}
      <h2>Turnero Hospital Municipal</h2>
      <button className="login-icon" onClick={handleButtonClick}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </nav>
  );
}
