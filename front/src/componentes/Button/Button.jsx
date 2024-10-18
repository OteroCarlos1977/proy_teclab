// eslint-disable-next-line react/prop-types
export function Button ({ texto, style, onClick }) {
  return ( 
    <>
    <button style={style} onClick={onClick}>
    {texto}
  </button>
  </>
  ) 
}


