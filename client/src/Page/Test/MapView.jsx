import React from 'react'
import MapGL, { Source, Layer } from 'react-map-gl';
const MapView = ({data}) => {
    return (<>
        <MapGL
        width="100%"
        height="100%"
        initialViewState={{
            longitude: 10.757933,
            latitude: 59.91149,
            zoom: 3,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken='pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg'
        ></MapGL>
    </>
    )
}

export default MapView