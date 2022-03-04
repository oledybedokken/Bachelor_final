import React, { useEffect, useState,useMemo } from 'react'
import { Typography,Container,Box,Slider } from '@mui/material'
import SourceFinder from '../../Apis/SourceFinder'
import MapView from '../Værdata/MapView'
const VaerData = () => {
    const [loading,setLoading]=useState(true)
    const[spesifiedTime,setSpesifiedTime] = useState([1577836800]);
    const[data,setData]=useState(null);
    const [min,setMin]= useState(1577836800)
    const currentTime = Math.floor(Date.now() / 1000);
    const handleTimeChange = (event, newValue) => {
      setTimeout(5000)
      if(newValue!==spesifiedTime){
        setSpesifiedTime(newValue);
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

    function sortFunction(featureCollection,accessor){
      const {features} = featureCollection;
      const returnValue = {
        type: 'FeatureCollection',
        features: features.map(f => {
          const value = accessor(f);
          if(typeof value !== 'undefined'){
          const properties = {
            ...f.properties,
            value,
          };
          return {...f, properties};
        }
        else{
          const value = 0;
          const properties = {
            ...f.properties,
            value,
          };
          return {...f, properties};
        }
        })
      };
      return returnValue
    }

    const GeoData = useMemo(() => {
      return data && sortFunction(data, f => f.properties.weatherData[spesifiedTime[0].toString()]);
    }, [data, spesifiedTime[0].toString()]);
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
        {GeoData&&
        <Box sx={{width:"80%",height:"500px",ml:15}}>
            <MapView data={GeoData}></MapView>
        </Box>}
    </Container>
    </>
  )
}

export default VaerData