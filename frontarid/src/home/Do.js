import React, { useState, useEffect, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Modal } from 'react-bootstrap';
import UserContext from '../services/UserContext';
import Incidencia from '../modales/incidencia';
import NavbarD from '../Navbars/NavbarD';
import Column from '../board/Colum';
import api from '../services/api';
import ChatModal from '../pages/ChatModal'
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { faHome, faUsers, faChartBar, faTimes, faUser, faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from '../components/Spinner'
import img from '../assets/img/ut.png'

const Do = () => {
  const [loading, setLoading] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAulaLabModal, setShowAulaLabModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const location = useLocation();
  const user = location.state ? location.state.user : { email: '', roles: '' };
  const handleShowUserModal = () => setShowUserModal(true);
  const handleCloseUserModal = () => setShowUserModal(false);
  const handleShowAulaLabModal = () => setShowAulaLabModal(true);
  const handleCloseAulaLabModal = () => setShowAulaLabModal(false);
  const [selectedIncidenciaStatus, setSelectedIncidenciaStatus] = useState(null);

  const [incidencias, setIncidencias] = useState([]);
  const { currentUser } = useContext(UserContext);
  const correoDocente = currentUser.email;
  const [selectedTecnicoId, setSelectedTecnicoId] = useState(null);
  const [selectedIncidenciaId, setselectedIncidenciaId] = useState(null);
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);

  const handleNewMessageNotification = (message) => {
    toast.info(`Nuevo mensaje de ${message.docente}: ${message.contenido}`);
  };
  const updateIncidencias = async () => {
    try {
      const response = await api.get('/incidencias/docente', {
        params: { emailDocente: correoDocente },
      });

      setIncidencias(response.data);
    } catch (error) {
      console.error('Error al actualizar las incidencias:', error);
    }
  };

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        setLoading(true)
        const response = await api.get('/incidencias/docente', {
          params: { emailDocente: correoDocente },
        });
        setIncidencias(response.data);
        setLoading(false)
      } catch (error) {
        console.error('Error al obtener las incidencias:', error);
        setLoading(false)
      }
    };
    fetchIncidencias();
  }, []);

  const handleShowChatModal = (tecnicoId, incidenciaId, estadoIncidencia) => {
    if (tecnicoId === null) {
      toast.error("Técnico no definido");
      return;
    }
    const foundIncidencia = incidencias.find((inc) => inc.id === incidenciaId);
    setSelectedIncidencia(foundIncidencia);
    setSelectedTecnicoId(tecnicoId);
    setselectedIncidenciaId(incidenciaId);
    setSelectedIncidenciaStatus(estadoIncidencia);
    setShowChatModal(true);
  };

  const handleCloseChatModal = () => setShowChatModal(false);
  const pendientes = incidencias.filter(
    (incidencia) => incidencia.estado === 'PENDIENTE'
  );
  const activas = incidencias.filter(
    (incidencia) => incidencia.estado === 'ACTIVA'
  );
  const completadas = incidencias.filter(
    (incidencia) => incidencia.estado === 'COMPLETADA'
  );

  console.log("selectedTecnicoId:", selectedTecnicoId);
  const FloatingButton = ({ onClick, children, style }) => {
    return (
      <button
        onClick={onClick}
        style={{
          position: 'fixed',
          height: '50px',
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
    <div style={{backgroundImage:`url(${img})`,width:"100%",height:'100vh',backgroundRepeat:'no-repeat',backgroundPosition:'center'}}>
      <NavbarD user={user} />

      <ToastContainer />

      <FloatingButton
        onClick={handleShowAulaLabModal}
        style={{ bottom: '3%', right: '3%' }}

      >
        <FontAwesomeIcon icon={faAdd} />
      </FloatingButton>

      <Modal show={showAulaLabModal} onHide={handleCloseAulaLabModal}>
        <Modal.Header style={{ background: '#042B61' }} closeButton>
          <Modal.Title style={{ color: '#ffff' }}>Registrar incidencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Incidencia handleClose={handleCloseAulaLabModal} />
        </Modal.Body>
      </Modal>

      {loading?<Spinner/>:(
        <DndProvider backend={HTML5Backend}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>

          <Column
            title="Pendientes"
            incidencias={pendientes}
            isReadOnly={true}
            handleShowChatModal={handleShowChatModal}
            userRole="docente"
          />

          <Column
            title="Activas"
            incidencias={activas}
            isReadOnly={true}
            handleShowChatModal={handleShowChatModal}
            userRole="docente"
          />
          <Column
            title="Completado"
            incidencias={completadas}
            isReadOnly={true}
            handleShowChatModal={handleShowChatModal}
            userRole="docente"
          />
        </div>
      </DndProvider>
      )}

      <Modal show={showAulaLabModal} onHide={handleCloseAulaLabModal}>
        <Modal.Header style={{ background: '#042B61' }} closeButton>
          <Modal.Title style={{ color: '#ffff' }}>Registrar incidencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Incidencia
            handleClose={handleCloseAulaLabModal}
            onUpdateIncidencias={updateIncidencias}
          />
        </Modal.Body>
      </Modal>
      <ChatModal
        show={showChatModal}
        handleClose={() => setShowChatModal(false)}
        tecnicoId={selectedTecnicoId}
        incidenciaId={selectedIncidenciaId}
        incidencia={selectedIncidencia}
        onNewMessage={handleNewMessageNotification}
      />
    </div>
  );
};

export default Do;


