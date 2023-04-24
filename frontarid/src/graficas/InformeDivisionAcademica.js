import React, { useState,useEffect } from 'react';
import { PieChart } from '../graficas/PieChart';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js'
import { DataAcademias } from '../graficas/Data';
import jsPDF from 'jspdf';
import * as XLSX from "xlsx";
import axios from 'axios';
import autoTable from 'jspdf-autotable'
import logo from '../assets/img/Logo-utez.png'
import moment from 'moment';
import Spinner from '../components/Spinner'
Chart.register(CategoryScale);


export const InformeDivisionAcademica = ({ dateRange }) => {

  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [descargandoExcel, setDescargandoExcel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [datosApi, setDatosApi] = useState([]);

  //GENERAR GRAFICA
  const [chartData, setChartData] = useState({
    labels: datosApi.map((data) => data.name),
    datasets: [
      {
        label: "Numero de incidencias",
        data: datosApi.map((data) => data.incidencias),
        backgroundColor: [
          "#08B731",
          "#08A6B7",
          "#271AD7",
          "#D01AD7",
          "#F38D26",
          "#F32626"
        ],
        borderColor: "black",
        borderWidth: 0.5
      }
    ]
  });

  //GENERAR ARCHIVO EXCEL
  const generateExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(datosApi);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Division academica");

    const tiempoTrascurrido = Date.now();
    const fecha = new Date(tiempoTrascurrido);
    const hoy = fecha.toDateString();
    XLSX.writeFile(wb, `Informe divisiones academicas - ${hoy}.xlsx`);
  }

  //GENERAR PDF
  const generatePDF = () => {
    const canvas = document.querySelector('canvas');
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    //imagen cabecera
    const imgWidth = 25;
    const imgHeight = 15;
    pdf.addImage(logo, 'PNG', 5, 5, imgWidth, imgHeight);
    //TITULO DEL DOCUMENTO
    pdf.setFontSize(20);
    pdf.text("Informe por division academica", pdf.internal.pageSize.width / 2, 20, { align: 'center' });
    //tabla
    const headers = [['División academica', 'Numero de incidencias']];
    const datos = datosApi.map(item => [item.name, item.incidencias]);
    pdf.autoTable({ head: headers, body: datos, margin: { top: 30 } });
    //imagen de la grafica
    const imgWidth2 = 100;
    const imgHeight2 = 75;
    const imgPosX = (pdf.internal.pageSize.width - imgWidth2) / 2;
    const imgPosY = pdf.autoTable.previous.finalY + 20;
    pdf.addImage(imgData, 'PNG', imgPosX, imgPosY, 120, 120);
    //crear pdf
    const tiempoTranscurrido = Date.now();
    const fecha = new Date(tiempoTranscurrido);
    const hoy = fecha.toDateString();
    pdf.save(`Informe divisiones academicas - ${hoy}.pdf`);
  }

  
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const queryParams = new URLSearchParams();
  
      if (dateRange.startDate) queryParams.append('startDate', moment(dateRange.startDate).format('YYYY-MM-DD'));
      if (dateRange.endDate) queryParams.append('endDate', moment(dateRange.endDate).format('YYYY-MM-DD'));
  
      const response = await axios.get('http://44.197.13.101:8080/incidencias/incidencias-por-division-academica', { params: queryParams });
      const data = Object.entries(response.data).map(([name, incidencias]) => ({ name, incidencias }));
      setDatosApi(data)
      setLoading(false)
      setChartData(prevState => ({
        ...prevState,
        labels: data.map(item => item.name),
        datasets: [{ ...prevState.datasets[0], data: data.map(item => item.incidencias) }]
      }));
    };
    fetchData();
  }, [dateRange]);
  return (
    <div>
      {loading?<Spinner/>:(
        <div>
          <h2 style={{ textAlign: "center" }}>Grafica de incidencia</h2>
        <h4 style={{ textAlign: "center" }}>División académica</h4>
        <PieChart chartData={chartData} />
        <div style={{ display: 'flex' }}>
          <div style={{ width: "50%", textAlign: "center" }}>
            <button disabled={descargandoPdf} onClick={generatePDF} style={{ margin: 30, backgroundColor: "#9F1D1D", color: "#fff", borderRadius: 20, padding: 8 }}>{descargandoPdf?'Descargando...':'Descargar PDF'}</button>
          </div>
          <div style={{ width: "50%", textAlign: 'center' }}>
            <button disabled={descargandoExcel} onClick={generateExcel} style={{ margin: 30, backgroundColor: "#269315", color: "#fff", borderRadius: 20, padding: 8 }}>{descargandoExcel?'Descargando...':'Descargar Excel'}</button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}