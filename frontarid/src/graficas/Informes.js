import React, { useState } from 'react';
import NavbarA from '../Navbars/NavbarA';
import { Mapa } from '../graficas/Mapa';
import { InformeDocencias } from '../graficas/InformeDocencias';
import { InformeDocentes } from '../graficas/InformeDocentes';
import {InformeDivisionAcademica }from '../graficas/InformeDivisionAcademica';
import { useLocation } from 'react-router-dom';
import img from '../assets/img/ut.png'

export const Informes = () => {
    const [showUserModal, setShowUserModal] = useState(false);
    const [showAulaLabModal, setShowAulaLabModal] = useState(false);
    const handleShowUserModal = () => setShowUserModal(true);
    const handleCloseUserModal = () => setShowUserModal(false);
    const handleShowAulaLabModal = () => setShowAulaLabModal(true);
    const handleCloseAulaLabModal = () => setShowAulaLabModal(false);
    const location = useLocation();
    const user = location.state ? location.state.user : { email: '', roles: '' };
    
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [filtroSelected, setFiltroSelected] = useState(1);
    const [botonDocencia, setBotonDocencia] = useState(true)
    const [botonDocente, setBotonDocente] = useState(false)
    const [botonDivision, setBotonDivision] = useState(false)

    const filtro1 = () => {
        setBotonDocencia(true)
        setBotonDivision(false)
        setBotonDocente(false)
        setFiltroSelected(1)
    }

    const filtro2 = () => {
        setBotonDocencia(false)
        setBotonDivision(false)
        setBotonDocente(true)
        setFiltroSelected(2)
    }

    const filtro3 = () => {
        setBotonDocencia(false)
        setBotonDivision(true)
        setBotonDocente(false)
        setFiltroSelected(3)
    }

    return (
        <div>
             <NavbarA user={user}
        handleShowUserModal={handleShowUserModal}
        handleShowAulaLabModal={handleShowAulaLabModal}
      />
            <div style={{ margin: 15, textAlign: "center", fontSize: 40, fontFamily: 'sans-serif', color: "#224e76" }}>
                Modulo Estadístico
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ width: "50%", marginTop: 55 }}>
                    <Mapa />
                </div>
                <div style={{ width: "50%" }}>
                    <div>
                        {/* BOTONES PARA LOS FILTROS (docencias,docentes,areas academicas) */}
                        <div style={{ textAlign: 'center' }}>
                        {botonDocencia?<button disabled onClick={filtro1} style={{borderColor:'black',borderWidth:'5px', borderRadius: 50, margin: 5, backgroundColor: "#00604B", color: "#fff", padding:8, paddingLeft:20,paddingRight:20}}>Docencias</button>:<button onClick={filtro1} style={{ borderRadius: 50, margin: 5, backgroundColor: "#049474", color: "#fff", padding:8, paddingLeft:20,paddingRight:20,borderColor:'transparent'}}>Docencias</button>}
                            {botonDocente?<button disabled onClick={filtro2} style={{borderColor:'black',borderWidth:'5px', borderRadius: 50, margin: 5, backgroundColor: "#152C42", color: "#fff", padding:8, paddingLeft:20,paddingRight:20}}>Docentes</button>:<button onClick={filtro2} style={{ borderRadius: 50, margin: 5, backgroundColor: "#224e76", color: "#fff", padding:8, paddingLeft:20,paddingRight:20,borderColor:'transparent'}}>Docentes</button>}
                            {botonDivision?<button disabled onClick={filtro3} style={{borderColor:'black',borderWidth:'5px', borderRadius: 50, margin: 5, backgroundColor: "#2A515B", color: "#fff", padding:8, paddingLeft:20,paddingRight:20}}>División acedemica</button>:<button onClick={filtro3} style={{ borderRadius: 50, margin: 5, backgroundColor: "#3c7c8c", color: "#fff", padding:8, paddingLeft:20,paddingRight:20,borderColor:'transparent'}}>División acedemica</button>}
                        <div style={{ textAlign: 'center', marginBottom: 10 }}>
  {/* <input
    type="date"
    value={dateRange.startDate}
    onChange={(event) => setDateRange({ ...dateRange, startDate: event.target.value })}
  />
  <input
    type="date"
    value={dateRange.endDate}
    onChange={(event) => setDateRange({ ...dateRange, endDate: event.target.value })}
  /> */}
  {/* <button onClick={() => console.log(dateRange)}>Filtrar por fechas</button> */}
</div>

                        </div>
                        <div style={{height:"50%"}}>
                        {filtroSelected == 1 ? <InformeDocencias dateRange={dateRange} /> : ''}
                        {filtroSelected == 2 ? <InformeDocentes dateRange={dateRange} /> : ''}
                        {filtroSelected == 3 ? <InformeDivisionAcademica dateRange={dateRange} /> : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
