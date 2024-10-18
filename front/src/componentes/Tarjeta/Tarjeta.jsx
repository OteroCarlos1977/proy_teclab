// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../Button/Button";
import { Aviso } from "../Aviso/Aviso";
import TurnosOtorgados from "../hooks/TurnosOtorgados"; // Importa el hook personalizado
import "./Tarjeta.css";

export function Tarjeta() {
  const [disponibilidadProcesada, setDisponibilidadProcesada] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [medicoIdSeleccionado, setMedicoIdSeleccionado] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const especialidadId = location.state?.especialidadId || "";
  const especialidadNombre = location.state?.especialidadNombre || "";

  const turnosReservados = TurnosOtorgados(especialidadId);

  // Mapeo de días a índices numéricos
  const diasSemana = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
  };

  // Función para obtener la próxima fecha para un día de la semana dado
  const getNextDate = (diaTexto) => {
    const diaIndice = diasSemana[diaTexto];
    if (diaIndice === undefined) return null;

    const hoy = new Date();
    const hoyIndice = hoy.getDay();
    let diferencia = (diaIndice - hoyIndice + 7) % 7;
    if (diferencia === 0) diferencia = 7; // Obtener la próxima semana si es el mismo día

    const proximaFecha = new Date(hoy);
    proximaFecha.setDate(hoy.getDate() + diferencia);

    // Formatear la fecha como 'lunes, 26/08'
    const opcionesFecha = { weekday: 'long', day: '2-digit', month: '2-digit' };
    const fechaFormateada = proximaFecha.toLocaleDateString("es-ES", opcionesFecha);
    
    // Convertir el nombre del día a minúsculas
    const diaFormateado = fechaFormateada.charAt(0).toLowerCase() + fechaFormateada.slice(1);
    
    return diaFormateado;
  };

  // Función para procesar la disponibilidad y generar intervalos de 30 minutos
  const procesarDisponibilidad = (disponibilidad) => {
    const disponibilidadGenerada = [];

    disponibilidad.forEach((item) => {
      const diaFormateado = getNextDate(item.dia);
      if (!diaFormateado) return;

      const horaInicio = new Date(`1970-01-01T${item.hora_inicio}`);
      const horaFin = new Date(`1970-01-01T${item.hora_fin}`);
      let horaActual = new Date(horaInicio);

      while (horaActual < horaFin) {
        const horario = horaActual.toTimeString().slice(0, 5); // 'HH:MM'
        disponibilidadGenerada.push({
          medicoId: item.id,
          medicoNombre: `${item.nombre} ${item.apellido}`,
          dia: diaFormateado,
          horario: horario,
        });
        horaActual.setMinutes(horaActual.getMinutes() + 30);
      }
    });

    // Filtrar los horarios que ya están reservados
    const disponibilidadFiltrada = disponibilidadGenerada.filter(
      (slot) =>
        !turnosReservados.some(
          (turno) =>
            turno.medico_id === slot.medicoId &&
            turno.fecha_turno.toLowerCase() === slot.dia.toLowerCase() &&
            turno.horario_turno === slot.horario
        )
    );

    setDisponibilidadProcesada(disponibilidadFiltrada);
  };

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/medicos/disponible/${especialidadId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener la disponibilidad");
        }
        const data = await response.json();

        if (data.body && Array.isArray(data.body)) {
          procesarDisponibilidad(data.body);
        } else {
          console.error("El formato de la respuesta no es el esperado:", data);
        }
      } catch (error) {
        console.error("Error al obtener la disponibilidad:", error);
      }
    };

    if (especialidadId) {
      fetchDisponibilidad();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [especialidadId, turnosReservados]);

  // Agrupar la disponibilidad filtrada por médico y luego por día
  const disponibilidadAgrupada = disponibilidadProcesada.reduce((acc, slot) => {
    if (!acc[slot.medicoId]) {
      acc[slot.medicoId] = {
        medicoNombre: slot.medicoNombre,
        dias: {},
      };
    }
    if (!acc[slot.medicoId].dias[slot.dia]) {
      acc[slot.medicoId].dias[slot.dia] = [];
    }
    acc[slot.medicoId].dias[slot.dia].push(slot.horario);
    return acc;
  }, {});

  return (
    <>
      <div style={{ display: showMessage ? "none" : "block" }}>
        <h3 className="titulo-card">Especialidad: {especialidadNombre}</h3>

        {/* Mostrar los médicos y sus horarios disponibles agrupados por día */}
        {Object.entries(disponibilidadAgrupada).map(([medicoId, medicoData]) => (
          <div key={medicoId} style={{ marginBottom: "20px" }}>
            <h3 className="nombre-medico">Dr: {medicoData.medicoNombre}</h3>
            <div className="container-card">
              {Object.entries(medicoData.dias).map(([dia, horarios]) => (
                <div
                  className="card"
                  key={dia}
                  style={{ marginBottom: "10px" }}
                >
                  <h3 className="dia-card">
                    <strong>{dia.charAt(0).toUpperCase() + dia.slice(1)}</strong>
                  </h3>
                  <div>
                    {horarios.map((horario, index) => (
                      <div key={index}>
                        {/* Mostrar un radio button para cada horario disponible */}
                        <label>
                          <input
                            type="radio"
                            name={`turno-${medicoId}-${dia}`}
                            value={horario}
                            checked={
                              turnoSeleccionado &&
                              turnoSeleccionado.medicoId === medicoId &&
                              turnoSeleccionado.dia === dia &&
                              turnoSeleccionado.horario === horario
                            }
                            onChange={() => {
                              setTurnoSeleccionado({
                                especialidadId,
                                especialidadNombre,
                                medicoId,
                                medicoNombre: medicoData.medicoNombre,
                                dia,
                                horario
                              });
                              setMedicoIdSeleccionado(medicoId);
                            }}
                          />
                          {horario}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Botón para continuar, que navega a un formulario si se ha seleccionado un turno */}
        <Button
          texto="Continuar"
          style={{ backgroundColor: "rgba(86, 124, 219, 0.8)" }}
          onClick={() => {
            if (turnoSeleccionado && medicoIdSeleccionado) {
              navigate("/formulario", {
                state: {
                  id_especialidad: turnoSeleccionado.especialidadId,
                  nombre_especialidad: turnoSeleccionado.especialidadNombre,
                  id_medico: turnoSeleccionado.medicoId,
                  nombre_medico: turnoSeleccionado.medicoNombre,
                  dia: turnoSeleccionado.dia,
                  horario: turnoSeleccionado.horario,
                },
              });
            } else {
              setShowMessage(true); // Mostrar aviso si no se ha seleccionado un turno
            }
          }}
        />

        {/* Botón para volver a la página de selección */}
        <Button
          texto="Volver"
          style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }}
          onClick={() => navigate("/selector")}
        />
      </div>

      {/* Componente de aviso */}
      {showMessage && (
        <div style={{ position: "fixed", top: "10%", left: "50%", transform: "translate(-50%, 0)", zIndex: 1000 }}>
          <Aviso
            mensaje="Debe seleccionar un turno antes de continuar."
            onClose={() => setShowMessage(false)}
          />
        </div>
      )}
    </>
  );
}
