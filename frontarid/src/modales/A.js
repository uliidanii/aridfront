import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import '../assets/css/style.css'
import '../assets/css/select.css'


const AulaLaboratorioForm = ({ handleClose }) => {
  const [nombre, setNombre] = useState('');

  const [areaId, setAreaId] = useState('');
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [tipo, setTipo] = useState('aula');

  // Carga las áreas desde el servidor
  useEffect(() => {
    api.get('/areas')
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar las áreas:', error);
      });
  }, []);

  const validateForm = () => {
    const nombrePattern = /^[a-zA-Z]+(\s+[a-zA-Z]+)*$/;
    
    if (!nombre || !areaId) {
      toast.error("Debe seleccionar un área y proporcionar un nombre");
      return false;
    } else if (/^[^a-zA-Z]+|[^\w\s]+/gi.test(nombre)) {
      console.log(nombrePattern.test(nombre)); // Agrega un console.log para verificar el valor de la expresión regular
      toast.error("El nombre no puede comenzar con números o caracteres especiales y solo debe contener letras y espacios");
      return false;
    }
    
    return true;
  };
  
  const validateNombre = () => {
    const nombrePattern = /^[a-zA-Z]+(\s+[a-zA-Z]+)*$/;
  
    if (!nombre) {
      toast.error("Debe proporcionar un nombre");
    } else if (!nombrePattern.test(nombre)) {
      toast.error("El nombre no puede comenzar con números o caracteres especiales y solo debe contener letras y espacios");
    }
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const endPoint = tipo === 'aula' ? 'aulas' : 'laboratorios';
  
    try {
      const response = await api.post(`/areas/${areaId}/${endPoint}`, {
        nombre,
        tipo,
      });
  
      if (response.status === 200 || response.status === 201) {
        toast.success("Area Registrada");
        handleClose(); // Cierra el modal si la operación fue exitosa
      } else {
        setError('Error al registrar el aula o laboratorio');
      }
    } catch (error) {
      toast.error("Error " + error);
      setError('Error al registrar el aula o laboratorio');
    }
  };
  
  
  
  return (
    <form className='form' onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <label className='form' onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} >Tipo:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="aula">Aula</option>
          <option value="laboratorio">Laboratorio</option>
        </select>
      </div>
      <div>
        <label className='form' onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} >Área:</label>
        <select value={areaId} onChange={(e) => setAreaId(e.target.value)}>
          <option value="">Seleccione una área</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
  <label className='form' style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} >Nombre:</label>
  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} onBlur={validateNombre} />
</div>

      <br/>
      <button type="submit" style={{ width: '100px', alignSelf: 'center',backgroundColor:'#0B0B61' }}>Registrar</button>
    </form>
  );
};


export default AulaLaboratorioForm ;