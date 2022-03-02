import React, { useEffect, useState,useMemo,useCallback } from 'react'
import { Typography,Container,Box,Slider,InputLabel,Select,MenuItem,FormControl } from '@mui/material'
import SourceFinder from '../../Apis/SourceFinder'
import MapGL, { Source, Layer,Popup } from 'react-map-gl';
import {scaleQuantile} from 'd3-scale';
import {range} from 'd3-array';
import { InntektLayer } from './InntektLayer';
const Inntekt = () => {
    const [allData,setAllData] = useState(null)
    const [aar,setAar] = useState(2005)
    const [min,setMin] = useState(2005)
    const [husholdningsType,setHusholdningsType] = useState("Alle husholdninger")
    const [loading,setLoading] = useState(true)
    const [hoverInfo, setHoverInfo] = useState(null);
    const [viewport, setViewport] = React.useState({
        longitude: 10.757933,
        latitude: 59.91149,
        zoom: 5,
      });
      const handleTimeChange = (event, newValue) => {
        setTimeout(500)
        if(newValue!==aar){
          setAar(newValue);
        }
      };
      const handleSelectChange = (event) => {
        setHusholdningsType(event.target.value);
      };
      const onHover = useCallback(event => {
        const {
          features
        } = event;
        const hoveredFeature = features && features[0];
        console.log(event.lngLat)
        setHoverInfo(
          hoveredFeature
            ? {
                feature: hoveredFeature,
                lat: event.lngLat[0],
                long: event.lngLat[1]
              }
            : null
        );
      }, []);
    useEffect(() => {
        const fetchData = async ()=>{
            try{
              const data = await SourceFinder.get("/incomejson");
              console.log(data)
              setAllData(data.data.data)
            } catch(err){
              console.log(err)
            }
          }
          if(data === null){
            fetchData()
          }
         setLoading(false)
        },[]);
      const data = useMemo(() => {
        return allData && updatePercentiles(allData, f => f.properties.inntekt[aar]);
      }, [allData, aar]);

      function updatePercentiles(featureCollection, accessor) {
        const {features} = featureCollection;
        const scale = scaleQuantile().domain(features.map(accessor)).range(range(9));
        return {
          type: 'FeatureCollection',
          features: features.map(f => {
            const value = accessor(f);
            const properties = {
              ...f.properties,
              value,
              percentile: scale(value)
            };
            return {...f, properties};
          })
        };
      }
    if (loading){
        return (<p>Loading...</p>)
    }
  return (
      <>
    <Box sx={{width:"80%",height:"500px",pl:5}}>
    <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Husholdningstype</InputLabel>
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
    <Slider
      getAriaLabel={() => 'Date range'}
      value={aar}
      onChange={handleTimeChange}
      valueLabelDisplay="auto"
      step={1}
      sx={{width:"500px"}}
      max={2019}
      min={min}
      align ="center"
    />
    <MapGL
        {...viewport}
        width="100%"
        height="100%"
        onHover={onHover}
        interactiveLayerIds={['data']}
        onViewportChange={setViewport}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxApiAccessToken='pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg'
        >
            <Source type='geojson' data={data}>
                <Layer {...InntektLayer}/>
            </Source>
        {hoverInfo && (
            <Popup
            longitude={hoverInfo.lat}
            latitude={hoverInfo.long}
            closeButton={false}
            anchor='bottom'
          >
            {<>
            <div style={{width:"150px"}}>
            <div><p>Kommunner:</p><p>{hoverInfo.feature.properties.kommunenummer}</p></div>
            <div><p>Inntekt:</p><p>{hoverInfo.feature.properties.value}</p></div>
            </div>
            </>}
          </Popup>
        )}
        </MapGL>
        </Box>
    </>
  )
}

export default Inntekt