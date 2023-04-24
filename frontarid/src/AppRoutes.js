
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import Do from './home/Do';
import Ad from './home/Ad';
import Tec from './home/Tec';
import UserContext from './services/UserContext';
import Tables from './pages/Tables';
import InfoD from './pages/InfoD';
import InfoDoc from './pages/InfoDoc';
import InfoDtec from './pages/InfoDtec';
import { Informes } from './graficas/Informes';
import { InformesTecnico } from './graficasTecnico/InformesTecnico';
import AcceptIncident from './pages/AcceptIncident';
const AppRoutes = () => {
  const userContext = React.useContext(UserContext);
  const { currentUser } = userContext;

  const redirectToRoleBasedPage = () => {
    if (currentUser) {
      switch (currentUser.role) {
        case 'docente':
          return '/do';
        case 'tecnico':
          return '/tec';
        case 'admin':
          return '/ad';
        default:
          return '/';
      }
    }
    return '/';
  };

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />

      <Route
        path="/do"
        element={
          currentUser && currentUser.roles === 'docente' ? (
            <Do />
          ) : (
            <Navigate to={redirectToRoleBasedPage()} />
          )
        }
      />
      <Route
        path="/infoDoc"
        element={
          currentUser && currentUser.roles === 'docente' ? (
            <InfoDoc />
          ) : (
            <Navigate to={redirectToRoleBasedPage()} />
          )
        }
      />

      <Route
        path="/tec"
        element={
          currentUser && currentUser.roles === 'tecnico' ? (
            <Tec />
          ) : (
            <Navigate to={redirectToRoleBasedPage()} />
          )
        }
      />
      <Route
        path="/infoDtec"
        element={
          currentUser && currentUser.roles === 'tecnico' ? (
            <InfoDtec />
          ) : (
            <Navigate to={redirectToRoleBasedPage()} />
          )
        }
      />

      <Route
        path="/ad"
        element={
          currentUser && currentUser.roles === 'admin' ? (
            <Ad />
          ) : (
            <Navigate to={redirectToRoleBasedPage()} />
          )
        }
      />
      <Route
        path="/infoD"
        element={
          currentUser && currentUser.roles === 'admin' ? (
            <InfoD />
          ) : (
            <Navigate to={redirectToRoleBasedPage()} />
          )
        }
      />
      <Route
        path="/informes"
        element={
          currentUser && currentUser.roles === 'admin' ? (
            <Informes />
          ) : (
            <Navigate to={redirectToRoleBasedPage()} />
          )
        }
      />
      <Route
        path="/informesTecnico"
        element={
          currentUser && currentUser.roles === 'tecnico' ? (
            <InformesTecnico />
          ) : (
            <Navigate to={redirectToRoleBasedPage()} />
          )
        }
      />
      <Route
  path="/tables"
  element={
    currentUser && currentUser.roles === 'admin' ? (
      <Tables />
    ) : (
      <Navigate to={redirectToRoleBasedPage()} />
    )
  }
/>
<Route
        path="/accept-incident"
        element={
          <AcceptIncident />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
