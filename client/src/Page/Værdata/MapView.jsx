import React from 'react'
import MapGL, { Source, Layer } from 'react-map-gl';
import { WeatherLayer } from './MapLayer';
const MapView = ({data}) => {
  const [viewport, setViewport] = React.useState({
    longitude: 10.757933,
    latitude: 59.91149,
    zoom: 5,
    bearing: 0,
    pitch: 0,
  });

  return (
    
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
        >{data &&(
            <Source type='geojson' data={data}>
                <Layer {...WeatherLayer}/>
            </Source>
        )}</MapGL>
  )
}

export default MapView