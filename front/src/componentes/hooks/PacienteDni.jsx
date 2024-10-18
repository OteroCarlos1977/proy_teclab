import { useEffect, useState } from 'react'; 

export const usePacienteData = (setValue) => { 
    const [paciente, setPaciente] = useState(null); 
    useEffect(() => { const dniInput = document.getElementById('dni'); 
    const handleBlur = async (e) => { 
        const dni = e.target.value; 
        if (dni) { 
            try { const response = await fetch(`http://localhost:3000/api/pacientes/${dni}`); 
                    const result = await response.json(); console.log('Respuesta de la API:', result); 
                    if (!result.error && result.body.length > 0) { const datosPaciente = result.body[0]; 
                        if (datosPaciente) { setPaciente(datosPaciente); // Rellenar automáticamente los campos del formulario 
                            setValue('nombre', datosPaciente.nombre); 
                            setValue('apellido', datosPaciente.apellido); 
                            setValue('edad', datosPaciente.edad); 
                            setValue('fecha_nacimiento', datosPaciente.fecha_nacimiento.split('T')[0]); // Formato de fecha YYYY-MM-DD 
                            setValue('genero', datosPaciente.genero === 'M' ? 'masculino' : datosPaciente.genero === 'F' ? 'femenino' : 'otro'); 
                            setValue('direccion', datosPaciente.direccion); 
                            setValue('telefono', datosPaciente.telefono); 
                            setValue('email', datosPaciente.email); } } 
                        else { setPaciente(null); // No se encontró el paciente con el DNI
        } 
                } catch (error) { 
                    console.error('Error al buscar el paciente:', error); 
                    setPaciente(null); } 
        }
    }; 
    
        if (dniInput) { dniInput.addEventListener('blur', handleBlur); } 
        
        return () => { 
        
        if (dniInput) { dniInput.removeEventListener('blur', handleBlur);}

        }; 
    }, [setValue]); 
    
        return paciente
};