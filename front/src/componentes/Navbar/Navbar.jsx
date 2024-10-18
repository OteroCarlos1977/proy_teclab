// eslint-disable-next-line no-unused-vars
import React from 'react';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Button} from '../Button/Button';
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

  const buttonStyles = {
    backgroundColor: 'transparent',
    color: isLoggedIn ? 'red' : 'green', 
    fontSize: '2rem',  
    fontWeight: 'bolder',
    border: 'black',
    cursor: 'pointer',
    padding: '10px 20px',
    
  };

  return (
    <nav className="navbar">
      <img src="/logo_Cast.png" alt="Logo" className="navbar-logo" />
      <h2>Turnero Hospital Municipal</h2>
      <Button
      style={buttonStyles}
      tooltip={isLoggedIn ? "Salir" : "Ingresar"}
      icono={isLoggedIn ? faSignOutAlt : faSignInAlt}
      onClick={handleButtonClick}
      />
    </nav>
  );
}

