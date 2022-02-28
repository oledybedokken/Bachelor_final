import React, { useEffect, useState,useMemo,useCallback } from 'react'
import { Typography,Container,Box,Slider } from '@mui/material'
import SourceFinder from '../../Apis/SourceFinder'
import MapGL, { Source, Layer } from 'react-map-gl';
import {scaleQuantile} from 'd3-scale';
import {range} from 'd3-array';
import { InntektLayer } from './InntektLayer';
const Inntekt = () => {
    const [allData,setAllData] = useState(null)
    const [aar,setAar] = useState(2005)
    const [min,setMin] = useState(2005)
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
      const onHover = useCallback(event => {
        const {
          features,
          srcEvent: {offsetX, offsetY}
        } = event;
        const hoveredFeature = features && features[0];
        setHoverInfo(
          hoveredFeature
            ? {
                feature: hoveredFeature,
                x: offsetX,
                y: offsetY
              }
            : null
        );
      }, []);
    useEffect(() => {
        const fetchData = async ()=>{
            try{
              const data = await SourceFinder.get("/incomejson");
              setAllData(data.data.data)
              /* TestSortingData() */
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
console.log(hoverInfo)
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
    <div>index</div>
    <Box sx={{width:"80%",height:"500px",pl:5}}>
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
    {hoverInfo&&
    <Typography>{hoverInfo.feature.properties.kommunenummer}</Typography>
}
    <MapGL
        {...viewport}
        width="100%"
        height="100%"
        initialViewState={{
            longitude: 10.757933,
            latitude: 59.91149,
        }}
        onHover={onHover}
        interactiveLayerIds={['data']}
        onViewportChange={setViewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken='pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg'
        >{allData &&(
            <Source type='geojson' data={data}>
                <Layer {...InntektLayer}/>
            </Source>
        )}
        {hoverInfo && (
          <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <div>State: {hoverInfo.feature.properties.kommunenummer}</div>
            <div>Median Household Income: {hoverInfo.feature.properties.value}</div>
            <div>Percentile: {(hoverInfo.feature.properties.percentile / 8) * 100}</div>
          </div>
        )}</MapGL>
        </Box>
    </>
  )
}

export default Inntekt