import React from 'react'
import { MdDelete } from "react-icons/md";


function DeleteBtn({handleDelete}) {
  
  const btnstyle={
      padding:"4px",
      fontSize:"36px",
      color:"white",
      marginBottom:"6px",
      cursor:"pointer"      
    }

  return (
      <MdDelete onClick={handleDelete} style={btnstyle} /> 
  );
}

export default DeleteBtn