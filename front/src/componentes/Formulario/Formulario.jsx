// eslint-disable-next-line no-unused-vars
import React from "react";
import { Button } from "../Button/Button";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { usePacienteData } from "../hooks/PacienteDni";
import { InputField } from "../InputField/InputField";

import "./Formulario.css";

export function Formulario() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extrae los datos del estado de la ubicación
  const {
    id_especialidad,
    nombre_especialidad,
    id_medico,
    nombre_medico,
    dia,
    horario
  } = location.state || {};

  console.log(nombre_especialidad);

  // Formatear la fecha
  const nuevoDia = dia.match(/(\d{1,2})\/(\d{1,2})/);
  const day = nuevoDia ? nuevoDia[1].padStart(2, "0") : "01"; // Asegura que el día tenga 2 dígitos
  const month = nuevoDia ? nuevoDia[2].padStart(2, "0") : "01"; // Asegura que el mes tenga 2 dígitos

  // Defino el año 
  const year = new Date().getFullYear(); // Año actual

  // Crear la fecha en formato YYYY-MM-DD
  const fecha = `${year}-${month}-${day}`;

  // Configuración del formulario con react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const paciente = usePacienteData(setValue);

  const onSubmit = async (data) => {
    const pacienteId = paciente?.id || 0;
    const hoy = new Date().toISOString().split("T")[0]; // Fecha actual

    // Preparar los datos del paciente
    const pacienteData = {
      id: pacienteId,
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      edad: data.edad,
      fecha_nacimiento: data.fecha_nacimiento,
      genero: data.genero,
      direccion: data.direccion,
      telefono: data.telefono,
      email: data.email,
      fecha_registro: hoy,
    };

    // Preparar los datos del turno
    const turnoData = {
      id: 0,
      especialidad_id: id_especialidad,
      paciente_dni: data.dni,
      medico_id: id_medico,
      fecha_turno: fecha,
      horario: horario,
    };

    try {
      // Enviar datos del paciente
      const responsePaciente = await fetch(
        "http://localhost:3000/api/pacientes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pacienteData),
        }
      );

      if (!responsePaciente.ok) {
        throw new Error("Error al registrar el paciente");
      }

      // Enviar datos del turno
      const responseTurno = await fetch("http://localhost:3000/api/turnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(turnoData),
      });

      if (!responseTurno.ok) {
        throw new Error("Error al registrar el turno");
      }

      navigate("/confirmacion", {
        state: {
          pacienteData,
          turnoData,
          nombre_especialidad,
          nombre_medico,
          dia,
          horario,
        },
      }); // Redirige a una página de confirmación
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Hubo un error al registrar el paciente o el turno");
    }
  };

  return (
    <>
      <div className="container_turno">
        <h3>Datos del turno</h3>
        <span><strong>Especialidad:</strong> {nombre_especialidad}</span>
        <span><strong>Médico:</strong> Dr. {nombre_medico}</span>
        <span><strong>Día:</strong> {dia}</span>
        <span><strong>Hora:</strong> {horario}</span>
      </div>

      <h4 className="titulo_form">Carga Datos Paciente</h4>
      <div className="container_form">
        <form className= "formulario" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group-dni">
            <InputField
              label="DNI"
              id="dni"
              register={register}
              required
              errors={errors}
            />
          </div>
          <div className="form-grid">
            <InputField
              label="Nombre"
              id="nombre"
              register={register}
              required
              errors={errors}
            />
            <InputField
              label="Apellido"
              id="apellido"
              register={register}
              required
              errors={errors}
            />
            <InputField
              label="Edad"
              id="edad"
              register={register}
              required
              errors={errors}
            />
            <InputField
              label="Fecha de Nacimiento"
              id="fecha_nacimiento"
              register={register}
              required
              errors={errors}
              type="date"
            />
            <InputField
              label="Género"
              id="genero"
              register={register}
              options={[
                { value: "M", label: "Masculino" },
                { value: "F", label: "Femenino" },
                { value: "Otro", label: "Otro" },
              ]}
              type="select"
            />
            <InputField
              label="Dirección"
              id="direccion"
              register={register}
              required
              errors={errors}
            />
            <InputField
              label="Teléfono"
              id="telefono"
              register={register}
              required
              errors={errors}
              type="tel"
            />
            <InputField
              label="Email"
              id="email"
              register={register}
              required
              errors={errors}
              pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/i}
              type="email"
            />
          </div>

          <div className="submit-button-container">
            <input type="submit" value="Confirmar Turno" />
          </div>
        </form>
      </div>

      <Button
        texto="Volver"
        style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }}
        onClick={() => navigate("/selector")}
      />
    </>
  );
}
