// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../Button/Button'; // Asegúrate de importar el botón correctamente
import { faEdit, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';

export const VistaTurnos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vista } = location.state || { vista: 'todos' }; // Valor predeterminado

  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/turnos/');
        const data = await response.json();

        if (!data.error && data.body) {
          const hoy = new Date();

          const formattedData = data.body
            .map(turno => {
              const fechaTurno = new Date(turno.fecha_turno);
              const formattedFechaTurno = fechaTurno.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });

              const horario = turno.horario.slice(0, 5);

              return {
                ...turno,
                fecha_turno: formattedFechaTurno,
                horario: horario,
                fecha_original: fechaTurno,
              };
            })
            .filter(turno => turno.fecha_original > hoy);

          setTurnos(formattedData);

          // Generar listas únicas de médicos y especialidades
          const uniqueMedicos = [...new Set(formattedData.map(turno => `${turno.medico_nombre} ${turno.medico_apellido}`))];
          const uniqueEspecialidades = [...new Set(formattedData.map(turno => turno.especialidad))];

          setMedicos(uniqueMedicos);
          setEspecialidades(uniqueEspecialidades);
        }
      } catch (error) {
        console.error('Error al obtener la lista de turnos:', error);
      }
    };

    fetchTurnos();
  }, []);

  useEffect(() => {
    switch (vista) {
      case 'todos':
        setFilteredTurnos(turnos);
        break;
      case 'dni':
      case 'medico':
      case 'especialidad':
        setIsModalOpen(true);
        break;
      default:
        setFilteredTurnos([]);
        break;
    }
  }, [vista, turnos]);

  const handleFilter = () => {
    let filtered;
    if (vista === 'dni') {
      filtered = turnos.filter(turno => turno.paciente_dni.toString() === filterValue);
    } else if (vista === 'medico') {
      filtered = turnos.filter(turno => `${turno.medico_nombre} ${turno.medico_apellido}` === filterValue);
    } else if (vista === 'especialidad') {
      filtered = turnos.filter(turno => turno.especialidad === filterValue);
    }
    setFilteredTurnos(filtered);
    setIsModalOpen(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Listado de Turnos', 10, 10);
    let startY = 20;

    filteredTurnos.forEach((turno, index) => {
      const text = `#${index + 1} - Paciente: ${turno.paciente_nombre} ${turno.paciente_apellido}, Fecha: ${turno.fecha_turno}, Horario: ${turno.horario}, Especialidad: ${turno.especialidad}, Médico: ${turno.medico_nombre} ${turno.medico_apellido}`;
      doc.text(text, 10, startY);
      startY += 10;
    });

    doc.save('listado-turnos.pdf');
  };

  const renderTabla = () => (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nombre Paciente</th>
            <th>Fecha Turno</th>
            <th>Horario</th>
            <th>Especialidad</th>
            <th>Nombre Medico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTurnos.map(turno => (
            <tr key={turno.id}>
              <td>{`${turno.paciente_nombre} ${turno.paciente_apellido}`}</td>
              <td>{turno.fecha_turno}</td>
              <td>{turno.horario}</td>
              <td>{turno.especialidad}</td>
              <td>{`${turno.medico_nombre} ${turno.medico_apellido}`}</td>
              <td>
                <Button
                  style={{ backgroundColor: 'rgba(0, 174, 13, 0.8)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }}
                  icono={faEdit}
                  tooltip="Editar"
                  onClick={() => console.log('Editar', turno.id)}
                />
                <Button
                  style={{ backgroundColor: 'rgba(0, 174, 131, 0.8)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }}
                  icono={faTrash}
                  tooltip="Eliminar"
                  onClick={() => console.log('Eliminar', turno.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        texto="Descargar PDF"
        icono={faDownload}
        onClick={downloadPDF}
        style={{ marginTop: '20px', backgroundColor: 'rgba(0, 123, 255, 0.8)' }}
      />
    </div>
  );

  const renderModal = () => (
    <div className="modal">
      <div className="modal-content">
        <h3>Filtrar por {vista}</h3>
        {vista === 'dni' && (
          <input
            type="text"
            placeholder="Ingrese DNI del paciente"
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
          />
        )}
        {vista === 'medico' && (
          <select value={filterValue} onChange={e => setFilterValue(e.target.value)}>
            <option value="">Seleccione un Médico</option>
            {medicos.map((medico, index) => (
              <option key={index} value={medico}>{medico}</option>
            ))}
          </select>
        )}
        {vista === 'especialidad' && (
          <select value={filterValue} onChange={e => setFilterValue(e.target.value)}>
            <option value="">Seleccione una Especialidad</option>
            {especialidades.map((especialidad, index) => (
              <option key={index} value={especialidad}>{especialidad}</option>
            ))}
          </select>
        )}
        <div>
          <Button texto="Filtrar" onClick={handleFilter} />
          <Button texto="Cancelar" onClick={() => setIsModalOpen(false)} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="encabezado">
        <h4>Listado de Turnos</h4>
        <Button
          texto="Volver"
          style={{ backgroundColor: 'rgba(117, 225, 113, 0.8)' }}
          onClick={() => navigate('/administrar')}
          tooltip="Regresar a la página anterior"
        />
      </div>
      {renderTabla()}
      {isModalOpen && renderModal()}
    </div>
  );
};
