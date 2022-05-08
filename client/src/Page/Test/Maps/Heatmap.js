//Source: https://visgl.github.io/react-map-gl/examples/heatmap
import React, { useEffect } from 'react'
import MapGL, { Source, Layer } from 'react-map-gl';
import { useContext, useState, useMemo } from 'react';
import { ScaleControl } from 'react-map-gl';
import { Alert, Box, Card, FormControl, IconButton, InputLabel, MenuItem, Select, Slider, Switch, Typography } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import { SsbContext } from '../../../Context/SsbContext'
import MapControlFullscreen from './MapTools/MakeWindowBig';
import TimeControlPanel from './TimeControlPanel';
import NewDrawer from '../../../Components/NewDrawer';
//this is to prevent bug when going live on netlify
// eslint-disable-next-line
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
const MAX_ZOOM_LEVEL = 9;

const Heatmap = ({ geoJson, colorMode, timeSettings, playSpeed, setTimeSettings, max, min, setPlaySpeed }) => {
    const { sorting, options,fullScreen } = useContext(SsbContext);
    const [allDays, setAllDays] = useState(true)
    const [selectedTime, setSelectedTime] = useState(0);
    //Layers and map views
    const [maxValue, setMaxValue] = useState(0)
    const [viewport, setViewport] = useState({
        longitude: 10.757933,
        latitude: 59.91149,
        zoom: 5,
        bearing: 0,
        pitch: 0,
    });
    const heatmapLayer = {
        MAX_ZOOM_LEVEL: 9,
        type: 'heatmap',
        paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'value'], 0, 0, maxValue, 1],
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
            'heatmap-color': [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(0, 0, 255, 0)",
                0.1,
                "royalblue",
                0.3,
                "cyan",
                0.5,
                "lime",
                0.7,
                "yellow",
                1,
                "red"
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 15],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
        }
    };
    //Map data
    function filterHeatMap(valuesArray) {
        let sortedArray = []
        if (sorting.options.length > 0) {
            const Sorting = Object.values(sorting.options[sorting.id]);
            sortedArray = valuesArray.features.map((element) => {
                const value = element.properties.verdier.filter(e => e.filters.every(filter => Sorting.includes(filter)))[0]
                return { ...element, properties: { ...element.properties, verdier: value } }
            })
        }
        else {
            sortedArray = geoJson.features.filter(e => e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label])
        }
        const output = sortedArray.flatMap(({ geometry, properties }) =>
            Object.entries(properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label]).map(([year, saleCount]) => ({
                geometry,
                properties: {
                    Region: properties.Region,
                    value: saleCount,
                    time: year,
                }
            }))
        );
        var maxA = output.reduce((a, b) => a.properties.value > b.properties.value ? a : b).properties.value;
        setMaxValue(maxA * 0.9)
        const newgeoJson = {
            "type": "FeatureCollection",
            "features": output
        }
        return newgeoJson
    }
    const data = useMemo(
        () => (allDays ? filterHeatMap(geoJson) : filterByTime(geoJson)),
        [geoJson, allDays, selectedTime, sorting]
    );
    function filterByTime() {
        const featuresReadable = filterHeatMap(geoJson);
        const features = featuresReadable.features.filter((e) => e.properties.time === options.times[selectedTime]);
        return { type: "FeatureCollection", features }
    }
    //Time controllers

    return (
        <>
            <MapGL {...viewport} width="100%" height="100%" onViewportChange={setViewport} mapboxApiAccessToken="pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg" mapStyle={colorMode.mode === "dark" ? "mapbox://styles/mapbox/dark-v10?optimize=true" : "mapbox://styles/mapbox/light-v10?optimize=true"}>
                {fullScreen ?
                    <Box sx={{ display: "flex", flexDirection: "column", width: "5%" }}>
                        <NewDrawer setTimeSettings={setTimeSettings} timeSettings={timeSettings} max={max} min={min} setPlaySpeed={setPlaySpeed} playSpeed={playSpeed}></NewDrawer>
                    </Box> : <MapControlFullscreen />}
                {data && (
                    <Source type="geojson" data={data}>
                        <Layer {...heatmapLayer} />
                    </Source>
                )}
                <Box sx={{ zIndex: 99, position: "absolute", bottom: 20, left: "50%" }}>
                    <ScaleControl />
                </Box>
            </MapGL>
            <TimeControlPanel timeSettings={timeSettings} allDays={allDays} playSpeed={playSpeed} setAllDays={setAllDays} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        </>
    )
}

export default Heatmap