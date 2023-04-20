
import '../assets/css/Nav.css';
import AuthService from "../services/AuthService";
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUsers, faChartBar, faTimes,faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useContext, useEffect } from "react";
import UserContext from "../services/UserContext";

const NavbarT = (props) => {
  const user = props.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubMenuToggle = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.reload();
  };

  return (
    <nav>
      <ul className={`menu ${isMenuOpen ? 'menu-open' : ''}`}>
      <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/tec', { replace: true, state: { user: user } });
            }}
          >
            <FontAwesomeIcon icon={faHome} />
            
            Home
          </a>
        </li>

        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/InfoDtec', { replace: true, state: { user: user } });
            }}
          >
             <FontAwesomeIcon icon={faUser}/>
          </a>
        </li>
       

        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
          <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#ffffff",}} />
          </a>
        </li>

      </ul>
    </nav>
  );
};

export default NavbarT;
