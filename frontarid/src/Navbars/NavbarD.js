import "../assets/css/Nav.css";
import AuthService from "../services/AuthService";
import { Link } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import UserContext from "../services/UserContext";
import { Stomp } from "@stomp/stompjs";
import { faHome, faUsers, faChartBar, faTimes,faUser,faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SockJS from "sockjs-client";

import { useLocation, useNavigate } from "react-router-dom";

const NavbarD = ({user}) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationText, setNotificationText] = useState(null);
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
    AuthService.logout();
    window.location.reload();
  };



  return (
    <nav>
      <ul className={`menu ${isMenuOpen ? "menu-open" : ""}`}>
      <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/do', { replace: true, state: { user: user } });
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
              navigate('/InfoDoc', { replace: true, state: { user: user } });
            }}
          >
            <FontAwesomeIcon icon={faUser} />
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
        <li>ARID</li>
      </ul>
    </nav>
  );
};

export default NavbarD;
