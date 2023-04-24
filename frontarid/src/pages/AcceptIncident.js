import React from 'react';
import '../assets/css/accept.css'
const AcceptIncident = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idIncidencia = urlParams.get('idIncidencia');
    const emailNuevoTecnico = urlParams.get('emailNuevoTecnico');

    const acceptRequest = () => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert('Incidencia aceptada correctamente');
                window.location.href = "/"; // Redirige al inicio o a la página que desees
            }
        };
        xhttp.open("PUT", "http://44.197.13.101:8080/incidencias/" + idIncidencia + "/aceptar-nuevo-tecnico?emailNuevoTecnico=" + encodeURIComponent(emailNuevoTecnico), true);
        xhttp.send();
    };

    return (
        <div className="form-container">
            <h1>ARID</h1>
            <p>¿Deseas aceptar la incidencia?</p>
            <button onClick={acceptRequest}>Aceptar</button>
        </div>
    );
};

export default AcceptIncident;
