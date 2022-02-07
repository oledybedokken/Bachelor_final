import { LineChart, Line } from 'recharts';
import { useContext, useEffect } from 'react';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
import axios from 'axios';


const RenderLineChart = () => {
  const { cities, setCities } = useContext(SourceContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SourceFinder.get("/getdata");
        setCities(response.data);
        console.log(response.data)
      } catch (error) {}
    };
    fetchData();
    //if(sources === null){fetchData();}
  }, []);
  
  /*  
  const {sources, setSources} = useContext(SourceContext);
  useEffect(() => {
    const fetchData = async () => {
        fetch("https://frost.met.no/observations/v0.jsonld?sources=SN99762&referencetime=2016-11-22%2F2019-06-02&elements=mean(air_temperature%20P1D)", {
          method:"get",
          body: JSON.stringify(),
          headers:{ Authorization: 'Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==' }
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    };
    fetchData();
  }, []);
  */

  return(
    <div>
    <h1>Hello</h1>
    {cities}
    {/* <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart> */} 
    </div>
  )
}

export default RenderLineChart;