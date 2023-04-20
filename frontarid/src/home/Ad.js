import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Usuario from '../modales/usuario';
import A from '../modales/A';
import NavbarA from '../Navbars/NavbarA';
import { useLocation } from 'react-router-dom';
import Column from '../board/Colum';
import api from '../services/api';
import UserContext from '../services/UserContext';
import { assignTechnicianToIncidencia, adminAcceptIncidencia } from '../services/api';
import { faUser, faChalkboard, faTh } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AreaForm from '../modales/AreaForm';
const Ad = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAulaLabModal, setShowAulaLabModal] = useState(false);

  const handleShowUserModal = () => setShowUserModal(true);
  const handleCloseUserModal = () => setShowUserModal(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const handleShowAreaModal = () => setShowAreaModal(true);
  const handleCloseAreaModal = () => setShowAreaModal(false);
  
  const handleShowAulaLabModal = () => setShowAulaLabModal(true);
  const handleCloseAulaLabModal = () => setShowAulaLabModal(false);
  const location = useLocation();
  const user = location.state ? location.state.user : { email: '', roles: '' };
  const [incidencias, setIncidencias] = useState([]);
  const { currentUser } = useContext(UserContext);
  const emailAdmin = currentUser.email;

  const handleIncidenciaDrop = async (sourceIncidencia, targetEstado) => {
    if (sourceIncidencia.estado === 'COMPLETADA') {
      toast.error("No se puede cambiar el estado de una incidencia completada");
      return;
    }
    const updatedIncidencia = { ...sourceIncidencia, estado: targetEstado };

    const performAction = async () => {
      setIncidencias((prevIncidencias) =>
        prevIncidencias.filter((incidencia) => incidencia.id !== updatedIncidencia.id)
      );

      if (sourceIncidencia.estado === 'PENDIENTE' && targetEstado === 'ACTIVA') {
        try {
          await adminAcceptIncidencia(sourceIncidencia.id, emailAdmin);
        } catch (error) {
          console.error('Error al aceptar la incidencia por el administrador:', error);
          return;
        }
      } else if (sourceIncidencia.estado === 'ACTIVA' && targetEstado === 'COMPLETADA') {
        try {
          await api.put(`/incidencias/${sourceIncidencia.id}/resolver`);
        } catch (error) {
          console.error('Error al resolver la incidencia:', error);
          return;
        }
      } else {
        try {
          await api.put(`/incidencias/${updatedIncidencia.id}`, updatedIncidencia);
        } catch (error) {
          console.error('Error al actualizar la incidencia:', error);
          return;
        }
      }


      setIncidencias((prevIncidencias) => [...prevIncidencias, updatedIncidencia]);
    };

    if (sourceIncidencia.estado === 'PENDIENTE' && targetEstado === 'ACTIVA') {
      confirmAlert({
        title: 'Confirmar',
        message: '¿Acabas de aceptar una incidencia?',
        buttons: [
          {
            label: 'Sí',
            onClick: performAction,
          },
          {
            label: 'Cancelar',
          },
        ],
      });
    } else if (sourceIncidencia.estado === 'ACTIVA' && targetEstado === 'COMPLETADA') {
      confirmAlert({
        title: 'Confirmar',
        message: '¿Estás seguro de que quieres finalizar?',
        buttons: [
          {
            label: 'Sí',
            onClick: performAction,
          },
          {
            label: 'Cancelar',
          },
        ],
      });
    } else {
      performAction();
    }
  };

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const responsePendientes = await api.get('/incidencias/admin', {
          params: { estado: 'PENDIENTE' },
        });
        const responseActivas = await api.get('/incidencias/admin', {
          params: { estado: 'ACTIVA' },
        });
        const responseCompletadas = await api.get('/incidencias/admin', {
          params: { estado: 'COMPLETADA' },
        });

        setIncidencias([
          ...responsePendientes.data,
          ...responseActivas.data,
          ...responseCompletadas.data,
        ]);
      } catch (error) {
        console.error('Error al obtener las incidencias:', error);
      }
    };

    fetchIncidencias();
  }, []);

  const pendientes = incidencias.filter(
    (incidencia) => incidencia.estado === 'PENDIENTE'
  );
  const activas = incidencias.filter(
    (incidencia) => incidencia.estado === 'ACTIVA'
  );
  const completadas = incidencias.filter(
    (incidencia) => incidencia.estado === 'COMPLETADA'
  );

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

      <FloatingButton
        onClick={handleShowAulaLabModal}
        style={{ bottom: '30px', right: '200px' }}
      >
      <FontAwesomeIcon icon={faChalkboard} />
      </FloatingButton>
      <FloatingButton
  onClick={handleShowAreaModal}
  style={{ bottom: '30px', right: '370px' }}
>
  <FontAwesomeIcon icon={faTh} />
</FloatingButton>


      <Modal show={showUserModal} onHide={handleCloseUserModal}>
        <Modal.Header style={{background:'#042B61'}} closeButton>
          <Modal.Title style={{color:'#ffff'}}> Registar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Usuario handleClose={handleCloseUserModal} />
        </Modal.Body>
      </Modal>

      {/* Aula/Laboratorio Modal */}
      <Modal show={showAulaLabModal} onHide={handleCloseAulaLabModal}>
        <Modal.Header style={{background:'#042B61'}} closeButton>
          <Modal.Title style={{color:'#ffff'}}>Registar Aula/Laboratorio </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <A handleClose={handleCloseAulaLabModal} />
        </Modal.Body>
      </Modal>
      <Modal show={showAreaModal} onHide={handleCloseAreaModal}>
  <Modal.Header style={{background:'#042B61'}} closeButton>
    <Modal.Title style={{color:'#ffff'}}>Registrar Área</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <AreaForm handleClose={handleCloseAreaModal} />
  </Modal.Body>
</Modal>
      <DndProvider backend={HTML5Backend}>
        <div style={{ display: 'flex', justifyContent: 'space-around' ,textAlign: 'center'}}>
          <Column
            title="Pendientes"
            incidencias={pendientes}
            onDrop={(incidencia) => handleIncidenciaDrop(incidencia, 'PENDIENTE')}
          />
          <Column
            title="Activas"
            incidencias={activas}
            onDrop={(incidencia) => handleIncidenciaDrop(incidencia, 'ACTIVA')}
          />
          <Column
            title="Completado"
            incidencias={completadas}
            onDrop={(incidencia) => handleIncidenciaDrop(incidencia, 'COMPLETADA')}
          />
        </div>
      </DndProvider>



    </>
  );
};

export default Ad;