import { LineChart, Line } from 'recharts';
import { useContext, useEffect,useState,useRef } from 'react';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
import axios from 'axios';
import SourceTable from './SourceTable';
import { Container } from '@mui/material';
const RenderLineChart = () => {
  const [Loading,setLoading] = useState(true)
  const [cities,setCities] = useState(null)
  /* const { cities, setCities } = useContext(SourceContext); */
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await SourceFinder.get("/getdata");
        console.log(response.data.data.cities)
        setCities(response.data.data.cities);
      } catch (error) {}
    };
    fetchData()
    setLoading(false)
  }, []);
  if(Loading){
    return <h1>Loading...</h1>
  }
  console.log(Loading)
  return(
    <div>
    {cities&&
    <Container>
    <SourceTable rows={cities}/></Container>
  }
    </div>
  )
};

export default RenderLineChart