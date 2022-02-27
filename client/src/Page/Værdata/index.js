import React, { useEffect, useState } from 'react'
import { Typography,Container } from '@mui/material'
import SourceFinder from '../../Apis/SourceFinder'
import MapView from '../Værdata/MapView'
const VaerData = () => {
    const [loading,setLoading]=useState(true)
    const[data,setData]=useState(null)
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
              const data = await SourceFinder.get("/testWeatherData");
              setData(data.data.data.plass)
            } catch(err){
              console.log(err)
            }
          }
          if(data === null){
            fetchData()
          }
         setLoading(false)
    },[]);
    if(loading){
        return(<p>Loading...</p>)
    }
  return (
    <>
    <Container maxWidth="">
        <Typography align='center'>Velkommen til vårt vært map</Typography>
        {data&&
        data.features.map((data)=>{
            console.log(data)
            return(<p>{data.geometry.coordinates[0]}</p>)
        })}
            <MapView></MapView>
    </Container>
    </>
  )
}

export default VaerData