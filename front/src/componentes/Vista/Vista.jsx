// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import Swal from "sweetalert2";
import { faEdit, faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export function Vista() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTab, id } = location.state || {};
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    id: 0,
    id_medico: id || "",
    dia: "",
    hora_inicio: "",
    hora_fin: "",
  });

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
    setIsModalOpen(true);
  };

  const handleGuardar = () => {
    setDatos([...datos, nuevoRegistro]);
    setIsModalOpen(false);
    alert("Registro guardado exitosamente");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro({ ...nuevoRegistro, [name]: value });
  };

  const handleEdit = (id) => {
    console.log("Esta es un Editar", id);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Está seguro?",
        text: "No podrá revertir esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      }

      const url = `http://localhost:3000/api/disponibilidad/`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setDatos((prevDatos) => prevDatos.filter((item) => item.id !== id));
        await Swal.fire({
          title: "Eliminado",
          text: "El registro se ha eliminado satisfactoriamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el elemento.",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el elemento.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    }
  };

  if (activeTab !== "medicos") {
    return (
      <div>
        <h2>Detalles no disponibles para esta pestaña</h2>
      </div>
    );
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
            style={{ color: "black", backgroundColor: "rgba(7, 2, 224, 0.7)" }}
            onClick={handleAgregar}
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
                      style={{
                        backgroundColor: "rgba(0, 174, 13, 0.8)",
                        borderRadius: "50%",
                        color: "black",
                        border: "none",
                        padding: "10px 15px",
                      }}
                      icono={faEdit}
                      tooltip="Editar"
                      onClick={() => handleEdit(item.id)}
                    />
                    <Button
                      style={{
                        backgroundColor: "rgba(0, 174, 131, 0.8)",
                        borderRadius: "50%",
                        color: "black",
                        border: "none",
                        padding: "10px 15px",
                      }}
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

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <h3>Agregar Nuevo Registro</h3>
          <form>
            <label>
              Día de la Semana:
              <input
                type="text"
                name="dia"
                value={nuevoRegistro.dia}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Hora de Inicio:
              <input
                type="time"
                name="hora_inicio"
                value={nuevoRegistro.hora_inicio}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Hora de Fin:
              <input
                type="time"
                name="hora_fin"
                value={nuevoRegistro.hora_fin}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button type="button" onClick={handleGuardar}>
              Guardar
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
