import React,{useCallback,useRef,useState,useMemo} from 'react'
import MapGL, { Source, Layer, Popup } from "react-map-gl";
import { InntektFill, InntektLine, InntektSymbol } from "./InntektLayer";
import {
    Box,
  } from "@mui/material";
import MyDrawer from '../../Components/MyDrawer';
import Palette from './Palette';
import { ColorModeContext } from '../../context/ColorModeContext';
const Mapview = ({filteredData,geoJsonArray,DrawerInnhold,InntektSlider,setValgteSteder,valgteSteder}) => {
    const mapRef = useRef(null);
    const colorMode = React.useContext(ColorModeContext);
    const [hoverInfo, setHoverInfo] = useState(null);
    const [viewport, setViewport] = React.useState({
        longitude: 10.757933,
        latitude: 59.91149,
        zoom: 5,
      });
      // onHover
      const onHover = useCallback((event) => {
        const { features } = event;
        const hoveredFeature = features && features[0];
        setHoverInfo(
          hoveredFeature
            ? {
                feature: hoveredFeature,
                lat: event.lngLat[0],
                long: event.lngLat[1],
              }
            : null
        );
      }, []);
    
      // onClick
      const onClick = useCallback((event) => {
        event.preventDefault()
        const { features } = event;
        const clickedFeature = features && features[0];
        if(clickedFeature){let valgtSted =geoJsonArray.features.filter(kommune =>clickedFeature.properties.RegionNumber === kommune.properties.RegionNumber); setValgteSteder([...valgteSteder, valgtSted[0].properties])}
      }, [valgteSteder]);
      console.log(colorMode)
  return (
    <>
    <Box sx={{width:"100%"}}>
    <MapGL
    {...viewport}
    width="100%"
    height="100%"
    onHover={onHover}
    onClick={onClick}
    ref={mapRef}
    interactiveLayerIds={["InntektFill"]}
    onViewportChange={setViewport}
    mapStyle={colorMode.mode==="dark"?"mapbox://styles/mapbox/dark-v10?optimize=true":"mapbox://styles/mapbox/light-v10?optimize=true"}
    mapboxApiAccessToken="pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg"
  >
    <Box sx={{display:"flex",flexDirection:"column",width:"5%"}}>
      <MyDrawer DrawerInnhold={DrawerInnhold}></MyDrawer>
      <Palette/>
      {/* <img src={Scale}></img> */}
    </Box>
    <Source type="geojson" data={filteredData} id="inntektData">
      <Layer {...InntektFill}></Layer>
      <Layer {...InntektLine}></Layer>
      <Layer {...InntektSymbol}></Layer>
    </Source>
    {hoverInfo && (
      <Popup
        longitude={hoverInfo.lat}
        latitude={hoverInfo.long}
        closeButton={false}
        anchor="bottom"
      >
        {
          <>
            <div style={{ width: "150px" }}>
              <div>
                <p>PostNr:</p>
                <p>{hoverInfo.feature.properties.Region}</p>
              </div>
              <div>
                <p>Inntekt:</p>
                <p>{hoverInfo.feature.properties.value}kr</p>
              </div>
            </div>
          </>
        }
      </Popup>
    )}
    {/* Experiment */}
  </MapGL>
  </Box>
  </>
  )
}

export default Mapview