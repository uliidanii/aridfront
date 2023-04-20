import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useDrag } from 'react-dnd';
import { Modal, Button } from 'react-bootstrap';
import { faPlus, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from 'react-bootstrap/Table';
import '../assets/css/carrusel.css';
const Card = ({ incidencia, index, handleShowChatModal, incidenciaId, handleShowChatMD, userRole }) => {
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [showModal, setShowModal] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { incidencia },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  console.log("Estado de la incidencia seleccionada:", incidencia.estado);

  const serverBaseUrl = "http://localhost:8080";
  const area = incidencia && incidencia.area ? incidencia.area : {};
  const aula = incidencia && incidencia.aula ? incidencia.aula : {};
  const laboratorio = incidencia && incidencia.laboratorio ? incidencia.laboratorio : {}
  return (
    <div
      ref={drag}
      style={{
        padding: '8px',
        color: '',
        marginBottom: '8px',
        backgroundColor: isDragging ? '#ccc' : '#ffff',
        border: '2px solid #ccc',
        borderRadius: '4px',
        cursor: 'grab',
        background: '#ffff'

      }}
    >

      <h5 >Titulo: {incidencia.titulo}</h5>
      <p style={{ color: '#042B61' }}>Descripción: {incidencia.descripcion}</p>
      {(incidencia.mediaUrl || !incidencia.mediaUrl) && (
        <div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button style={{ width: '45px' }} onClick={handleShowModal}><FontAwesomeIcon icon={faPlus} /> </Button>
            <Button
              style={{ width: "45px" }}
              onClick={() =>
                userRole === "docente"
                  ? handleShowChatModal(incidencia.tecnicoId, incidencia.id, incidencia.estado)
                  : handleShowChatMD(incidencia.docenteId, incidencia.id, incidencia.estado)
              }
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </Button>

          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header style={{ background: '#042B61' }} closeButton>
              <Modal.Title style={{ color: '#ffff' }}>Incidencia {index + 1}</Modal.Title>
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
             <Carousel style={{marginLeft:'40px'}}>
             {incidencia.mediaUrls.map((mediaUrl, index) => (
               <Carousel.Item key={index} className="carousel slide" data-bs-ride="carousel">
                 {['.mp4', '.avi', '.mov'].some(ext => mediaUrl.endsWith(ext)) ? (
                   <video src={`${serverBaseUrl}${mediaUrl}`} controls style={{ maxWidth: '80%', height: 'auto', margin: 'auto' }} />
                 ) : (
                   <img src={`${serverBaseUrl}${mediaUrl}`} alt="Incidencia" style={{ maxWidth: '80%', height: 'auto', margin: 'auto' }} />
                 )}
               </Carousel.Item>
             ))}
           </Carousel>
           
              )}
                </div>

            </Modal.Body>
            <Modal.Footer>
              <Button style={{ backgroundColor: '#e92b2d', borderColor: '#e92b2d', width: '90px' }} variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>


        </div>

      )}
    </div>

  );
};

export default Card;