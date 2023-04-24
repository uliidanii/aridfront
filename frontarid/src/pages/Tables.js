import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import NavbarA from '../Navbars/NavbarA';
import {  faTrash , faEdit,faChalkboardTeacher, faHardHat,faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { faUser, faChalkboard, faTh } from '@fortawesome/free-solid-svg-icons';
import Usuario from '../modales/usuario';
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import img from '../assets/img/ut.png'
import Spinner from '../components/Spinner'

const EditUserModal = ({ user, showModal, onClose, onSubmit }) => {
  const [username, setUsername] = useState(user.username);
  const [apellidos, setApellidos] = useState(user.apellidos);
  const [email, setEmail] = useState(user.email);
  const [roles, setRoles] = useState(user.roles);
  const [telefono, setTelefono] = useState(user.telefono);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedUser = {
      id: user.id,
      username,
      apellidos,
      email,
      roles,
      telefono,
    };
    onSubmit(updatedUser);
    onClose();
  };

  return (
    <div className={`modal ${showModal ? "d-block" : ""}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modificar Usuario</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellidos"
                  value={apellidos}
                  onChange={(event) => setApellidos(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="roles">Roles</label>
                <input
                  type="text"
                  className="form-control"
                  id="roles"
                  value={roles}
                  onChange={(event) => setRoles(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  value={telefono}
                  onChange={(event) => setTelefono(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
const IncidenciasModal = ({ email, userType, showModal, onClose }) => {
  const [incidencias, setIncidencias] = useState([]);

  useEffect(() => {
    fetchIncidencias();
  }, []);
  
  const fetchIncidencias = async () => {
    try {
      let response;
      console.log("User type: ", userType);
      console.log("Email: ", email);
  
      if (email.toLowerCase().includes("tecnico")) {
        console.log("Fetching incidencias for tecnico");
        response = await api.get(`/incidencias/tecnico/${email}/incidencias`);
      } else {
        console.log("Fetching incidencias for docente");
        response = await api.get(`/incidencias/docente/${email}/incidencias`);
      }
      setIncidencias(response.data);
      console.log("Incidencias: ", response.data); 
    } catch (error) {
      console.error(error);
    }
  };
  
  


  return (
    <div className={`modal ${showModal ? "d-block" : ""}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Incidencias</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <ul className="list-group">
            {incidencias.map((incidencia, index) => (
  <li key={index} className="list-group-item">
    {incidencia.titulo} - {incidencia.estado}
  </li>
))}

            </ul>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const TableRow = ({ user, onDelete, onUpdate, sortUsersByApellidos }) => {
  const [showIncidenciasModal, setShowIncidenciasModal] = useState(false);
 
  const showDeleteConfirmation = () => {
    toast(
      (
        <div style={{ textAlign: "center" }}>
          <p>¿Deseas eliminar este usuario?</p>
          <div>
            <button
              className="btn btn-danger"
              onClick={() => {
                handleConfirmedDelete();
                toast.dismiss();
              }}
              style={{ marginRight: "px" }}
            >
              Sí, eliminar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                toast.dismiss();
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: false,
      }
    );
  };
  
  
  const handleConfirmedDelete = () => {
    onDelete(user.id);
  };
  
  const handleDelete = () => {
    showDeleteConfirmation();
  };
  

  const handleUpdate = () => {
    onUpdate(user);
  };


const onShowIncidencias = () => {
  setShowIncidenciasModal(true);
};
return (
  <>
  <ToastContainer />
    <tr key={user.id}>
      <td>{user.username}</td>
      <td>{user.apellidos}</td>
      <td>{user.email}</td>
      <td>{user.roles}</td>
      <td>{user.telefono}</td>
      <td>
       
        <button style={{color:'red', background:'transparent',border:'none'}} onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrash} size='2x' />
        </button>
      </td>
      <td>
        <button style={{color:'#0475CF',background:'transparent',border:'none'}} onClick={handleUpdate}>
          <FontAwesomeIcon icon={faEdit} size='2x'/>
        </button>
      </td>
      <td>
      <button style={{color:'#89CBE7',background:'transparent',border:'none'}} onClick={onShowIncidencias}>
          <FontAwesomeIcon icon={faClipboardList} size='2x'/>
        </button>
      </td>
      
    </tr>
    {
      showIncidenciasModal && (
        <IncidenciasModal
          email={user.email}
          userType={user.roles}
          showModal={showIncidenciasModal}
          onClose={() => setShowIncidenciasModal(false)}
        />
      )
    }
  </>
);
};
const FilterableTable = ({ users, onDelete, onUpdate }) => {
  const [filterText, setFilterText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const sortUsersByApellidos = (usersToSort) => {
    const sortedUsers = [...usersToSort];
   
    return sortedUsers;
  };

  useEffect(() => {
    const lowerCaseFilterText = filterText.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerCaseFilterText) ||
        user.apellidos.toLowerCase().includes(lowerCaseFilterText)
    );
    setFilteredUsers(sortUsersByApellidos(filtered));
  }, [filterText, users]);

  return (
    <>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="filter"
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
          placeholder="Buscar por nombre de usuario o apellido"
        />
      </div>
      <table style={{marginTop:20}} className="table table-striped table-bordered table-hover">
        <thead className="thead-dark">
          <tr style={{background:'#224e76',color:'white'}}>
            <th>Username</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Teléfono</th>
            <th>Eliminar</th>
            <th>Modificar</th>
            <th>Incidencias</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user.id}
              user={user}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

const Tables = () => {
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState("docentes");
  const location = useLocation();
  const user = location.state.user;
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showIncidenciasModal, setShowIncidenciasModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const handleShowUserModal = () => setShowUserModal(true);
  const handleCloseUserModal = () => setShowUserModal(false);
  const [isSorted, setIsSorted] = useState(false);
  const [loading, setLoading] = useState(false)
  const sortUsersByApellidos = (usersToSort, ascending) => {
    const sortedUsers = [...usersToSort];
    sortedUsers.sort((a, b) => ascending ? a.apellidos.localeCompare(b.apellidos) : b.apellidos.localeCompare(a.apellidos));
    return sortedUsers;
  };
  
 
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://44.197.13.101:8080/api/${userType}`);
      setUsers(response.data);
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, [userType]);

  const handleButtonClick = (type) => {
    setUserType(type);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://44.197.13.101:8080/api/${userType}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

<Usuario handleClose={handleCloseUserModal} onUserRegistered={fetchData} />


  const FloatingButton = ({ onClick, children, style }) => {
    return (
      <button
        onClick={onClick}
        style={{
          position: 'fixed',
          borderRadius: '50%',
          border: 'none',
          padding: '15px',
          backgroundColor: '#088A68',
          color: 'white',
          cursor: 'pointer',
          ...style,
        }}
      >
        {children}
      </button>
    );
  };
 

  return (
    <>
      <NavbarA user={user} />

      <FloatingButton
        onClick={handleShowUserModal}
        style={{ bottom: '30px', right: '30px' }}
      >
      <FontAwesomeIcon icon={faUser} />
      </FloatingButton>

      <Modal show={showUserModal} onHide={handleCloseUserModal}>
        <Modal.Header style={{background:'#042B61'}} closeButton>
          <Modal.Title style={{color:'#ffff'}}> Registar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Usuario handleClose={handleCloseUserModal} 
           onUserRegistered={() => {
            fetchData();
          }} />
        </Modal.Body>
      </Modal>

      <br></br>
      <div className="container" style={{padding:15}}>
        <div className="d-flex justify-content-between mt-3 mb-3">
          <button
            style={{ paddingLeft: "10px", width: "40%" }}
            onClick={() => handleButtonClick("docentes")}
            className="btn btn-primary"
          >
           <FontAwesomeIcon icon={faChalkboardTeacher } style={{marginRight:10}}/>
           Docentes
          </button>
          <button
            style={{ paddingLeft: "10px", width: "40%" }}
            onClick={() => handleButtonClick("tecnicos")}
            className="btn btn-primary"
          >
        <FontAwesomeIcon icon={faHardHat} style={{marginRight:10}}/>
        Tecnicos
          </button>
          <button
  className="btn btn-primary mb-2"
  onClick={() => {
    const sortedUsers = sortUsersByApellidos(users, !isSorted);
    setUsers(sortedUsers);
    setIsSorted(!isSorted);
  }}
>
  <FontAwesomeIcon icon={faSort} style={{marginRight:10}}/>
  Ordenar por apellido
</button>

        </div>
        <FilterableTable users={users} onDelete={handleDelete} onUpdate={handleUpdate}   sortUsersByApellidos={sortUsersByApellidos} />
        {
          showModal && (
            <EditUserModal
              user={selectedUser}
              showModal={showModal}
              onClose={() => setShowModal(false)}
              onSubmit={(updatedUser) => {
                // Actualizar el usuario en la lista de usuarios
                const updatedUsers = users.map((user) =>
                  user.id === updatedUser.id ? updatedUser : user
                );
                setUsers(updatedUsers);
                setShowModal(false);
              }}
            />
          )
        }
      </div>
      {
  showIncidenciasModal && (
    <IncidenciasModal
      email={selectedUser.email}
      userType={userType}
      showModal={showIncidenciasModal}
      onClose={() => setShowIncidenciasModal(false)}
    />
  )
}
    </>
  );
};
export default Tables;
