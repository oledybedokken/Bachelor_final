import React, { useContext, useState } from 'react';
import { Button,Slider,Box, Typography,Container } from '@mui/material';
import { useEffect } from 'react';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from "../../context/SourceContext";
import TableForKommune from './TableForKommune';
import MapView from './MapView';
import Chart from './Chart';



const Test2 = () => {
  const {inntekt,setInntekt}= useContext(SourceContext)
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
        const inntekt = await SourceFinder.get("/inntekt");
        const kommuner = await SourceFinder.get("/kommuner");
        setKommuner(kommuner.data.data.kommuner)
        setInntekt(inntekt.data.data.plass)
      } catch(err){
        console.log(err)
      }
    }
    if(inntekt === null){
      fetchData()
    }
   setLoading(false)
}, []);
  return (
    <div>Test2</div>
  )
}

export default Test2