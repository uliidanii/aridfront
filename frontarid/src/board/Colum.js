import React from 'react';
import { useDrop } from 'react-dnd';
import Card from './Card';
import '../assets/css/columnas.css'

const Column = ({ title, incidencias, onDrop, handleShowChatModal,handleShowChatMD,userRole,correoTecnico }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item) => {
      onDrop(item.incidencia);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));


  return (
    <div className='fondo'
    ref={drop}
    style={{
      justifyContent: 'space-between',
      marginTop:'20px',
      // minWidth: '400px',
      // minHeight: '200px',
      minWidth:'20%',
      minHeight:'20%',
      padding: '16px',
      backgroundColor: isOver ? '#CCE4FA' : '#CCE4FA',
      borderRadius: '10px',
      border: '1px solid #ccc',
      boxShadow: '5px 2px 4px rgba(0, 0, 0, 0.2)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // mostrar una columna de 300px mínimo
      gridGap: '16px',
    }}
  >
      <h3 style={{color:'#fff'}}>{title}</h3>
      {incidencias.map((incidencia, index) => (
       <Card
       key={index}
       incidencia={incidencia}
       index={index}
       handleShowChatModal={handleShowChatModal}
       handleShowChatMD={handleShowChatMD}
       userRole={userRole}
       correoTecnico={correoTecnico}
     />
   
      ))}
    </div>
  );
};

export default Column;
