// eslint-disable-next-line no-unused-vars
import React from "react";
// eslint-disable-next-line react/prop-types
export const InputField = ({ label, id, register, required, pattern, errors, type = "text", options,}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}:</label>{" "}
      {type === "select" ? (
        <select id={id} {...register(id, { required, pattern })}>
          <option value="vacio"></option>{" "}
         
          { /*eslint-disable-next-line react/prop-types*/}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {" "}
              {option.label}{" "}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} id={id} {...register(id, { required, pattern })} />
      )}
      { /*eslint-disable-next-line react/prop-types*/}
      {required && errors[id]?.type === "required" && (
        <p className="errorImput">El campo {label} es requerido</p>
      )}
      { /*eslint-disable-next-line react/prop-types*/}
      {pattern && errors[id]?.type === "pattern" && (
        <p className="errorImput">El formato de {label} es incorrecto</p>
      )}
    </div>
  );
};
