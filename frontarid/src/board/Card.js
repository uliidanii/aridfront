import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useDrag } from 'react-dnd';
import { Modal, Button,ListGroup  } from 'react-bootstrap';
import { faInfo,faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from 'react-bootstrap/Table';
import '../assets/css/carrusel.css';
import api from '../services/api';
import axios from 'axios';

const Card = ({
  incidencia,
  index,
  handleShowChatModal,
  incidenciaId,
  handleShowChatMD,
  userRole,
  estadoIncidencia,
  correoTecnico
}) => {
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [showModal, setShowModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const handleCloseReassignModal = () => setShowReassignModal(false);

  const loadTechnicians = async () => {
    try {
      const response = await api.get("/api/tecnicos");
      console.log("Técnicos cargados:", response.data);
      setTechnicians(response.data);
    } catch (error) {
      console.error("Error al cargar los técnicos:", error);
    }
  };

  const handleOpenReassignModal = () => {
    loadTechnicians();
    setShowReassignModal(true);
  };

  const handleReassignTechnician = async (newTechnicianEmail) => {
    try {
      
      await api.put(`/incidencias/${incidencia.id}/reasignar-tecnico?emailTecnico=${correoTecnico}&emailNuevoTecnico=${newTechnicianEmail}`);
      handleCloseReassignModal();
    } catch (error) {
      console.error("Error al reasignar el técnico:", error);
    }
  };
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "card",
    item: { incidencia },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  console.log("Estado de la incidencia seleccionada:", incidencia.estado);

  const serverBaseUrl = "http://3.230.179.252:8080";
  const area = incidencia && incidencia.area ? incidencia.area : {};
  const aula = incidencia && incidencia.aula ? incidencia.aula : {};
  const laboratorio = incidencia && incidencia.laboratorio ? incidencia.laboratorio : {};
  const [loading, setLoading] = useState(false);

  return (
    <div
      ref={drag}
      style={{
        padding: "8px",
        color: "",
        marginBottom: "8px",
        backgroundColor: isDragging ? "#ccc" : "#C8E8FF",
        borderRadius: "10px",
        cursor: "grab",
        background: "#ffff",
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
      }}
    >
      <h5 style={{padding:1.5,borderRadius:20}}>Titulo: {incidencia.titulo}</h5>
      <p style={{ color: "#042B61" }}>Descripción: {incidencia.descripcion}</p>
      {(incidencia.mediaUrl || !incidencia.mediaUrl) && (
        <div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button style={{ width: "45px",borderRadius:'50%'}} onClick={handleShowModal}>
              <FontAwesomeIcon icon={faInfo} />
            </Button>
            {(            userRole === "tecnico" || userRole === "docente") && (
              <Button
                disabled={incidencia.estado === "PENDIENTE"}
                style={{ width: "45px",borderRadius:'50%' }}
                onClick={() =>
                  userRole === "docente"
                    ? handleShowChatModal(incidencia.tecnicoId, incidencia.id, incidencia.estado)
                    : handleShowChatMD(incidencia.docenteId, incidencia.id, incidencia.estado)
                }
              >
                <FontAwesomeIcon icon={faMessage} />
              </Button>
            )}
            {userRole === "tecnico" && (
              <Button 
              disabled={incidencia.estado === "COMPLETADA"||incidencia.estado === "PENDIENTE" }
              style={{ width: "45px" }} onClick={handleOpenReassignModal}>
                R
              </Button>
            )}
          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header style={{ background: "#042B61" }} closeButton>
              <Modal.Title style={{ color: "#ffff" }}>Incidencia {index + 1}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row align-items-center"></div>
                <Table bordered hover>
                  <tbody>
                    <tr>
                      <th>Nombre:</th>
                      <td>{incidencia.docenteNombre}</td>
                    </tr>
                    <tr>
                      <th>Edificio:</th>
                      <td>{area.nombre}</td>
                    </tr>
                    <tr>
                      <th>Salon:</th>
                      <td>{aula.nombre || laboratorio.nombre}</td>
                    </tr>
                    <tr>
                      <th>Descripción:</th>
                      <td>{incidencia.descripcion}</td>
                    </tr>
                  </tbody>
                </Table>

                {incidencia.mediaUrls && (
                  <Carousel style={{ marginLeft: "110px" }}>
                    {incidencia.mediaUrls.map((mediaUrl, index) => (
                      <Carousel.Item key={index} className="carousel slide" data-bs-ride="carousel">
                        {[".mp4", ".avi", ".mov"].some((ext) => mediaUrl.endsWith(ext)) ? (
                          <video src={`${serverBaseUrl}${mediaUrl}`} controls style={{ maxWidth: "50%", height: "auto", margin: "auto" }} />
                        ) : (
                          <img src={`${serverBaseUrl}${mediaUrl}`} alt="Incidencia" style={{ maxWidth: "50%", height: "auto", margin: "auto" }} />
                        )}
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button style={{ backgroundColor: "#e92b2d", borderColor: "#e92b2d", width: "90px" }} variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showReassignModal} onHide={() => setShowReassignModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Seleccionar técnico</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ListGroup>
                {technicians.map((technician) => (
                  <ListGroup.Item
                    key={technician.id}
                    action
                    onClick={() => {
                      handleReassignTechnician(technician.email);
                      setShowReassignModal(false);
                    }}
                  >
                    {technician.name} - {technician.email}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowReassignModal(false)}>
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Card;
