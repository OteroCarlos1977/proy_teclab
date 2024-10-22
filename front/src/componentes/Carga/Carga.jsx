// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Button } from '../Button/Button.jsx';
import { InputField } from "../InputField/InputField";
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-unused-vars
import { useNavigate, useLocation } from "react-router-dom";

import './Carga.css';

export function Carga() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab } = location.state || {};

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  // Renderizado condicional del formulario según la pestaña activa
  return (
    <>
      <h4 className="titulo_form">{`Cargar nuevo ${activeTab}`}</h4>
      <div className="container_form">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Formulario para Médicos */}
          {activeTab === 'medicos' && (
            <>
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
                label="Especialidad"
                id="especialidad"
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
              />
              <InputField
                label="Matrícula"
                id="matricula"
                register={register}
                required
                errors={errors}
              />
            </>
          )}

          {/* Formulario para Usuarios */}
          {activeTab === 'usuarios' && (
            <>
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
                label="Legajo"
                id="legajo"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Email"
                id="email"
                type="email"
                register={register}
                required
                errors={errors}
              />
            </>
          )}

          {/* Formulario para Especialidades */}
          {activeTab === 'especialidades' && (
            <>
              <InputField
                label="Especialidad"
                id="especialidad"
                register={register}
                required
                errors={errors}
              />
            </>
          )}

          {/* Formulario para Turnos */}
          {activeTab === 'turnos' && (
            <>
              <InputField
                label="Nombre Paciente"
                id="nombre_paciente"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Apellido Paciente"
                id="apellido_paciente"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="DNI"
                id="dni"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Fecha del Turno"
                id="fecha_turno"
                type="date"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Horario"
                id="horario_turno"
                type="time"
                register={register}
                required
                errors={errors}
              />
            </>
          )}

          <div className="submit-button-container">
            <input
              type="submit"
              value={`Guardar ${activeTab === 'medicos' ? 'Médico' : activeTab === 'usuarios' ? 'Usuario' : activeTab === 'especialidades' ? 'Especialidad' : 'Turno'}`}
            />
          </div>
        </form>
      </div>

      <Button
        texto="Volver"
        style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }}
        onClick={() => navigate("/administrar")}
      />
    </>
  );
}
