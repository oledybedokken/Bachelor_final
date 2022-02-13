import { Button,Slider,Box } from '@mui/material';
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
  var month = a.getMonth();
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = year + '-' + month + '-' + date;
  return time;
    
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
      min={1581525852}
    />
    </Box>
    {valgteSources&&<><h1>{valgteSources.length}</h1><Button onClick={GetData}>Hent data</Button></>}
    {weatherData&&weatherData.map((data)=><>{(((data.referenceTime.split("T")[0])===unixTimeToFrostTime(spesifiedTime)))&&<><p>Mean Temp:{data.observations[0].value}</p><p>dato:{data.referenceTime}</p></>}</>)}
  </div>;
};

export default Test;
