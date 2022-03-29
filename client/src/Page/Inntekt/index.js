import React, {
  useEffect,
  useState,
  useMemo,
} from "react";
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
import CloseIcon from '@mui/icons-material/Close';
import Chart from './Chart'
import SourceFinder from "../../Apis/SourceFinder";
import { scaleQuantile } from "d3-scale";
import { range } from "d3-array";
import Mapview from "./Mapview";
import SideBar from "./SideBar";
const Inntekt = () => {
  const [allData, setAllData] = useState(null);
  const [aar, setAar] = useState(2005);
  const [min, setMin] = useState(2005);
  const [valgteSteder,setValgteSteder] = useState([]);
  const [husholdningsType, setHusholdningsType] = useState("Alle husholdninger");
  const [loading, setLoading] = useState(true);
  const [sidebarStatus,setSideBarStatus]=useState(false)
  function changeSideBarStatus(){
    if(valgteSteder.length>0){
      setSideBarStatus(true)
      return true
    }
    else{
      setSideBarStatus(false)
      return false
    }
  }
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

  useEffect(()=>{
    changeSideBarStatus()
  },[valgteSteder]);

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [husholdningsType]);

  const data = useMemo(() => {

    return (
      allData && updatePercentiles(allData, (f) => f.properties.inntekt[aar])
    );
  }, [allData, aar]);
  const InntektSlider = () => (
    <Box sx={{ height: "75px", width: "250px", position: "absolute", bottom: 0, left: "40%" }}>
      <Typography align="center" color="#fff">ÅR: {aar}</Typography>
      <Slider
        getAriaLabel={() => "Date range"}
        value={aar}
        onChange={handleTimeChange}
        valueLabelDisplay="auto"
        step={1}
        sx={{ width: "200px", ml: "20px" }}
        max={2020}
        min={min}
        align="center"
      />
    </Box>
  )
  const DrawerInnhold = (anchor) => (
    <div style={{ paddingTop: "20px", display: "flex", justifyContent: "center" }}>
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
          <MenuItem value="Par med barn 0-17 år">Par med barn 0-17 år</MenuItem>
          <MenuItem value="Enslig mor/far med barn 0-17 år">Enslig mor/far med barn 0-17 år</MenuItem>
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
      {data && <>
        <Container sx={{ display: "flex" }} maxWidth="" disableGutters >
          <Box sx={{ width: sidebarStatus ? "50vw" : "100vw", height: "100vh", display: "flex" }}>
            <Mapview data={data} InntektSlider={InntektSlider} DrawerInnhold={DrawerInnhold} valgteSteder={valgteSteder} setValgteSteder={setValgteSteder} changeSideBarStatus={changeSideBarStatus}></Mapview>
            {/* <Chart data = {data}></Chart> */}
          </Box>
          {sidebarStatus &&
            <SideBar setSideBarStatus={setSideBarStatus} valgteSteder={valgteSteder} setValgteSteder={setValgteSteder} sidebarStatus={sidebarStatus}/>
          }
        </Container>
      </>
      }
    </>
  );
};

export default Inntekt;
