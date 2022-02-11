import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from "../../context/SourceContext";
import TableForFylke from './TableForFylke';
const Test = () => {
  const {sources,setSources}= useContext(SourceContext)
  const [fylker,setFylker]= useState(null);
  const [loading,setLoading] = useState(true)
  //Velge 10 sources
    //import the sources
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
if (loading){
  return <p>Loading..</p>
}
  return <div>
    {sources&&
    
    fylker.map((fylke)=><TableForFylke key={fylke.fylkesnavn} fylke = {fylke.fylkesnavn}fylkeListe={FilterAndSort(fylke.fylkesnavn)}/>)
    }
  </div>;
};

export default Test;
