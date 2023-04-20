import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarD from '../Navbars/NavbarD';
import '../assets/css/style.css';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera,faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
const InfoDoc = () => {
  const location = useLocation();
  const user = location.state.user;
  console.log('UserDoc:', user);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    apellidos: user.apellidos,
    email: user.email,
    password: user.password,
    roles: user.roles,
    telefono: user.telefono
  });
  const [imageUrl, setImageUrl] = useState(null);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        await uploadImage(user.id, file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
      }
    }
  };

  const fetchImage = async () => {
    try {
      const response = await api.get(`/api/docentes/${user.id}/imagen`, {
        responseType: "arraybuffer",
      });
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      setImageUrl(`data:image/png;base64,${base64}`);
      console.log('Imagen obtenida correctamente:', imageUrl);
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
    }
  };

  useEffect(() => {
    if (!imageUrl) {
      fetchImage();
    }
  }, [user.id, imageUrl]);

  const uploadImage = async (userId, file) => {
    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const response = await api.post(`/api/docentes/${userId}/imagen`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log('Imagen cargada correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error al cargar la imagen:", error.response);
      throw error;
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log(formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.username) {
      alert('El campo Nombre no puede estar vacío');
      return;
    }
    if (parseInt(formData.telefono) < -2147483648 || parseInt(formData.telefono) > 2147483647) {
      toast.info("El valor del campo Teléfono está fuera del rango permitido");
      return;
    }
    console.log("Datos enviados:", formData);
    try {
      const response = await api.put(
        `/api/docentes/${user.id}`,
        formData
      );
      if (response.status === 200) {
        user.username = formData.username;
        user.apellidos = formData.apellidos;
        user.email = formData.email;
        user.password = formData.password
        user.roles = formData.roles;
        user.telefono = formData.telefono;
        toast.success("Información actualizada");
        handleCloseModal();
      } else {
        toast.error("Error al actualizar la información");
      }
    } catch (error) {
      console.error('Error al actualizar la información:', error);
      toast.error("Error al actualizar la información");
    }
  };

  return (
    <>
      <NavbarD user={user} />
      <br></br>
      <div className="container">
        <div className="row">
          <div className="col-12">

            <div className="card-header" style={{ backgroundColor: "#03A693", color: "white" }}>
              <div className="d-flex justify-content-between bd-highlight">
                <div className="bd-highlight"></div>
                <div className="bd-highlight">
                  <h4>Mi Perfil</h4>
                </div>
                <div className="bd-highlight"> </div>
              </div>
            </div>
            <div className="card">

              <div className="container">
                <div className="main-body">
                  <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex flex-column align-items-center text-center">
                            <img
                              src={imageUrl || "https://bootdey.com/img/Content/avatar/avatar7.png"}
                              alt=""
                              className="rounded-circle"
                              width="150"
                            />
                            <div className="mt-3">
                              <h4>scx</h4>
                              <p className="text-secondary mb-1">

                              </p>
                              <p className="text-muted font-size-sm">

                              </p>
                              <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
                                <FontAwesomeIcon icon={faCamera} size="2x" />
                              </label>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                              />

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="card mb-3">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-sm-3">
                              <h6 className="mb-0">Nombre</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              {user.username}
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <h6 className="mb-0">Apellidos</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              {user.apellidos}
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <h6 className="mb-0">Email</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              {user.email}
                            </div>
                          </div>
                          
                          <hr />
                          <div className="row">
        <div className="col-sm-3">
          <h6 className="mb-0">Contraseña</h6>
        </div>
        <div className="col-sm-9 text-secondary">
          {user.password}
        </div>
      </div>
      <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <h6 className="mb-0">Rol</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              {user.roles}
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <h6 className="mb-0">Telefono</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              {user.telefono}
                            </div>

                          </div>
                          <hr />
                          <button type="submit" style={{margin:'15px',width: '50px',color:'#002E60', alignSelf: 'center',backgroundColor:'transparent',border:'none'}}onClick={handleShowModal}>
<FontAwesomeIcon icon={faPencilAlt} size='2x'/>
</button>
           
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header style={{background:'#042B61'}} closeButton>
          <Modal.Title style={{color:'#ffff'}}>Modificar información personal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className='form' onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="username">Nombre:</label><br></br>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos:</label><br></br>
              <input type="text" id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label><br></br>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <br></br>
              <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">telefono</label><br></br>
              <input type="number" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange}  step="1" />
            </div>
         
            <button type="submit" style={{ width: '100px', alignSelf: 'center' }}>guardar</button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InfoDoc;
