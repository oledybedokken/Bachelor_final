import { Button,Slider,Box, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from "../../context/SourceContext";
import TableForFylke from './TableForFylke';
const Test = () => {
  const {sources,setSources}= useContext(SourceContext)
  const [fylker,setFylker]= useState(null);
  const [loading,setLoading] = useState(true)
  const [valgteSources,setValgteSources] = useState(null)
  const [spesifiedTime,setSpesifiedTime] = useState([1549697922])
  const currentTime = Math.floor(Date.now() / 1000);
  const[weatherData,setWeatherData] = useState(null)
  const [min,setMin] = useState(null)
  //Velge 10 sources
    //import the sources || DONE
    //Gjøre slik at man kan velge max antall sources || DONE
  //
  const handleTimeChange = (event, newValue) => {
    setSpesifiedTime(newValue);
  };
  function unixTimeToFrostTime(time){
    var a = new Date(time * 1000);
  var year = a.getFullYear();
  var month = (a.getMonth()+1).toString().padStart(2,"0");
  var date = a.getDate().toString().padStart(2, "0");
  var time = year + '-' + month + '-' + date;
  return time;
  }
  function timeNow(){
    return unixTimeToFrostTime(spesifiedTime)
  }
  useEffect(() => {
      const fetchData = async ()=>{
        try{
          const sources = await SourceFinder.get("/sources");
          const fylker = await SourceFinder.get("/fylker");
          setFylker(fylker.data.data.fylker)
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
  function FilterAndSort(filterBy){
    return (sources.features.filter((source)=>source.properties.county.toLowerCase() === filterBy.toLowerCase()))
}
async function GetData(){
  const inpWeatherData = await SourceFinder.get("/weatherdata");
  setWeatherData(inpWeatherData.data.data.value.data)
  console.log(inpWeatherData.data.data.value.data)
  setMin(Math.floor(new Date(inpWeatherData.data.data.value.data[0].referenceTime).getTime()/1000))
}
if (loading){
  return <p>Loading..</p>
}
  return <div>
    {sources&&
    fylker.map((fylke)=><TableForFylke key={fylke.fylkesnavn} fylke = {fylke.fylkesnavn} valgteSources={valgteSources} setValgteSources={setValgteSources} fylkeListe={FilterAndSort(fylke.fylkesnavn)}/>)
    }
    <Box sx={{ justifyContent:"center",display:"flex"}}>
    <Slider
      getAriaLabel={() => 'Date range'}
      value={spesifiedTime}
      onChange={handleTimeChange}
      valueLabelDisplay="auto"
      step={43200}
      sx={{width:"500px"}}
      max={currentTime}
      min={min}
    />
    <Typography>{timeNow()}</Typography>
    </Box>
    {valgteSources&&<><h1>{valgteSources.length}</h1><Button onClick={GetData}>Hent data</Button></>}
    {weatherData&&weatherData.map((data)=><>{(((data.referenceTime.split("T")[0])===unixTimeToFrostTime(spesifiedTime)))&&<><p>Mean Temp:{data.observations[0].value}</p><p>dato:{data.referenceTime}</p></>}</>)}
  </div>;
};

export default Test;