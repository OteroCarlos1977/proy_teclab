// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../Button/Button';
import {faUser, faUserMd, faStethoscope, faCalendarCheck, faEye, faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

import './Administrador.css';

export function Administrador() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nombre, apellido } = location.state || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [medicos, setMedicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [especialidad, setEspecialidad] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [activeTab, setActiveTab] = useState('medicos'); // Estado para la pestaña activa

  // Efecto para obtener la lista de médicos
  useEffect(() => {
    if (activeTab === 'medicos') {
      const fetchMedicos = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/medicos/conespec/');
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
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'usuarios') {
      const fetchUsuarios = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/usuarios/usuarios/');
          const data = await response.json();
          if (!data.error && data.body) {
            setUsuarios(data.body);
          } else {
            console.error('Error al obtener la lista de usuarios');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }

      
      };

      fetchUsuarios();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'especialidades') {
      const fetchEspecialidades = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/especialidad/');
          const data = await response.json();
          if (!data.error && data.body) {
            setEspecialidad(data.body);
          } else {
            console.error('Error al obtener la lista de especialidades');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }

      
      };

      fetchEspecialidades();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'turnos') {
      const fetchTurnos = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/turnos/');
          const data = await response.json();
          if (!data.error && data.body) {
            const formattedData = data.body.map(turno => {
              // Formatear la fecha
              const fechaTurno = new Date(turno.fecha_turno);
              const formattedFechaTurno = fechaTurno.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
  
              // Formatear la hora
              const horario = turno.horario.slice(0, 5); // Recorta la cadena para dejar solo "HH:MM"
  
              return {
                ...turno,
                fecha_turno: formattedFechaTurno,
                horario: horario
              };
            });
  
            setTurnos(formattedData);
          } else {
            console.error('Error al obtener la lista de turnos');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      };
  
      fetchTurnos();
    }
  }, [activeTab]);

  // Filtrar médicos según el término de búsqueda
  const filteredMedicos = medicos.filter(medico =>
    Object.values(medico).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredUsuarios = usuarios.filter(usuario =>
    Object.values(usuario).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredEspecialidad = especialidad.filter(especialidad =>
    Object.values(especialidad).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredTurnos = turnos.filter(turno =>
    Object.values(turno).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Función para cambiar de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm(''); // Reiniciar el término de búsqueda al cambiar de pestaña
  };

  // Usar navigate para redirigir a Carga con activeTab
  const handleShowCarga = () => {
    navigate('/carga', { state: { activeTab } });
  };

  

const handleDelete = async (id) => {
    try {
        // Mostrar el mensaje de confirmación utilizando SweetAlert2
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: 'No podrá revertir esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            // Si el usuario cancela, no se procede con la eliminación
            return;
        }

        let url = '';
        let updateState;

        // Seleccionamos la URL y la función de actualización según la pestaña activa
        switch (activeTab) {
            case 'medicos':
                url = `http://localhost:3000/api/medicos`;
                updateState = setMedicos;
                break;
            case 'usuarios':
                url = `http://localhost:3000/api/usuarios`;
                updateState = setUsuarios;
                break;
            case 'especialidades':
                url = `http://localhost:3000/api/especialidad`;
                updateState = setEspecialidad;
                break;
            case 'turnos':
                url = `http://localhost:3000/api/turnos`;
                updateState = setTurnos;
                break;
            default:
                console.error('Pestaña activa desconocida');
                return;
        }

        // Realizamos la solicitud PUT para eliminar el registro
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }), // Enviamos el ID en el cuerpo de la solicitud
        });

        if (response.ok) {
            // Filtramos el estado actual para eliminar el elemento borrado
            updateState(prevItems => prevItems.filter(item => item.id !== id));

            // Mostrar mensaje de éxito
            await Swal.fire({
                title: 'Eliminado',
                text: 'El registro se ha eliminado satisfactoriamente.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: `No se pudo eliminar el elemento en la pestaña ${activeTab}.`,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            });
        }
    } catch (err) {
        Swal.fire({
            title: 'Error',
            text: `Error al eliminar el elemento en la pestaña ${activeTab}.`,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
        });
    }
};

const handleView = (id) => {
  navigate('/vista', { state: { activeTab, id } });
};

