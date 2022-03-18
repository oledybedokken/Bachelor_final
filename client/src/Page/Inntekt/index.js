import React, {
  useEffect,
  useState,
  useMemo,
} from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";
import ApexCharts from "apexcharts";
import {
  Typography,
  Container,
  Box,
  Slider,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import SourceFinder from "../../Apis/SourceFinder";
import { scaleQuantile } from "d3-scale";
import { range } from "d3-array";
import Mapview from "./Mapview";
const Inntekt = () => {
  const [allData, setAllData] = useState(null);
  const [aar, setAar] = useState(2005);
  const [min, setMin] = useState(2005);
  const [husholdningsType, setHusholdningsType] =useState("Alle husholdninger");
  const [loading, setLoading] = useState(true);
  
  const handleTimeChange = (event, newValue) => {
    setTimeout(500);
    if (newValue !== aar) {
      setAar(newValue);
    }
  };
  const handleSelectChange = (event) => {
    setHusholdningsType(event.target.value)
  };
  const fetchData = async () => {
    try {
      const data = await SourceFinder.get("/incomejson", {
        params: { sorting: husholdningsType },
      });
      setAllData(data.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
      fetchData();
    setLoading(false);
  }, [husholdningsType]);
  const data = useMemo(() => {
    if (allData) {
      console.log(updatePercentiles(allData, (f) => f.properties.inntekt[aar]));
    }
    console.log("happend")
    return (
      allData && updatePercentiles(allData, (f) => f.properties.inntekt[aar])
    );
  }, [allData, aar]);
  const InntektSlider =()=>(
    <Box sx={{backgroundColor:"#fff",height:"75px",width:"250px",position: "absolute",top:"0",right:"0" }}>
      <Typography align="center">ÅR: {aar}</Typography>
    <Slider
          getAriaLabel={() => "Date range"}
          value={aar}
          onChange={handleTimeChange}
          valueLabelDisplay="auto"
          step={1}
          sx={{ width: "200px",ml:"20px"}}
          max={2019}
          min={min}
          align="center"
        />
   </Box>     
  )
  const DrawerInnhold = (anchor)=>(
    <div style={{paddingTop:"20px"}}>
      <FormControl>
          <InputLabel id="demo-simple-select-label">
            Husholdningstype
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={husholdningsType}
            label="Husholdningstype"
            onChange={handleSelectChange}
          >
            <MenuItem value="Alle husholdninger">Alle husholdninger</MenuItem>
            <MenuItem value="Aleneboende">Aleneboende</MenuItem>
            <MenuItem value="Par uten barn">Par uten barn</MenuItem>
          </Select>
        </FormControl>
        
    </div>
  );
  function updatePercentiles(featureCollection, accessor) {
    const { features } = featureCollection;
    const scale = scaleQuantile()
      .domain(features.map(accessor))
      .range(range(100));
    return {
      type: "FeatureCollection",
      features: features.map((f) => {
        const value = accessor(f);
        const properties = {
          ...f.properties,
          value,
          percentile: scale(value),
        };
        return { ...f, properties };
      }),
    };
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Box sx={{ width: "100vw", height: "100vh"}}>
       <Mapview data={data} InntektSlider={InntektSlider} DrawerInnhold={DrawerInnhold}></Mapview>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default Inntekt;
