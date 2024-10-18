// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import './Administrador.css';

export function Administrador() {
  const location = useLocation();
  const { nombre, apellido } = location.state || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [medicos, setMedicos] = useState([]);

  // Efecto para obtener la lista de médicos
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/medicos');
        const data = await response.json();
        if (!data.error && data.body) {
          setMedicos(data.body);
        } else {
          console.error('Error al obtener la lista de médicos');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchMedicos();
  }, []);

  // Filtrar médicos según el término de búsqueda
  const filteredMedicos = medicos.filter(medico =>
    Object.values(medico).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
    <div className='encabezado'>
      <h4>Se encuentra administrando: <strong>{nombre} {apellido}</strong></h4>
    </div> 
      <input
      className='busqueda'
        type="text"
        placeholder="Buscar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Especialidad</th>
            <th>Teléfono</th>
            <th>Fecha de Ingreso</th>
            <th>Matrícula</th>
            <th>Acciones</th> {/* Nueva columna para los botones */}
          </tr>
        </thead>
        <tbody>
          {filteredMedicos.map((medico) => (
            <tr key={medico.id}>
              <td>{medico.id}</td>
              <td>{medico.nombre}</td>
              <td>{medico.apellido}</td>
              <td>{medico.especialidad_id}</td>
              <td>{medico.telefono}</td>
              <td>{new Date(medico.fecha_ingreso).toLocaleDateString()}</td>
              <td>{medico.matricula}</td>
              <td>
                <button className="ver" onClick={() => handleView(medico.id)}>👁️</button>
                <button className="editar" onClick={() => handleEdit(medico.id)}>✏️</button>
                <button className="eliminar" onClick={() => handleDelete(medico.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// Funciones para manejar los botones (puedes personalizarlas)
const handleView = (id) => {
  console.log(`Ver detalles del médico con ID: ${id}`);
  // Lógica para ver los detalles del médico
};

const handleEdit = (id) => {
  console.log(`Editar médico con ID: ${id}`);
  // Lógica para editar el médico
};

const handleDelete = (id) => {
  console.log(`Eliminar médico con ID: ${id}`);
  // Lógica para eliminar el médico
};
