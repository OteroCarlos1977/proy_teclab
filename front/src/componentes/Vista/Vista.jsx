// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
//import Swal from "sweetalert2";

export function Vista() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTab, id } = location.state || {};
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === "medicos" && id) {
      // Fetch para obtener los datos del médico
      fetch(`http://localhost:3000/api/disponibilidad/medico/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            setDatos(data.body);
          } else {
            setError("No se pudieron cargar los datos.");
          }
        })
        .catch(() => {
          setError("Error al conectarse con el servidor.");
        });
    }
  }, [activeTab, id]);

    const handleAgregar = () => {
    const nuevoDia = prompt("Ingrese el día:");
    const nuevaHoraInicio = prompt("Ingrese la hora de inicio (HH:mm:ss):");
    const nuevaHoraFin = prompt("Ingrese la hora de fin (HH:mm:ss):");

    if (nuevoDia && nuevaHoraInicio && nuevaHoraFin) {
      setDatos([
        ...datos,
        {
          apellido: datos[0]?.apellido || "",
          nombre: datos[0]?.nombre || "",
          dia: nuevoDia,
          hora_inicio: nuevaHoraInicio,
          hora_fin: nuevaHoraFin,
        },
      ]);
    }
  };

  if (activeTab !== "medicos") {
    return (
      <div>
        <h2>Detalles no disponibles para esta pestaña</h2>
      </div>
    );
  }


  const handleEdit = (id) => {
    console.log("Esta es un Editar", id)
  };

  const handleDelete = (id) => {
    console.log("Esta es un Eliminar", id)
  }

  return (
    <div>
      <h2>Días Disponibles del Dr. </h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {datos.length > 0 && (
        <div>
          <h3>{`${datos[0].nombre} ${datos[0].apellido}`}</h3>
          <Button
          tooltip="Nuevo" 
          icono={faPlusCircle}
          style={{ color: 'black' }}
          onClick={(handleAgregar)}
        />
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((item, index) => (
                <tr key={index}>
                  <td>{item.dia}</td>
                  <td>{item.hora_inicio}</td>
                  <td>{item.hora_fin}</td>
                  <td>
                  <Button 
                    style={{ backgroundColor: 'rgba(32, 30, 31, 0.24)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                    icono={faEdit} 
                    tooltip="Editar" 
                    onClick={() => handleEdit(item.id)} 
                  />
                  <Button 
                    style={{ backgroundColor: 'rgba(32, 30, 31, 0.24)', borderRadius: '50%', color: 'black', border: 'none', padding: '10px 15px' }} 
                    icono={faTrash} 
                    tooltip="Eliminar" 
                    onClick={() => handleDelete(item.id)} 
                  />
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Button
              texto="Volver"
              style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }}
              onClick={() => navigate("/administrar")}
              tooltip="Regresar a la página anterior"
            />
    </div>
  );
}
