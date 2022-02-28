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
        /* TestSortingData() */
      }
    };
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
              const data = await SourceFinder.get("/testWeatherData");
              console.log(data.data.data.plass)
              setData(data.data.data.plass)
              /* TestSortingData() */
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
    const GeoData = useMemo(() => {
      console.log(data && updatePercentiles(data, f => f.properties.weatherData[spesifiedTime]))
      return data && updatePercentiles(data, f => f.properties.weatherData[spesifiedTime]);
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

 /* const TestSortingData=()=>{
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
    } */