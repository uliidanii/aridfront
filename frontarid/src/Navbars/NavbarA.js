import { useState } from "react";
import '../assets/css/Nav.css';
import AuthService from "../services/AuthService";
import { useLocation, useNavigate } from 'react-router-dom';
import { faHome, faBars,faUsers, faChartBar, faTimes,faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from 'react-toastify';
import '../assets/css/fondoNav.css'

const NavbarA = ({user, handleShowUserModal, handleShowAulaLabModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [seleccion, setSeleccion] = useState(1);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubMenuToggle = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleLogout = () => {
   
    toast(
      <div className='text-center'>
        ¿Quieres cerrar sesión?
        <div className="text-right mt-2">
          <button
            className="btn btn-danger mr-2"
            onClick={() => {
              AuthService.logout();
              window.location.reload();
            }}
          >
            Si
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              toast.dismiss();
            }}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <nav className="fondoNav">
             <button style={{backgroundColor:'transparent',border:'none'}} className="menu-button-black" onClick={handleMenuToggle}>
        <FontAwesomeIcon size="2x" icon={faBars} />
      </button>
    <ul  style={{marginTop:40}} className={`menu ${isMenuOpen ? 'menu-open' : ''} fondoNavLateral`}>
      <li>
        <a style={{color: "#ffffff",}}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/ad', { replace: true, state: { user: user } });
          }}
        >
          <FontAwesomeIcon style={{color: "#ffffff", marginRight:10}}icon={faHome} />
        Inicio
        </a>
      </li>
      <br></br>
      <li>
        <a style={{color: "#ffffff",}}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/tables', { replace: true, state: { user: user } });
          }}
        >
          <FontAwesomeIcon style={{color: "#ffffff",marginRight:10}} icon={faUsers} />
        Usuarios
        </a>
      </li>
      <br></br>
      <li>
        <a style={{color: "#ffffff",}}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/informes', { replace: true, state: { user: user } });
          }}
        >
          <FontAwesomeIcon style={{color: "#ffffff",marginRight:10}} icon={faChartBar} />
         Informes
        </a>
      </li>
      <br></br>
      <li>
        <a style={{color: "#ffffff",}}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/InfoD', { replace: true, state: { user: user } });
          }}
        >
          <FontAwesomeIcon style={{color: "#ffffff",marginRight:10}} icon={faUser} />
       Perfil
        </a>
      </li>
      <br></br>
      <li style={{ float: 'left' }}>
        <a  style={{color: "#ffffff",}}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
         <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#ffffff", marginRight:10}} />
       Cerrar sesión
        </a>
      </li>
    </ul>
  </nav>
  );
};

export default NavbarA;
