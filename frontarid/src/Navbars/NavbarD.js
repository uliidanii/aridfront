import "../assets/css/Nav.css";
import AuthService from "../services/AuthService";
import { Link } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import UserContext from "../services/UserContext";
import { Stomp } from "@stomp/stompjs";
import { faHome, faEllipsisV, faBars,faList,faUser,faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SockJS from "sockjs-client";
import '../assets/css/fondoNav.css'
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const NavbarD = ({user}) => {

  const { currentUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
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
      <button style={{backgroundColor:'transparent',border:'none'}} className="menu-button-" onClick={handleMenuToggle}>
      <FontAwesomeIcon size="2x" icon={faBars} />
      </button>
      <ul style={{marginTop:40}} className={`menu ${isMenuOpen ? "menu-open" : ""} fondoNavLateral`}>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/do', { replace: true, state: { user: user } });
            }}
            style={{color: "#ffffff",}}>
            <FontAwesomeIcon icon={faHome} style={{color: "#ffffff",marginRight:10}} />
          Inicio
          </a>
        </li>
        <br></br>
        <li>
          <a  
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/InfoDoc', { replace: true, state: { user: user } });
            }}    style={{color: "#ffffff",}}
          >
            <FontAwesomeIcon icon={faUser} style={{color: "#ffffff",marginRight:10}} />
            Perfil
          </a>
        </li>
        <br></br>
        <li>
          <a style={{color: "#ffffff",}}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#ffffff",marginRight:10}} />
            Cerrar sesión
          </a>
        </li>
        <br></br>
        
      </ul>
    </nav>
  );
};

export default NavbarD;
