// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputField } from "../InputField/InputField";
import Swal from "sweetalert2";

export function Editar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTab, id } = location.state || {};
  const [especialidades, setEspecialidades] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const showAlert = () => {
    Swal.fire({
      title: "Cambios Guardados",
      text: "Los cambios han sido guardados con éxito.",
      icon: "success",
      confirmButtonText: "Continuar",
    });
  };

  // Fetch detalles del registro a editar
  useEffect(() => {
    if (id && activeTab) {
      const fetchDetails = async () => {
        try {
          let url = "";
          switch (activeTab) {
            case "medicos":
              url = `http://localhost:3000/api/medicos/${id}`;
              break;
            case "usuarios":
              url = `http://localhost:3000/api/usuarios/${id}`;
              break;
            case "especialidades":
              url = `http://localhost:3000/api/especialidad/${id}`;
              break;
            case "turnos":
              url = `http://localhost:3000/api/turnos/${id}`;
              break;
            default:
              console.error("Pestaña activa desconocida");
              return;
          }

          const response = await fetch(url);
          const data = await response.json();
          console.log("Datos recibidos:", data);

          if (!data.error && data.body.length > 0) {
            const registro = data.body[0]; // Accede al primer elemento del array

            // Convertir la fecha de ingreso al formato "YYYY-MM-DD" (si es necesario)
            if (registro.fecha_ingreso) {
              const fechaISO = registro.fecha_ingreso;
              registro.fecha_ingreso = fechaISO.split("T")[0]; // Convierte a "YYYY-MM-DD"
            }

            Object.keys(registro).forEach((key) => {
              setValue(key, registro[key]); // Inicializa el formulario con los datos
            });
          } else {
            console.error(
              "No se encontraron datos o hubo un error en la respuesta"
            );
          }
        } catch (error) {
          console.error("Error al recuperar los detalles:", error);
        }
      };

      fetchDetails();
    }
  }, [id, activeTab, setValue]);

  // Fetch especialidades (solo si es necesario)
  useEffect(() => {
    if (activeTab === "medicos") {
      const fetchEspecialidades = async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/api/especialidad"
          );
          const data = await response.json();
          setEspecialidades(data.body || []);
        } catch (error) {
          console.error("Error al obtener especialidades:", error);
        }
      };

      fetchEspecialidades();
    }
  }, [activeTab]);

  const onSubmit = async (data) => {
    try {
      let url = "";
      switch (activeTab) {
        case "medicos":
          url = `http://localhost:3000/api/medicos/`;
          break;
        case "usuarios":
          url = `http://localhost:3000/api/usuarios/`;
          break;
        case "especialidades":
          url = `http://localhost:3000/api/especialidad/`;
          break;
        case "turnos":
          url = `http://localhost:3000/api/turnos/`;
          break;
        default:
          console.error("Pestaña activa desconocida");
          return;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los cambios");
      }

      showAlert();
      navigate(-1); // Vuelve a la página anterior
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar los cambios.",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  };

  return (
    <div className="container_form">
      <h4 className="titulo_form">{`Editar: ${activeTab}`}</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        {activeTab === "medicos" && (
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
              id="especialidad_id"
              register={register}
              required
              errors={errors}
              type="select"
              options={especialidades.map((especialidad) => ({
                value: especialidad.id,
                label: especialidad.espec,
              }))}
            />
            <InputField
              label="Teléfono"
              id="telefono"
              register={register}
              required
              errors={errors}
            />
            <InputField
              label="Fecha Ingreso"
              id="fecha_ingreso"
              register={register}
              required
              errors={errors}
              type="date"
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

        {activeTab === "usuarios" && (
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

        {activeTab === "especialidades" && (
          <InputField
            label="Especialidad"
            id="espec"
            register={register}
            required
            errors={errors}
          />
        )}

        {activeTab === "turnos" && (
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
              label="Fecha Turno"
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
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
