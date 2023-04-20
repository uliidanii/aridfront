import React, { useState } from 'react';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import '../assets/css/style.css'
import '../assets/css/select.css'

const Usuario = ({ handleClose, handleSubmit }) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [division, setDivision] = useState('');
  const [rol, setRol] = useState('');

  const validateForm = () => {
    const emailPattern = /^[\w-]+(\.[\w-]+)*@utez\.edu\.mx$/;
    const phonePattern = /^\d+$/;
  
    if (!nombres || !apellidos || !email  || !telefono || !division || !rol) {
      toast.error("Todos los campos son obligatorios");
      return false;
    }
  
    if (!emailPattern.test(email)) {
      toast.error("El correo electrónico debe terminar con @utez.edu.mx");
      return false;
    }
  
    if (!phonePattern.test(telefono)) {
      toast.error("El teléfono solo debe contener números");
      return false;
    }
  
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  

    try {
      const response = await api.post('http://54.210.56.185:8080/registro', {
        nombres: nombres,
        apellidos: apellidos,
        email: email,
        password: password,
        telefono: telefono,
        division: division,
        rol: rol,
      });

      console.log(response.data);

      toast.success("Registro Exitosa");
      handleClose();
    } catch (error) {
      toast.error("Error " +error);
      console.error('Error al registrar:', error);
    }
  };

  return (
    <form  className='form'  onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div>
      <label>Nombres:</label><br></br>
      <input
        type="text"
        value={nombres}
        onChange={(e) => setNombres(e.target.value)}
      />
    </div>
    <div>
      <label>Apellidos:</label><br></br>
      <input
        type="text"
        value={apellidos}
        onChange={(e) => setApellidos(e.target.value)}
      />
    </div>
    <div>
      <label>Email:</label><br></br>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
   
    <div>
      <label>Teléfono:</label><br></br>
      <input
        type="text"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
    </div>
    <div>
      <label>División:</label><br></br>
      <input
        type="text"
        value={division}
        onChange={(e) => setDivision(e.target.value)}
      />
    </div>
    <div>
      <label>Rol:</label><br></br>
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="">Seleccione un rol</option>
        <option value="docente">Docente</option>
        <option value="tecnico">Técnico</option>
      </select>
    </div>
    <button type="submit" style={{ width: '100px', alignSelf: 'center' }}>Registrar</button>
  </form>
  
  );
};

export default Usuario;
