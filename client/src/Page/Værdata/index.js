import React, { useEffect, useState } from 'react'
import { Typography,Container,Box,Slider } from '@mui/material'
import SourceFinder from '../../Apis/SourceFinder'
import MapView from '../Værdata/MapView'
const VaerData = () => {
    const [loading,setLoading]=useState(true)
    const[spesifiedTime,setSpesifiedTime] = useState([1549697922]);
    const[data,setData]=useState(null);
    const[geoJsonData, setGeoJsonData] = useState(null)
    const [min,setMin]= useState(1577836800)
    const currentTime = Math.floor(Date.now() / 1000);
    const handleTimeChange = (event, newValue) => {
      setTimeout(5000)
      if(newValue!==spesifiedTime){
        setSpesifiedTime(newValue);
        TestSortingData()
      }
    };
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
    const TestSortingData=()=>{
      const features = []
      data.features.map((source)=>{
        const test = Object.fromEntries(Object.entries(source.properties.weatherData).filter(([key]) =>key.includes(spesifiedTime)));
        if (Object.keys(test).length>0){
        const currentObject = {}
        Object.assign(source.properties,{temp:test[spesifiedTime]})
        const currentObject2 = Object.assign(currentObject,source)
        features.push(currentObject2)
        }
      })
      if(features.length>0){
      const newGeojson = {type: 'FeatureCollection',features:features}
      setGeoJsonData(newGeojson)
      console.log()
      }
    }
    if(loading){
        return(<p>Loading...</p>)
    }
  return (
    <>
    <Container maxWidth="">
        <Typography align='center'>Velkommen til vårt vært map</Typography>
        <Slider
      getAriaLabel={() => 'Date range'}
      value={spesifiedTime}
      onChange={handleTimeChange}
      valueLabelDisplay="auto"
      step={86400}
      timeout={5000}
      sx={{width:"500px"}}
      max={1578182400}
      min={min}
    />
        {data&&
        <Box sx={{width:"80%",height:"500px",ml:15}}>
            <MapView data={geoJsonData}></MapView>
        </Box>
        /* data.features.map((data)=>{
            console.log(data)
            return(<p>{data.geometry.coordinates[0]}</p>)
        }) */}
        
    </Container>
    </>
  )
}

export default VaerData