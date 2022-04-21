import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  Container,
  Box,
  Typography,
} from "@mui/material";
import { ColorModeContext } from '../../context/ColorModeContext';
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

const SsbVisualization = ({ geoJson, sorting, options }) => {
  const colorMode = useContext(ColorModeContext)
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
    console.log("skjedde")
    const geoJsonBrukBar = {
      "type": "FeatureCollection",
      "features": geoJson.features.filter((item)=>item.properties.Grunnskolenivå)
    }
    return (
      geoJsonBrukBar &&
      updatePercentiles(
        geoJsonBrukBar,
        (f) => f.properties["Grunnskolenivå"]["Menn"][options.ContentsCodes[0].label][options.times[aarId]]
      ) 
    );
  }, [aarId]);

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
              geoJson={geoJson}
              DrawerInnhold={DrawerInnhold}
              valgteSteder={valgteSteder}
              setValgteSteder={setValgteSteder}
              changeSideBarStatus={changeSideBarStatus}
              sorting={sorting}
              options={options}
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
