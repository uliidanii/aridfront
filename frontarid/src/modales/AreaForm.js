import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AreaService from '../services/AreaService';
import '../assets/css/select.css'


const AreaForm = ({ handleClose }) => {
  const [nombre, setNombre] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const area = { nombre };
    if (!nombre) {
      toast.error('Por favor, ingresa un nombre para el área');
      return;
    } else if (/^[^a-zA-Z]+|[^\w\s]+/gi.test(nombre)) {
      toast.error('El nombre no puede comenzar con números o caracteres especiales');
      return;
    }
    
    try {
      await AreaService.registrarArea(area);
      toast.success('Área registrada con éxito');
      setNombre('');
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar el área');
    }
  };
  

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <button style={{backgroundColor:'#0B0B61'}} type="submit">Registrar</button>
    </form>
  );
};

export default AreaForm;
