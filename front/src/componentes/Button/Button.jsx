import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



// eslint-disable-next-line react/prop-types
export function Button ({ texto, style, onClick, icono, tooltip }) {
  return ( 
    <>
      <button style={style} onClick={onClick} data-tooltip={tooltip}>
      <FontAwesomeIcon icon={icono} /> 
      {texto}
      </button>
    </>
  ) 
}



