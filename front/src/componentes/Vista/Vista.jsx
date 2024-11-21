// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function Vista() {
  const location = useLocation();
  const { activeTab, id } = location.state || {};
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'medicos' && id) {
      // Fetch para obtener los datos del médico
      fetch(`http://localhost:3000/api/disponibilidad/medico/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            setDatos(data.body);
          } else {
            setError('No se pudieron cargar los datos.');
          }
        })
        .catch(() => {
          setError('Error al conectarse con el servidor.');
        });
    }
  }, [activeTab, id]);

  const handleEliminar = (index) => {
    const nuevosDatos = datos.filter((_, i) => i !== index);
    setDatos(nuevosDatos);
  };

  const handleEditar = (index) => {
    const nuevosDatos = [...datos];
    const nuevoDia = prompt('Ingrese el nuevo día:', datos[index].dia);
    const nuevaHoraInicio = prompt('Ingrese la nueva hora de inicio (HH:mm:ss):', datos[index].hora_inicio);
    const nuevaHoraFin = prompt('Ingrese la nueva hora de fin (HH:mm:ss):', datos[index].hora_fin);

    if (nuevoDia && nuevaHoraInicio && nuevaHoraFin) {
      nuevosDatos[index] = {
        ...nuevosDatos[index],
        dia: nuevoDia,
        hora_inicio: nuevaHoraInicio,
        hora_fin: nuevaHoraFin,
      };
      setDatos(nuevosDatos);
    }
  };

  const handleAgregar = () => {
    const nuevoDia = prompt('Ingrese el día:');
    const nuevaHoraInicio = prompt('Ingrese la hora de inicio (HH:mm:ss):');
    const nuevaHoraFin = prompt('Ingrese la hora de fin (HH:mm:ss):');

    if (nuevoDia && nuevaHoraInicio && nuevaHoraFin) {
      setDatos([
        ...datos,
        {
          apellido: datos[0]?.apellido || '',
          nombre: datos[0]?.nombre || '',
          dia: nuevoDia,
          hora_inicio: nuevaHoraInicio,
          hora_fin: nuevaHoraFin,
        },
      ]);
    }
  };

  if (activeTab !== 'medicos') {
    return (
      <div>
        <h2>Detalles no disponibles para esta pestaña</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Detalles del Médico</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {datos.length > 0 && (
        <div>
          <h3>{`${datos[0].nombre} ${datos[0].apellido}`}</h3>
          <ul>
            {datos.map((item, index) => (
              <li key={index}>
                {`${item.dia}: ${item.hora_inicio} - ${item.hora_fin}`}
                <button onClick={() => handleEditar(index)}>Editar</button>
                <button onClick={() => handleEliminar(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleAgregar}>Agregar disponibilidad</button>
    </div>
  );
}

