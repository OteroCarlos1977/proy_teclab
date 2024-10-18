// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button} from '../Button/Button';
import {useNavigate} from 'react-router-dom';

import '../../App.css'
// eslint-disable-next-line react/prop-types
export function Principal() {
    const navigate = useNavigate();


    return ( 
    <>
        <Button 
        texto="Nuevo Turno" 
        style ={{backgroundColor: 'rgba(86, 124, 219, 0.8)'  }} 
        onClick={() => navigate ('/selector')}/> 
        <Button 
        texto="Ver Turno" 
        style ={{backgroundColor: 'rgba(117, 225, 113, 0.8)' }}
        onClick={() => navigate ('/turno')}/> 
        
    </>
        
    ) 
    
}


