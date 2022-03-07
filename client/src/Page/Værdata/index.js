import React, { useEffect, useState } from 'react'
import { Typography, Container, Box, Slider, Select, InputLabel, MenuItem } from '@mui/material'
import SourceFinder from '../../Apis/SourceFinder'
import MapView from '../Værdata/MapView'
const VaerData = () => {
  const [loading, setLoading] = useState(true)
  const [spesifiedTime, setSpesifiedTime] = useState([1577836800]);
  const [data, setData] = useState(null);
  const [weatherType, setWeatherType] = useState("max(air_temperature P1D)")
  const [min, setMin] = useState(1577836800)
  const[sliderSteps,setSliderSteps] = useState(86400)
  const currentTime = Math.floor(Date.now()/1000);
  const elements = [{ value: "max(air_temperature P1D)", display: "Max temperatur" }, { value: "mean(air_temperature P1D)", display: "Gjennomsnitt temperatur" }]
  const DateHopOnSlider = [{ value:86400 , display:"Day"}, { value: 604800, display: "Week"},{value:2629743,display:"1 Month(30.44 days)"}]
  const handleTimeChange = (event, newValue) => {
    if (newValue[0] !== spesifiedTime[0]) {
      setSpesifiedTime(newValue);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await SourceFinder.get("/testWeatherData", {
          params: { dato: spesifiedTime, weatherType }
        });
        setData(data.data.data.plass)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [spesifiedTime,weatherType]);
  //Copied straight from https://stackoverflow.com/questions/12868176/how-do-i-convert-a-unix-timestamp-to-iso-8601-in-javascript
  const DateConverter =(input)=>{
    var s = new Date(input*1000).toISOString();
  return s.split("T")[0];
  }
  const fetchData = async () => {
    try {
      const data = await SourceFinder.get("/testWeatherData", {
        params: { dato: spesifiedTime, weatherType }
      });
      setData(data.data.data.plass)
    } catch (err) {
      console.log(err)
    }
  }
  //This will run the first time
  useEffect(() => {
    if (data === null) {
      fetchData()
    }
    setLoading(false)
  }, []);
  const setActiveType = (event) => {
    setWeatherType(event.target.value)
  }
  const setSliderType = (event) => {
    setSliderSteps(event.target.value)
  }
  if (loading) {
    return (<p>Loading...</p>)
  }
  return (
    <>
      <Container maxWidth="">
        <Typography align='center'>Velkommen til vårt vært map</Typography>
        <Container>
          <InputLabel id="demo-simple-select-label">Weather Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={weatherType}
            label="Weather Type"
            onChange={setActiveType}
            sx={{ mr: 5, mb: 5 }}
          >
            {elements && elements.map((element) => { return (<MenuItem key ={element.value} value={element.value}>{element.display}</MenuItem>) })}
          </Select>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sliderSteps}
            label="Slider hops"
            onChange={setSliderType}
            sx={{ mr: 5, mb: 5 }}
          >
            {DateHopOnSlider && DateHopOnSlider.map((element) => { return (<MenuItem key={element.value} value={element.value}>{element.display}</MenuItem>) })}
          </Select>
          <Slider
            getAriaLabel={() => 'Date range'}
            value={spesifiedTime}
            onChange={handleTimeChange}
            valueLabelDisplay="auto"
            step={sliderSteps}
            timeout={5000}
            sx={{width:"500px"}}
            max={currentTime}
            min={min}
          />
          <Typography>Start Dato:{DateConverter(min)}</Typography>
          <Typography>Slutt Dato:{DateConverter(currentTime)}</Typography>
          <Typography>Dato Valgt Nå:{DateConverter(spesifiedTime)}</Typography>
        </Container>
        {data &&
          <Box sx={{ width: "80%", height: "500px", ml: 15 }}>
            <MapView data={data}></MapView>
          </Box>}
      </Container>
    </>
  )
}

export default VaerData