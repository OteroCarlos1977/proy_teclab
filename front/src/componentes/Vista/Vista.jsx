// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useLocation } from 'react-router-dom';

export function Vista() {
  const location = useLocation();
  const { activeTab, id } = location.state || {};

  return (
    <div>
      <h2>Detalles de {activeTab === 'medicos' ? 'Médico' : activeTab === 'usuarios' ? 'Usuario' : activeTab === 'especialidades' ? 'Especialidad' : 'Turno'}</h2>
      <p>ID: {id}</p>
      {/* Puedes incluir lógica adicional para mostrar detalles específicos */}
    </div>
  );
}
