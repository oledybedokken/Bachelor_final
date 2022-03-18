import React,{useCallback,useRef,useState} from 'react'
import MapGL, { Source, Layer, Popup } from "react-map-gl";
import MenuIcon from "@mui/icons-material/Menu";
import Scale from "../../Assets/inntektDelay.png";
import { InntektFill, InntektLine, InntektSymbol } from "./InntektLayer";
import {
    Box,
  } from "@mui/material";
import MyDrawer from '../../Components/MyDrawer';
const Mapview = ({data,DrawerInnhold,InntektSlider}) => {
    const mapRef = useRef(null);
    const [hoverInfo, setHoverInfo] = useState(null);
    const [viewport, setViewport] = React.useState({
        longitude: 10.757933,
        latitude: 59.91149,
        zoom: 5,
      });
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
  return (
    <>
    <MapGL
    {...viewport}
    width="100%"
    height="100%"
    onHover={onHover}
    ref={mapRef}
    interactiveLayerIds={["InntektFill"]}
    onViewportChange={setViewport}
    mapStyle="mapbox://styles/mapbox/dark-v10"
    mapboxApiAccessToken="pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg"
  >
    <Box sx={{display:"flex",flexDirection:"column",width:"5%"}}>
      <MyDrawer DrawerInnhold={DrawerInnhold}></MyDrawer>
      <img src={Scale}></img>
    </Box>
    <Box>
    </Box>
    <Source type="geojson" data={data} id="inntektData">
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
                <p>{hoverInfo.feature.properties.navn}</p>
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
  </MapGL>
  <InntektSlider></InntektSlider>
  </>
  )
}

export default Mapview