import { LineChart, Line } from 'recharts';
import { useContext, useEffect,useState,useRef } from 'react';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
import axios from 'axios';
const RenderLineChart = () => {
  const [Loading,setLoading] = useState(true)
  const [cities,setCities] = useState(null)
  /* const { cities, setCities } = useContext(SourceContext); */
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await SourceFinder.get("/getdata");
        setCities(response.data.data.cities);
      } catch (error) {}
    };
    fetchData()
    setLoading(false)
  }, []);
  if(Loading){
    return <h1>Hello world</h1>
  }
  return(
    <div>
    {cities&&
     <>
     <div className='d-flex'><h1>By:</h1><h1>{cities.location.name}</h1></div>
     <div className="d-flex"><h1>Sist oppdatert:</h1><h1> {cities.current.last_updated}</h1></div>
     </> }
    {/* <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart> */} 
    </div>
  )
};

export default RenderLineChart