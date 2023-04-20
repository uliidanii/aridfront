import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AreaService from '../services/AreaService';
import '../assets/css/select.css'


const AreaForm = ({ handleClose }) => {
  const [nombre, setNombre] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const area = { nombre };
  
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
      <button type="submit">Registrar</button>
    </form>
  );
};

export default AreaForm;
