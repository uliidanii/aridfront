import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import NavbarA from '../Navbars/NavbarA';
const Tables = () => {
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState('docentes');
  const location = useLocation();
  const user = location.state.user;
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://3.83.153.165:8080/api/${userType}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }

    fetchData();
  }, [userType]);

  const handleButtonClick = (type) => {
    setUserType(type);
  };

  return (
    <>
    <NavbarA user={user} />
    <br></br>
    <div className="container">
    <div className="d-flex justify-content-between mt-3 mb-3">
      <button style={{paddingLeft:'10px', width:'40%'}} onClick={() => handleButtonClick('docentes')} className="btn btn-primary">Mostrar Docentes</button>
      <button style={{paddingLeft:'10px', width:'40%'}} onClick={() => handleButtonClick('tecnicos')} className="btn btn-primary">Mostrar Técnicos</button>
    </div>
    <table className="table table-striped table-bordered table-hover">
      <thead className="thead-dark">

          <tr>
            <th>Username</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.apellidos}</td>
              <td>{user.email}</td>
              <td>{user.roles}</td>
              <td>{user.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Tables;
