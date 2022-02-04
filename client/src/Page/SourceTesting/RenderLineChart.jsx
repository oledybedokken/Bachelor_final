import { LineChart, Line } from 'recharts';
import { useContext, useEffect } from 'react';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
import axios from 'axios';

/* const data = [axios.get().then(data) => {
  console.log(data)
}]; */



const RenderLineChart = () => {
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

  return(
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  )
}

export default RenderLineChart;