import React, {
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import {
  Container,
  Box,
  Typography,
  Slider
} from "@mui/material";
import { scaleQuantile } from "d3-scale";
import { range } from "d3-array";
import Mapview from "./Mapview";
import SideBar from "./SideBar";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SortingDropDownMenu from "../../Components/SortingDropDownMenu";
import SsbContext from '../../context/SsbContext';
import { useParams } from "react-router-dom";
const SsbVisualization = ({geoJsonArray}) => {
  const { sorting, setSorting } = useContext(SsbContext);
  const [aar, setAar] = useState(parseInt(sorting.times[0]));
  const [min, setMin] = useState(parseInt(sorting.times[0]));
  const [valgteSteder,setValgteSteder] = useState([]);
  const [sidebarStatus,setSideBarStatus]=useState(false)
  const {id} = useParams()

  function changeSideBarStatus(){
    if(valgteSteder.length>0){
      setSideBarStatus(true)
    }
    else{
      setSideBarStatus(false)
    }
  }

  const aarPLay = (event, curraar) => {
    setTimeout(function () {
      curraar++;
      console.log(curraar);
    }, 1000);
  };
  const handleAarChange =(event,way)=>{
    console.log(way)
    console.log(aar)
    if(way==="next" ){
      if(aar===parseInt(sorting.times[sorting.times.length-1])){
        return
      }
      else{
        setAar(aar+1)
        return
      }
    }
    else{
      if(aar===sorting.times[0]){
        return
      }
      else{
        setAar(aar-1)
        return
      }
    }
  }
  useEffect(() => {
    changeSideBarStatus();
  }, [valgteSteder]);

  const filteredData = useMemo(() => {
    const testJsonArray = {type:"FeatureCollection",
      features:geoJsonArray.features.filter(obj => obj.properties.hasOwnProperty(sorting.ContentCode))}
      console.log(testJsonArray)
    return (
      testJsonArray &&
      updatePercentiles(
        testJsonArray,
        (f) => f.properties[sorting.ContentCode][aar]
      )
    );
  }, [geoJsonArray, aar,sorting.ContentCode]);
  const DrawerInnhold = (anchor) => (
    <div
      style={{ paddingTop: "20px", display: "flex", justifyContent: "center" }}
    >
      <SortingDropDownMenu fetched={true} />
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
  return (
    <>
      <Container sx={{ display: "flex" }} maxWidth="" disableGutters>
        <Box
          sx={{
            width: sidebarStatus ? "50vw" : "100vw",
            height: "100vh",
            display: "flex",
          }}
        >
          {filteredData && (
            <Mapview
              filteredData={filteredData}
              geoJsonArray={geoJsonArray}
              DrawerInnhold={DrawerInnhold}
              valgteSteder={valgteSteder}
              setValgteSteder={setValgteSteder}
              changeSideBarStatus={changeSideBarStatus}
            ></Mapview>
          )}{" "}
          <Box
            sx={{
              height: "75px",
              width: "250px",
              position: "absolute",
              bottom: 0,
              left: "40%",
              justifyContent:"center",
              display:"flex",
              flexDirection:"column",
              backgroundColor:"#000000"
            }}
          >
            <Typography align="center" color="#fff">
              ÅR: {aar}
            </Typography>
            {/*Slider her */}
            <Box sx={{display:"flex",justifyContent:"center"}}>
            <ArrowCircleLeftIcon
              onClick={(e) => handleAarChange(e,"back")}
              sx={{cursor:"pointer",color:"#fff"}}></ArrowCircleLeftIcon>
            <ArrowCircleRightIcon
              onClick={(e) => handleAarChange(e,"next")}
              sx={{cursor:"pointer",color:"#fff"}}></ArrowCircleRightIcon>
              </Box>
          </Box>
        </Box>
        {sidebarStatus && (
          <SideBar
            setSideBarStatus={setSideBarStatus}
            valgteSteder={valgteSteder}
            setValgteSteder={setValgteSteder}
            sidebarStatus={sidebarStatus}
          />
        )}
      </Container>
    </>
  );
};

export default SsbVisualization;

/*
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
*/

/*
const InntektSlider = () => {
    return(
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
  }

*/
