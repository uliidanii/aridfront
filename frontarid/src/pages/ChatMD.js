import React, { useState, useEffect, useContext, useRef } from 'react';
import '../assets/css/chat.css';
import UserContext from '../services/UserContext';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import { ToastContainer, toast } from 'react-toastify';
import api from '../services/api';

const ChatMD = ({ show, handleClose, docenteId, incidenciaId,estadoIncidencia }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState(null);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);
  const SERVER_BASE_URL = 'http://44.197.13.101:8080';
  const { currentUser } = useContext(UserContext);
  const tecnicoId = currentUser.id;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const fetchMessages = async () => {
    console.log("tecnico" +tecnicoId);
    console.log("docente"+docenteId)
    if (!tecnicoId || !docenteId) {
      console.error("docenteId o tecnicoId no están definidos");
      return;
    }
    if (!incidenciaId) {
      console.error("El id de la incidencia no puede ser nulo");
 
      return;
    }
  
    try {
      const response = await api.get(
        `api/tecnico/conversations/${tecnicoId}/${docenteId}/${incidenciaId}`
      );
      
      setMessages(response.data);
      console.log("Mensajes cargados:", response.data);
    
    } catch (error) {
      console.error("Error al cargar los mensajes:", error);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://44.197.13.101:8080/upload-file", formData);
      return response.data.fileUrl;
    } catch (error) {
      throw new Error("Error al cargar el archivo:", error);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageContent.trim() === '' && !file) return;
  
    if (!connected) {
      toast.error("No se pudo enviar el mensaje, la conexión no está disponible.");
      return;
    }
    const newMessage = {
      docenteId: docenteId,
      tecnicoId: tecnicoId,
      incidenciaId: incidenciaId,
      contenido: messageContent,
      fileUrl: '',
    };

    if (file) {
      try {
        const fileUrl = await uploadFile(file);
        console.log("Archivo cargado: " + fileUrl);
        newMessage.fileUrl = fileUrl;
      } catch (error) {
        console.error("Error al cargar el archivo:", error);
      }
    }

    stompClientRef.current.send(
      "/app/chat/enviar-mensaje",
      {},
      JSON.stringify(newMessage)
    );

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageContent('');
    setFile(null);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    const chatId = `chat_${docenteId}_${tecnicoId}`;
    const socket = new SockJS('http://44.197.13.101:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.onConnect = () => {
      console.log('Connected');
      setConnected(true);

      stompClient.subscribe(`/topic/chat/${chatId}`, (newMessage) => {
        console.log("New message received:", JSON.parse(newMessage.body));
        setMessages((prevMessages) => [
          ...prevMessages,
          JSON.parse(newMessage.body),
        ]);
        scrollToBottom();
      });
      fetchMessages();
    };

    stompClient.onStompError = (error) => {
      console.error('Error:', error);
    };

    stompClient.activate();

    return () => {
      if (stompClient.connected) {
        stompClient.deactivate();
        setConnected(false);
      }
    };
  }, [docenteId, tecnicoId]);

  useEffect(() => {
    if (show) {
      fetchMessages();
    }
  }, [show]);

  
  const isTeacherMessage = (message) => {
    return message.tecnicoId !== tecnicoId;
  };
  
    
        
  return (
  
    <Modal show={show} onHide={handleClose} style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)" }}>

    <Modal.Body>
    <div className="message-container" style={{ maxHeight: "300px", overflowY: "auto",boxShadow: "0px 2px 4px rgba(1, 1, 1, 0.3)" }}>
    {messages.map((message) => (
  <div
    key={message.id}
    className={`message ${isTeacherMessage(message) ? 'message-teacher' : 'message-technician'}`}
  >
    <p className="sender">
      {isTeacherMessage(message) ? '' : message.tecnico}
    </p>
    <p className="content">{message.contenido}</p>
    {message.fileUrl && (
      message.fileUrl.toLowerCase().endsWith('.pdf') ? (
        <p>Archivo PDF adjunto: <a href={`${SERVER_BASE_URL}${message.fileUrl}`} target="_blank" rel="noopener noreferrer">Descargar</a></p>
      ) : (
        /\.(jpe?g|png|gif)$/i.test(message.fileUrl) ? (
          <img
            src={`${SERVER_BASE_URL}${message.fileUrl}`}
            alt="Imagen adjunta"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        ) : (
          <video
            src={`${SERVER_BASE_URL}${message.fileUrl}`}
            controls
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        )
      )
    )}
  </div>

  ))}
  <div ref={messagesEndRef} />

      </div>
      <br></br>
      <form className='form' onSubmit={sendMessage}>
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Escribe tu mensaje aquí"
        />
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
          <Button type="submit" disabled={estadoIncidencia === "COMPLETADA"}>
  Enviar
</Button>
      </form>
    </Modal.Body>
  </Modal>
  );
};

export default ChatMD;
