import React, { useEffect, useState,useMemo } from 'react'
import { Typography,Container,Box,Slider } from '@mui/material'
import SourceFinder from '../../Apis/SourceFinder'
import MapGL, { Source, Layer } from 'react-map-gl';
import {scaleQuantile} from 'd3-scale';
import {range} from 'd3-array';
import { InntektMapLayer } from '../Test2/InntektMapLayer';
const Inntekt = () => {
    const [allData,setAllData] = useState(null)
    const [aar,setAar] = useState(2005)
    const [viewport, setViewport] = React.useState({
        longitude: 10.757933,
        latitude: 59.91149,
        zoom: 5,
        bearing: 0,
        pitch: 0,
      });
    useEffect(() => {
        /* global fetch */
        fetch(
          'http://localhost:3005/api/v1/incomejson'
        )
          .then(resp => resp.json())
          .then(json => setAllData(json.data.inntektGeoJson));
          
      }, []);
      console.log(allData)
      const data = useMemo(() => {
        return allData && updatePercentiles(allData, f => f.properties.inntekt[aar]);
      }, [allData, aar]);

      function updatePercentiles(featureCollection, accessor) {
        const {features} = featureCollection;
        const scale = scaleQuantile().domain(features.map(accessor)).range(range(9));
        return {
          type: 'FeatureCollection',
          features: features.map(f => {
              if(f.properties.inntekt){
            const value = accessor(f);
            const properties = {
              ...f.properties,
              value,
              percentile: scale(value)
            };
            return {...f, properties};
        }
          })
        };
      }
  return (
      <>
    <div>index</div>
    <Box sx={{width:"80%",height:"500px"}}>
    <MapGL
        {...viewport}
        width="100%"
        height="100%"
        initialViewState={{
            longitude: 10.757933,
            latitude: 59.91149,
        }}
        onViewportChange={setViewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken='pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg'
        >{allData &&(
            <Source type='geojson' data={allData}>
                <Layer {...InntektMapLayer}/>
            </Source>
        )}</MapGL>
        </Box>
    </>
  )
}

export default Inntekt