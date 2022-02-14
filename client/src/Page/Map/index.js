import React, { useState,useEffect, useContext } from 'react';
import MapView from './MapView';
import { Box, Slider, Typography } from '@mui/material'
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from "../../context/SourceContext";
const Map = () => {
  const [loading,setLoading]= useState(true)
  const [dato, setDato] = useState([1549697922])
  const [testSources,setTestSources] = useState(null)
  const currentTime = Math.floor(Date.now() / 1000);
  function valuetext(value) {
    const date = new Date(value * 1000);
    return `${date.toLocaleDateString("en-US")}`;
  }
  const handleChange = (event, newValue) => {
    setDato(newValue);
  };
  const recordsAfterFiltering = () => {
    if(testSources.data!==undefined){
    const newArray= (testSources.data.filter((source)=>Math.floor(new Date(source.validFrom).getTime() / 1000)>dato[0]))
    setTestSources(newArray)
    return testSources.data.filter((source)=>source.validFrom==="2019-07-02T00:00:00.000Z")
    }
    return []
  };
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await SourceFinder.get("/getfrostdata");
        setTestSources(response.data.data.timeSeries);  
      } catch (error) { }
    };
    fetchData()
    setLoading(false)
  }, []);
  if(loading===true){
    return<h1>Loading...</h1>
  }
  return <div className='container'>Velg datoer:
  <Typography>Start Date:{valuetext(dato[0])}</Typography>
  <Typography>Slutt Date:{valuetext(dato[1])}</Typography>
  <Typography>Current Element:air_temperature</Typography>
  {testSources&&recordsAfterFiltering().map((source)=>{
    return(
      <Typography>{source.name}</Typography>
    )
  })}
    <Slider
      getAriaLabel={() => 'Date range'}
      value={dato}
      onChange={handleChange}
      valueLabelDisplay="auto"
      step={86400}
      max={currentTime}
      min={1518161922}
    /><Box sx={{ height: "500px", width: "90%" }}>
      <MapView /></Box></div>;
};

export default Map;
