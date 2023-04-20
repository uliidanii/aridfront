import React from 'react';
import { useDrop } from 'react-dnd';
import Card from './Card';

const Column = ({ title, incidencias, onDrop, handleShowChatModal,handleShowChatMD,userRole }) => {
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
    <div
      ref={drop}
      style={{
        marginTop:'20px',
        minWidth: '300px',
        minHeight: '200px',
        padding: '16px',
        backgroundColor: isOver ? '#CCE4FA' : '#CCE4FA',
        borderRadius: '4px',
        border: '1px solid #ccc',
      }}
    >
      <h3>{title}</h3>
      {incidencias.map((incidencia, index) => (
       <Card
       key={index}
       incidencia={incidencia}
       index={index}
       handleShowChatModal={handleShowChatModal}
       handleShowChatMD={handleShowChatMD}
       userRole={userRole}
     />
   
      ))}
    </div>
  );
};

export default Column;
