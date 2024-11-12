// eslint-disable-next-line no-unused-vars
import React from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import './Confirmacion.css'; 

export function Confirmacion() {
  const location = useLocation();
  const navigate = useNavigate();

  const showAlert = () => {
    Swal.fire({
      title: 'Turno Confirmado',
      text: 'El turno ha sido confirmado y se ha enviado un correo con los detalles.',
      icon: 'success',
      confirmButtonText: 'Continuar',
    });
  }

  // Obteniendo los datos pasados a través de la navegación
  // eslint-disable-next-line no-unused-vars
  const { pacienteData,
    
    nombre_especialidad,
    nombre_medico,
    dia,
    horario, } = location.state || {};

  // Función que se ejecuta al hacer clic en "Aceptar Turno"
  const handleAceptar = async () => {
    try {
      // Envía un correo electrónico con los detalles del turno
      const response = await fetch("http://localhost:3000/api/enviarEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: pacienteData.email,
          subject: "Confirmación de Turno",
          text: `Estimado/a ${pacienteData.nombre} ${pacienteData.apellido},
          
          Su turno ha sido confirmado con los siguientes detalles:
          - Especialidad: ${nombre_especialidad}
          - Médico: Dr. ${nombre_medico}
          - Día: ${dia}
          - Hora: ${horario}

          Por favor, preséntese con unos minutos de antelación.`
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el correo de confirmación");
      }

      showAlert();
      
      // Redirige a la página principal o a otra página
      navigate("/");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      
    }
  };

  return (
    <div className="container-confirmacion">
      <h3>TURNO SOLICITADO</h3>
      <div className="datos-turno">
        <p><strong>Especialidad:</strong> {nombre_especialidad}</p>
        <p><strong>Médico:</strong> Dr. {nombre_medico}</p>
        <p><strong>Día:</strong> {dia}</p>
        <p><strong>Hora:</strong> {horario}</p>
        <p><strong>Nombre del Paciente:</strong> {pacienteData.nombre} {pacienteData.apellido}</p>
        <p><strong>Email del Paciente:</strong> {pacienteData.email}</p>
      </div>
      <button onClick={handleAceptar} className="btnConfirmacion">
        Aceptar Turno
      </button>
    </div>
  );
}
