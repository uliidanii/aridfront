import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import UserContext from '../services/UserContext';
import '../assets/css/style.css';
import imagen from '../assets/img/utez.png';
import { ToastContainer, toast } from 'react-toastify';
import alc from '../assets/img/alc.png';
import { faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const [recoveringPassword, setRecoveringPassword] = useState(false);

  //MOESTRAR O OCULTAR CONTRASEÑA
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
 
    const validateEmail = (email) => {
      const regex = /^[\w-]+(\.[\w-]+)*@utez\.edu\.mx$/;
      return regex.test(email);
    };
    const validateForm = () => {
      if (email === '' ) {
        toast.error('Por favor, llena todos los campos');
        return false;
      }
    
      if (!validateEmail(email)) {
        toast.error('Por favor, ingresa un correo válido con la terminación @utez.edu.mx');
        return false;
      }
    
      return true;
    };
    const handleSubmit = async (event) => {
      event.preventDefault();
      setMessage('');
      if (!validateForm()) {
        return;
      }  
    try {
      const user = await AuthService.login(email, password);
      setCurrentUser(user); 
      console.log(user);
      if (user.roles === 'docente') {
        console.log('Redirigiendo a do');
        navigate('/do',{ replace: true, state: { user: user }});
      } else if (user.roles === 'tecnico') {
        console.log('Redirigiendo a Tec');
        navigate('/tec',{ replace: true, state: { user: user }});
      } else if (user.roles === 'admin') {
        console.log('Redirigiendo a Adm');
        navigate('/ad', { replace: true, state: { user: user } });
      } else {
        console.log('Redirigiendo a Profile');
        navigate('/profile');
      }
      
    } catch (error) {
      console.log(error);

      toast.error("Correo o Contraseña Incorrecta");
    }
  };

  const handleRecoverPassword = async (event) => {
    event.preventDefault();
    setMessage('');
  
    if (!validateForm()) {
      return;
    }
    try {
      await AuthService.recoverPassword(email);
      setMessage("Se ha enviado un correo con la nueva contraseña.");
      toast.success("Se ha enviado un correo con la nueva contraseña.");
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      setMessage("Error al recuperar contraseña. Por favor, intenta de nuevo.");
      toast.error("Error al recuperar la contraseña");
    }
  };

  return (

    <>
    <div className="main-container fondoLogin">
      {recoveringPassword ? (
        
        <div className="form-body">
          <h4 style={{marginTop:30}} class="text-center">Recuperar contraseña</h4>
          <form onSubmit={handleRecoverPassword}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Correo Institucional"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary btn-block mt-4">
                Enviar correo
              </button>
            </div>
          </form>
          <div className="text-center">
            <a style={{color:'blue'}} href="#" onClick={() => setRecoveringPassword(false)}>
              Volver al inicio de sesión
            </a>
          </div>
        </div>
      ) : (

        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div style={{marginTop:25}}>
              <img style={{marginBottom:50}} src={imagen} alt="Imagen" />
              {/* <img src={alc} alt="Imagen de inicio de sesión" class="login-image" /> */}
              <input style={{borderRadius:5}} type="email" id="email" name="email" placeholder="Correo Institucional" value={email}
                onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div style={{display:'flex'}}>
              <input style={{ borderRadius: 5,marginLeft:50 }} type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)}/>
              <button type="button" style={{background: "transparent",color: "black",display:'flex-start',width:'5px',border:'none',marginRight:10}} id="togglePassword" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div style={{marginTop:10}}>
          <a style={{color:'blue'}} href="#" onClick={() => setRecoveringPassword(true)}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>
            <div>
              <button style={{borderRadius:20}} type="submit" class="btn btn-primary btn-block mt-4">Iniciar Sesión</button>
            </div>
          </form>
        </div>

      )}
      </div>
    </>
  );
};

export default LoginForm;
