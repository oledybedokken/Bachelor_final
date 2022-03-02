import React, { useEffect, useState,useMemo } from 'react'
import { Typography,Container,Box,Slider } from '@mui/material'
import SourceFinder from '../../Apis/SourceFinder'
import MapView from '../Værdata/MapView'
import {range} from 'd3-array';
import {scaleQuantile} from 'd3-scale'
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
    function updatePercentiles(featureCollection, accessor) {
      const {features} = featureCollection;
      const scale = scaleQuantile()
        .domain(features.map(accessor))
        .range(range(9));
      return {
        type: 'FeatureCollection',
        features: features.map(f => {
          const value = accessor(f);
          const properties = {
            ...f.properties,
            value,
            percentile: scale(value)
          };
          return {...f, properties};
        })
      };
    }
    function sortFunction(featureCollection,accessor){
      const {features} = featureCollection;
      const returnValue = {
        type: 'FeatureCollection',
        features: features.map(f => {
          const value = accessor(f);
          console.log(value)
          const properties = {
            ...f.properties,
            value,
          };
          return {...f, properties};
        })
      };
      console.log(returnValue)
    }
    const GeoData = useMemo(() => {
      return data && sortFunction(data, f => f.properties.weatherData[spesifiedTime[0]]);
    }, [data, spesifiedTime]);
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