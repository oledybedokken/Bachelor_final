import React, { useContext, useState } from 'react';
import { Button,Slider,Box, Typography,Container } from '@mui/material';
import { useEffect } from 'react';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from "../../context/SourceContext";
import TableForFylke from './TableForFylke';
import MapView from './MapView';
import Chart from './Chart';



const Test2 = () => {
  const {sources,setSources}= useContext(SourceContext)
  const [kommuner,setKommuner]= useState(null);
  const [loading,setLoading] = useState(true)
  const [valgteSources,setValgteSources] = useState(null)
  const [spesifiedTime,setSpesifiedTime] = useState([1549697922])
  const currentTime = Math.floor(Date.now() / 1000);
  const[inntektData,setInntektData] = useState(null)
  const [min,setMin] = useState(null)
  useEffect(() => {
    const fetchData = async ()=>{
      try{
        const sources = await SourceFinder.get("/sources");
        const fylker = await SourceFinder.get("/kommuner");
        setKommuner(kommuner.data.data.kommuner)
        setSources(sources.data.data.plass)
      } catch(err){
        console.log(err)
      }
    }
    if(sources === null){
      fetchData()
    }
   setLoading(false)
}, []);
  return (
    <div>Test2</div>
  )
}

export default Test2