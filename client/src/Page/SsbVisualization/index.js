import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  Container,
  Box,
  Typography,
} from "@mui/material";
import mainpageBackground from "../../Assets/mainpageBackground.png";
import { scaleQuantile } from "d3-scale";
import { range } from "d3-array";
import Mapview from "./Mapview";
import SideBar from "./SideBar";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SortingDropDownMenu from "../../Components/SortingDropDownMenu";
import { useParams } from "react-router-dom";
//Stored values
import { SsbContext } from '../../Context/SsbContext';
const SsbVisualization = ({ geoJson}) => {
  const {sorting,options,customFilter} = useContext(SsbContext);
  const [aarId, setAarId] = useState(0)
  const [valgteSteder, setValgteSteder] = useState([]);
  const [sidebarStatus, setSideBarStatus] = useState(false)
  const { id } = useParams()
  function changeSideBarStatus() {
    if (valgteSteder.length > 0) {
      setSideBarStatus(true)
    }
    else {
      setSideBarStatus(false)
    }
  }
  const aarPLay = (event) => {
    setInterval(() => {
      setAarId(prevAarId => (prevAarId === options.times.length - 1 ? 0 : prevAarId + 1))
    }, 500);
  };
  const aarPause = (event) => {
    clearInterval(
      setAarId(0)
    );
  };
  const handleAarChange = (event, way) => {
    if (way === "next") {
      if (aarId === options.times.length - 1) {
        return
      }
      else {
        setAarId(aarId + 1)
        return
      }
    }
    else {
      if (aarId === 0) {
        return
      }
      else {
        setAarId(aarId - 1)
        return
      }
    }
  };
  useEffect(() => {
    changeSideBarStatus();
  }, [valgteSteder]);

  const filteredData = useMemo(() => {
    let sortedArray=[]
    if(sorting.options.length>0){
    const Sorting = Object.values(sorting.options[sorting.id]);
    sortedArray = geoJson.features.map((element) => {
    const value = element.properties.verdier.filter(e => e.filters.every(filter => Sorting.includes(filter)))[0]
      return {...element,properties:{...element.properties,verdier: value}}
    })}
    else{
      sortedArray=geoJson.features.filter(e=>e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[aarId]])
    }
    if(customFilter.showZero===true){
      sortedArray=sortedArray.filter(e=>e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[aarId]]!==0);
    }
    console.log("skjedde")
    const geoJsonBrukBar = {
      "type": "FeatureCollection",
      "features": sortedArray
    }
    return (
      geoJsonBrukBar &&
      updatePercentiles(geoJsonBrukBar,(f) => f.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[aarId]]));
  }, [aarId,sorting,customFilter]);

  const DrawerInnhold = (anchor) => (
    <div
      style={{ paddingTop: "20px", display: "flex", justifyContent: "center" }}>
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
              geoJson={geoJson}
              DrawerInnhold={DrawerInnhold}
              valgteSteder={valgteSteder}
              setValgteSteder={setValgteSteder}
              changeSideBarStatus={changeSideBarStatus}
              options={options}
              sorting={sorting}
            ></Mapview>
          )}{" "}
          <Box
            sx={{
              height: "75px",
              width: "250px",
              position: "absolute",
              bottom: 0,
              left: "40%",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#000000"
            }}
          >
            {options &&
              <Typography align="center" color="#fff">
                ÅR: {options.times[aarId]}
              </Typography>
            }
            {/*Slider her */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ArrowCircleLeftIcon
                onClick={(e) => handleAarChange(e, "back")}
                sx={{ cursor: "pointer", color: aarId !== 0 ? "#fff" : "#cc3300" }}></ArrowCircleLeftIcon>
              <PlayCircleIcon
                onClick={(e) => aarPLay(e)}
                sx={{ cursor: "pointer" }} ></PlayCircleIcon>
              <PauseCircleIcon
                onClick={(e) => aarPause(e)}
                sx={{ cursor: "pointer" }} ></PauseCircleIcon>
              <ArrowCircleRightIcon
                onClick={(e) => handleAarChange(e, "next")}
                sx={{ cursor: "pointer", color: aarId !== options.times.length - 1 ? "#fff" : "#cc3300" }}></ArrowCircleRightIcon>
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