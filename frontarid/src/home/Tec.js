import React, { useState, useEffect, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from '../board/Colum';
import ChatMD from '../pages/ChatMD';
import api from '../services/api';
import UserContext from '../services/UserContext';
import { assignTechnicianToIncidencia } from '../services/api';
import NavbarT from '../Navbars/NavbarT';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Tec = () => {
  const [incidencias, setIncidencias] = useState([]);
  const { currentUser } = useContext(UserContext);
  const correoTecnico = currentUser.email;
  const [showChatMD, setShowChatMD] = useState(false);
  const location = useLocation();
  const user = location.state ? location.state.user : { email: '', roles: '' };
  const [selectedDocenteId, setSelectedDocenteId] = useState(null);
  const [selectedIncidenciaId, setselectedIncidenciaId] = useState(null);
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);
  const [selectedIncidenciaStatus, setSelectedIncidenciaStatus] = useState(null);

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
          await assignTechnicianToIncidencia(sourceIncidencia.id, correoTecnico);
        } catch (error) {
          console.error('Error al asignar el técnico a la incidencia:', error);
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
        const responsePendientes = await api.get('/incidencias', {
          params: { estado: 'PENDIENTE' },
        });
        const responseActivas = await api.get('/incidencias', {
          params: { estado: 'ACTIVA', emailTecnico: correoTecnico },
        });
        const responseCompletadas = await api.get('/incidencias', {
          params: { estado: 'COMPLETADA', emailTecnico: correoTecnico },
        });
  
        setIncidencias([
          ...responsePendientes.data,
          ...responseActivas.data,
          ...responseCompletadas.data,
        ]);
        console.log("Incidencias obtenidas:", [
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
  const handleShowChatMD = (docenteId, incidenciaId,estadoIncidencia) => {
    if (docenteId === null) {
      toast.error("Técnico no definido");
      return;
    } 
    const foundIncidencia = incidencias.find((inc) => inc.id === incidenciaId);
    setSelectedIncidencia(foundIncidencia);
    setSelectedDocenteId(docenteId);
    setselectedIncidenciaId(incidenciaId);
    setSelectedIncidenciaStatus(estadoIncidencia); 
    setShowChatMD(true);
  };

  const handleCloseChatMD  = () => setShowChatMD (false);

  return (
    <>
      <NavbarT user={currentUser} />

    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        <Column
          title="Pendientes"
          incidencias={pendientes}
          onDrop={(incidencia) => handleIncidenciaDrop(incidencia, 'PENDIENTE')}
          handleShowChatMD={handleShowChatMD}
          userRole="tecnico"
        />
        <Column
          title="Activas"
          incidencias={activas}
          onDrop={(incidencia) => handleIncidenciaDrop(incidencia, 'ACTIVA')}
          handleShowChatMD={handleShowChatMD}
          userRole="tecnico"
        />
        <Column
          title="Completado"
          incidencias={completadas}
          onDrop={(incidencia) => handleIncidenciaDrop(incidencia, 'COMPLETADA')}
          handleShowChatMD={handleShowChatMD}
          userRole="tecnico"
       />
      </div>
    </DndProvider>
    <ChatMD
        show={showChatMD}
        handleClose={() => setShowChatMD(false)}
        docenteId={selectedDocenteId}
        incidenciaId={selectedIncidenciaId}
        estadoIncidencia={selectedIncidenciaStatus} 
      />
    </>
  );
  
};


export default Tec;