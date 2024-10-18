// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Button } from '../Button/Button';
import { useNavigate } from "react-router-dom";
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import './Turnos.css'

export function Turnos() {
  const [dni, setDni] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTableHeader, setShowTableHeader] = useState(false); // Nuevo estado
  const navigate = useNavigate();
  
  const fetchTurnos = async () => {
    if (!dni) {
      setError('Por favor, ingrese un DNI válido.');
      return;
    }
    setLoading(true);
    setShowTableHeader(false); // Oculta el encabezado antes de buscar
    try {
      const response = await fetch(`http://localhost:3000/api/turnos/${dni}`);
      const data = await response.json();
      console.log(data); 
      if (!data.error) {
        const turnosFiltrados = data.body.filter(turno => 
          new Date(turno.fecha_turno) >= new Date() // Filtrar por fecha actual
        );
        setTurnos(turnosFiltrados);
        setError('');
        if (turnosFiltrados.length > 0) {
          setShowTableHeader(true); // Muestra el encabezado si hay turnos
        }
      } else {
        setError('No se pudieron obtener los turnos.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    }
    setLoading(false);
  };

  const cancelarTurno = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/turnos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),  // Envía el ID del turno en el cuerpo
      });
  
      if (response.ok) {
        setTurnos(turnos.filter(turno => turno.id !== id));
      } else {
        alert('No se pudo cancelar el turno.');
      }
    } catch (err) {
      alert('Error al cancelar el turno.');
    }
  };

  const handleInputChange = (e) => {
    setDni(e.target.value);
  };

  const handleBuscarClick = () => {
    fetchTurnos();
  };

  return (
    <div>
      <h1>Buscar Turnos</h1>
      <input
        type="text"
        placeholder="Ingrese DNI"
        value={dni}
        onChange={handleInputChange}
      />
      <Button
          texto="Buscar"
          style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }}
          onClick={() => handleBuscarClick()}
        />
      
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showTableHeader && ( // Solo muestra la tabla si showTableHeader es true
        <table>
          <thead>
            <tr>
              <th>Dr.</th>
              <th>Especialidad</th>
              <th>Fecha</th>
              <th>Horario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map(turno => (
              <tr key={turno.id}>
                <td>{turno.apellido}, {turno.nombre}</td>
                <td>{turno.especialidad}</td>
                <td>{new Date(turno.fecha_turno).toLocaleDateString()}</td>
                <td>{turno.horario}</td>
                <td>
                  <Button 
                    icono={faTrash}
                    style={{ backgroundColor: 'red', borderRadius: '50%', color: 'white', border: 'none', padding: '10px 15px' }} 
                    onClick={() => cancelarTurno(turno.id)}
                    tooltip="Eliminar"
                     
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Button
        texto="Volver"
        style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }}
        onClick={() => navigate("/")}
      />
    </div>
  );
}
