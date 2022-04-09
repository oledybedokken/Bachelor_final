import React, { useEffect, useState, useMemo } from "react";
import { Container, Box, Typography } from "@mui/material";
import { scaleQuantile } from "d3-scale";
import { range } from "d3-array";
import Mapview from "./Mapview";
import SideBar from "./SideBar";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SortingDropDownMenu from "../../Components/SortingDropDownMenu";
const SsbVisualization = ({ geoJsonArray }) => {
  const [aar, setAar] = useState(2018);
  const [min, setMin] = useState(2005);
  const [valgteSteder, setValgteSteder] = useState([]);
  const [sidebarStatus, setSideBarStatus] = useState(false);
  function changeSideBarStatus() {
    if (valgteSteder.length > 0) {
      setSideBarStatus(true);
    } else {
      setSideBarStatus(false);
    }
  }

  const aarPLay = (event, curraar) => {
    setTimeout(function () {
      curraar++;
      console.log(curraar);
    }, 1000);
  };

  useEffect(() => {
    changeSideBarStatus();
  }, [valgteSteder]);

  const filteredData = useMemo(() => {
    return (
      geoJsonArray &&
      updatePercentiles(
        geoJsonArray,
        (f) => f.properties["Inntekt etter skatt, median (kr)"][aar]
      )
    );
  }, [geoJsonArray, aar]);
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
            }}
          >
            <Typography align="center" color="#fff">
              ÅR: {aar}
            </Typography>
            {/*Slider her */}
            <ArrowCircleLeftIcon
              onClick={() => setAar(aar - 1)}
            ></ArrowCircleLeftIcon>
            <ArrowCircleRightIcon
              onClick={() => setAar(aar + 1)}
            ></ArrowCircleRightIcon>
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
