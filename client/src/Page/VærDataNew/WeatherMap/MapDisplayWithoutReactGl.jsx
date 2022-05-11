import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg';

const interpolateHeatmapLayer = require('interpolateheatmaplayer');
const MapDisplayWithoutReactGl = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(62.470663);
    const [lat, setLat] = useState(62.470663);
    const [zoom, setZoom] = useState(4);
    const points = [{
        lat: 62.194663,
        lon: 9.742352,
        val: 5
    },
    {
        lat: 60.357866,
        lon: 5.344887,
        val: 20
    },
    {
        lat: 28.094903,
        lon: -1.371596,
        val: 10
    }];
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        map.current.on('load', () => {
            const layer = interpolateHeatmapLayer.create({
                points: points,
                layerID: 'temperature',
                roi:[{lat:70.965744,lon:32.420481},{lat:57.732568,lon:10.935453},{lat:57.807822,lon:1.914863},{lat:71.675324,lon:21.686841}]
            });
            map.current.addLayer(layer);
        });
    },[]);
    return (
        <div style={{ height: "100%", width: "100%" }} ref={mapContainer} className="map-container" />
    );
}

export default MapDisplayWithoutReactGl