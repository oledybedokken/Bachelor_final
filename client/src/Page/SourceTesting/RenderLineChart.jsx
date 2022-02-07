import { LineChart, Line } from 'recharts';
import { useContext, useEffect } from 'react';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
import axios from 'axios';


const data = [1,2,5]
/*
const data = [axios.get().then(data) => {
  console.log(data)
}];
*/
/*
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
*/



const RenderLineChart = () => {

  
  /*  
  const {sources, setSources} = useContext(SourceContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch("https://frost.met.no/observations/v0.jsonld?sources=SN99762&referencetime=2016-11-22%2F2019-06-02&elements=mean(air_temperature%20P1D)", {
          method:"get",
          body: JSON.stringify(),
          headers:{ Authorization: 'Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==' }
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
      } catch (error) {}
    };
    fetchData();
  }, []);
  */

  return(
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  )
}

export default RenderLineChart;