const handleEdit = (id) => {
  navigate('/editar', { state: { activeTab, id } });
  // Lógica para editar el médico
};


  return (
    <>
    <div className='encabezado'>
      <h4>Se encuentra administrando: <strong>{nombre} {apellido}</strong></h4>
    </div> 

     {/* Barra de navegación de pestañas */}
     <div className="tabs">
      <Button
          tooltip="Medicos" 
          icono={faUserMd}
          style={{ backgroundColor: activeTab === 'medicos' ? '#4CAF50' : 'rgba(18, 235, 159, 0.73)' }}
          onClick={() => handleTabChange('medicos')}
        />
        <Button
          tooltip="Usuarios" 
          icono={faUser}
          style={{ backgroundColor: activeTab === 'usuarios' ? '#4CAF50' : 'rgba(238, 60, 11, 0.68)' }}
          onClick={() => handleTabChange('usuarios')}
        />
        <Button
          tooltip="Especialidad" 
          icono={faStethoscope}
          style={{ backgroundColor: activeTab === 'especialidades' ? '#4CAF50' : 'rgba(245, 40, 145, 0.8)' }}
          onClick={() => handleTabChange('especialidades')}
        />
        <Button
          tooltip="Turnos" 
          icono={faCalendarCheck}
          style={{ backgroundColor: activeTab === 'turnos' ? '#4CAF50' : 'rgba(145, 68, 170, 0.6)' }}
          onClick={() => handleTabChange('turnos')}
        />
      </div>
      {/* Input de búsqueda */}
      <input
        className='busqueda'
        type="text"
        placeholder={`Buscar en ${activeTab}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        <Button
          tooltip="Nuevo" 
          icono={faPlusCircle}
          style={{ color: 'black', backgroundColor: 'rgba(190, 2, 183, 0.61)' }}
          onClick={(handleShowCarga)}
        />
      </div>

      {/* Mostrar contenido según la pestaña activa */}
      {activeTab === 'medicos' && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Fecha de Ingreso</th>
              <th>Matrícula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicos.map((medico) => (
              <tr key={medico.id}>
                <td>{medico.nombre}</td>
                <td>{medico.apellido}</td>
                <td>{medico.especialidad}</td>
                <td>{medico.telefono}</td>
                <td>{new Date(medico.fecha_ingreso).toLocaleDateString()}</td>
                <td>{medico.matricula}</td>
                <td>
                <Button 
                    style={{ backgroundColor: 'rgba(240, 85, 13, 0.8)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                    icono={faEye} 
                    tooltip="Ver"
                    onClick={() => handleView(medico.id)} 
                  />
                  <Button 
                    style={{ backgroundColor: 'rgba(0, 174, 13, 0.8)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                    icono={faEdit} 
                    tooltip="Editar" 
                    onClick={() => handleEdit(medico.id)} 
                  />
                  <Button 
                    style={{ backgroundColor: 'rgba(0, 174, 131, 0.8)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                    icono={faTrash} 
                    tooltip="Eliminar" 
                    onClick={() => handleDelete(medico.id)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      )}
      

      {activeTab === 'usuarios' && (
        <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Legajo</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Usuario</th>
            <th>Contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.legajo}</td>
              <td>{usuario.email}</td>
              <td>{usuario.rol_id}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.password}</td>
              <td>
              <Button 
                  style={{ backgroundColor: 'rgba(32, 30, 31, 0.24)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                  icono={faEye} 
                  tooltip="Ver"
                  onClick={() => handleView(usuario.id)} 
                />
                <Button 
                  style={{ backgroundColor: 'rgba(32, 30, 31, 0.24)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                  icono={faEdit} 
                  tooltip="Editar" 
                  onClick={() => handleEdit(usuario.id)} 
                />
                <Button 
                  style={{ backgroundColor: 'rgba(32, 30, 31, 0.24)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                  icono={faTrash} 
                  tooltip="Eliminar" 
                  onClick={() => handleDelete(usuario.id)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}

      {activeTab === 'especialidades' && (
        
        <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEspecialidad.map((especialidad) => (
            <tr key={especialidad.id}>
              <td>{especialidad.espec}</td>
              <td>
               <Button 
                  style={{ backgroundColor: 'rgba(32, 30, 31, 0.24)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                  icono={faEdit} 
                  tooltip="Editar" 
                  onClick={() => handleEdit(especialidad.id)} 
                />
                <Button 
                  style={{ backgroundColor: 'rgba(32, 30, 31, 0.24)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                  icono={faTrash} 
                  tooltip="Eliminar" 
                  onClick={() => handleDelete(especialidad.id)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
        
      

      {activeTab === 'turnos' && (
        <table>
        <thead>
          <tr>
            <th>Nombre Paciente</th>
            <th>DNI</th>
            <th>Fecha Turno</th>
            <th>Horario</th>
            <th>Especialidad</th>
            <th>Nombre Medico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTurnos.map((turno) => (
            <tr key={turno.id}>
              <td>{`${turno.paciente_nombre} ${turno.paciente_apellido}`}</td>
              <td>{turno.dni}</td>
              <td>{turno.fecha_turno}</td>
              <td>{turno.horario}</td>
              <td>{turno.especialidad}</td>
              <td>{`${turno.medico_nombre} ${turno.medico_apellido}`}</td>
              <td>
                <Button 
                  style={{ backgroundColor: 'rgba(32, 30, 31, 0.24)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                  icono={faEdit} 
                  tooltip="Editar" 
                  onClick={() => handleEdit(turno.id)} 
                />
                <Button 
                  style={{ backgroundColor: 'rgba(32, 30, 31, 0.24)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                  icono={faTrash} 
                  tooltip="Eliminar" 
                  onClick={() => handleDelete(turno.id)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </>
  );
}





