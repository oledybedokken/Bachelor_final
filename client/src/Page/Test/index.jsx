import React, { useContext } from 'react';
import { SourceContext } from "../../context/SourceContext";
const Test = () => {
  const {sources,setSources}= useContext(SourceContext)
  //Målet er å hente inn alle P1D for en spesifik dag
  //Trenger alle sources || DONE
  
  //Trenger alle tilgjenglig den dagen
  //Trenger dag picker
  return <div></div>;
};

export default Test;
