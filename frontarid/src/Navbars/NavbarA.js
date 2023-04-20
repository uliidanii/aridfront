import { useState } from "react";
import '../assets/css/Nav.css';
import AuthService from "../services/AuthService";
import { useLocation, useNavigate } from 'react-router-dom';
import { faHome, faUsers, faChartBar, faTimes,faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const NavbarA = ({user, handleShowUserModal, handleShowAulaLabModal }) => {
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
    <ul className={`menu ${isMenuOpen ? 'menu-open' : ''}`}>
      <li>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/ad', { replace: true, state: { user: user } });
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
            navigate('/tables', { replace: true, state: { user: user } });
          }}
        >
          <FontAwesomeIcon icon={faUsers} />
        
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/informes', { replace: true, state: { user: user } });
          }}
        >
          <FontAwesomeIcon icon={faChartBar} />
         
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/InfoD', { replace: true, state: { user: user } });
          }}
        >
          <FontAwesomeIcon icon={faUser} />
       
        </a>
      </li>
      <li style={{ float: 'left' }}>
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
      {/* ... */}
    </ul>
  </nav>
  );
};

export default NavbarA;
