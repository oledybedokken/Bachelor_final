
import { useContext, useEffect, useState, useRef } from 'react';
import {CartesianGrid,XAxis,YAxis,Tooltip,Legend,Line,LineChart} from 'recharts'
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
import axios from 'axios';
import SourceTable from './SourceTable';
import { Container } from '@mui/material';
const RenderLineChart = ({data}) => {
  const [Loading, setLoading] = useState(true)
  const { cities, setCities } = useContext(SourceContext);
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await SourceFinder.get("/getdata");
        setCities(response.data.data.cities);
      } catch (error) { }
    };
    fetchData()
    setLoading(false)
  }, []);
  if (Loading) {
    return <h1>Loading...</h1>
  }
  return (
    <div>
      {cities &&
        <Container>
          <LineChart width={300} height={200} data={cities.list}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="dt"/>
            <YAxis dataKey="main.temp"/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="main.temp" stroke="#8884d8" />
            <Line type="monotone" dataKey="wind.speed" stroke="#1976d2" />
          </LineChart>
          {/* <SourceTable rows={cities} />
           */}
        </Container>
      }
    </div>
  )
};

export default RenderLineChart