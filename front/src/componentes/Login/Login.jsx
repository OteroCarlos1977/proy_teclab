// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { InputField } from "../InputField/InputField";
import './Login.css'

// eslint-disable-next-line react/prop-types
export function Login({ onLoginSuccess }) {
  const [data, setData] = useState({ usuario: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const { register, formState: { errors }, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      // Solicitud de autenticación
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const loginJson = await loginResponse.json();

      if (!loginJson.error && loginJson.body) {
        const token = loginJson.body;

        // Realizar la segunda solicitud para obtener el nombre y apellido del usuario
        const userResponse = await fetch(`http://localhost:3000/api/usuarios/usuario/${formData.usuario}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            
          },
        });

        const userJson = await userResponse.json();

        if (!userJson.error && userJson.body) {
          const { nombre, apellido } = userJson.body[0];
          console.log(nombre, apellido);
          // Pasar el token y los datos del usuario al componente padre
          onLoginSuccess(token, { nombre, apellido });

          // Navegar al componente Administrar pasando los datos
          navigate("/administrar", { state: { nombre, apellido } });
        } else {
          setLoginError('No se pudieron obtener los datos del usuario');
        }
      } else {
        setLoginError('Nombre de usuario o clave incorrectos');
      }

    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      setLoginError("Hubo un error al realizar la solicitud");
    }
  };

  return (
    <>
      <h4 className="titulo_form">Ingreso Administrar</h4>
      <div className="container_form">
        <form onSubmit={handleSubmit(onSubmit)} className="form_login">
          <InputField
            label="Usuario"
            id="usuario"
            name="usuario"
            type="text"
            value={data.usuario}
            onChange={(e) => setData({ ...data, usuario: e.target.value })}
            register={register}
            required
            errors={errors}
          />
          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            register={register}
            required
            errors={errors}
          />

          {loginError && <p className="error_message">{loginError}</p>}

          <div className="submit-button-container">
            <input type="submit" value="Ingresar" />
          </div>
        </form>
      </div>

      <button
        className="volver-button"
        style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }}
        onClick={() => navigate('/')}  
      >
        Volver
      </button>
    </>
  );
}
