import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import { Aviso } from "../Aviso/Aviso";



// El componente 'Selector' permite a los usuarios seleccionar una especialidad médica de una lista y navegar a la siguiente pantalla.
export function Selector() {
  // Se declara un estado 'especialidades' que almacenará la lista de especialidades obtenidas desde el backend.
  const [especialidades, setEspecialidades] = useState([]);

  // Se declara un estado 'especialidad' que almacenará la especialidad seleccionada por el usuario.
  // Este estado es un objeto con dos propiedades: 'id' (el identificador de la especialidad) y 'nombre' (el nombre de la especialidad).
  const [especialidad, setEspecialidad] = useState({ id: "", nombre: "" });

  //Se declara un estado 'showMessage' que manejara los mensajes al usuario desde el componente Aviso
  const [showMessage, setShowMessage] = useState(false);

  // 'useNavigate' es un hook de React Router que permite la navegación programática.
  // Se utiliza para redirigir a los usuarios a diferentes rutas/páginas dentro de la aplicación.
  const navigate = useNavigate();

  // 'useEffect' es un hook que se ejecuta después de que el componente se monta.
  // En este caso, se usa para obtener la lista de especialidades médicas desde el backend al cargar el componente.
  useEffect(() => {
    // Función asíncrona que realiza una solicitud a la API para obtener las especialidades.
    const fetchEspecialidades = async () => {
      try {
        // Se realiza una solicitud GET al endpoint '/api/especialidad' del backend.
        const response = await fetch("http://localhost:3000/api/especialidad");

        // Si la respuesta no es exitosa (status distinto de 200), se lanza un error.
        if (!response.ok) {
          throw new Error("Error al obtener las especialidades");
        }

        // Se convierte la respuesta a formato JSON para procesarla.
        const data = await response.json();

        // Se verifica que la respuesta contiene un cuerpo y que es un array.
        if (data.body && Array.isArray(data.body)) {
          // Se actualiza el estado 'especialidades' con los datos recibidos.
          setEspecialidades(data.body);
        } else {
          // Si el formato de la respuesta no es el esperado, se muestra un error en la consola.
          console.error("El formato de la respuesta no es el esperado:", data);
        }
      } catch (error) {
        // En caso de error (por ejemplo, problemas de red), se muestra un mensaje de error en la consola.
        console.error("Error al obtener las especialidades:", error);
      }
    };

    // Se llama a la función para obtener las especialidades.
    fetchEspecialidades();
  }, []); // El array vacío [] asegura que este efecto solo se ejecute una vez al montar el componente.

  // Función que se ejecuta al hacer clic en "Continuar"
  // Se redirige a la siguiente pantalla si se seleccionó una especialidad y muestra un mensaje de aviso si no se ha seleccionado ninguna especialidad.  // eslint-disable-next-line no-unused-vars
  const handleContinue = () => {
    if (especialidad.id) {
      navigate("/tarjeta", {
        state: {
          especialidadId: especialidad.id,
          especialidadNombre: especialidad.nombre,
        },
      });
    } else {
      setShowMessage(true);
      
    }
  };

  return (
    <>
      <div style={{ display: showMessage ? "none" : "block" }}>
        {/* Título del formulario */}
        <h3>Seleccione Especialidad Médica</h3>

        {/* Dropdown/select que permite al usuario seleccionar una especialidad de la lista obtenida */}
        <select
          value={especialidad.id} // El valor seleccionado corresponde al id de la especialidad seleccionada.
          onChange={(e) => {
            // Evento que se activa al cambiar la selección en el dropdown.
            // Se busca la especialidad seleccionada en el array 'especialidades' usando el id.
            const selectedEspecialidad = especialidades.find(
              (esp) => esp.id === parseInt(e.target.value)
            );

            // Se actualiza el estado 'especialidad' con el id y nombre de la especialidad seleccionada.
            setEspecialidad({
              id: selectedEspecialidad?.id || "", // Si no se encuentra, se asigna un valor vacío.
              nombre: selectedEspecialidad?.espec || "", // Si no se encuentra, se asigna un valor vacío.
            });
          }}
        >
          {/* Opción por defecto cuando no se ha seleccionado ninguna especialidad */}
          <option value="">Seleccione una especialidad</option>

          {/* Mapeo de las especialidades obtenidas para mostrarlas como opciones en el dropdown */}
          {especialidades.map((esp, index) => (
            <option key={index} value={esp.id}>
              {esp.espec}
            </option>
          ))}
        </select>

        {/* Botón para continuar a la siguiente pantalla una vez seleccionada una especialidad */}
        <Button
          texto="Continuar"
          style={{ backgroundColor: "rgba(86, 124, 219, 0.8)" }} // Estilo del botón
          onClick={handleContinue} // Llama a la función handleContinue en lugar de directamente navegar
        />

        {/* Botón para volver a la pantalla anterior */}
        <Button
          texto="Volver"
          style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }} // Estilo del botón
          onClick={() => navigate("/")}
        />
      </div>
      <div className="mensaje">
        {showMessage && (
          <Aviso
            message="Por favor, seleccione una especialidad antes de continuar."
            buttonText="Entendido"
            onButtonClick={() => setShowMessage(false)}
          />
        )}
      </div>
    </>
  );
}
