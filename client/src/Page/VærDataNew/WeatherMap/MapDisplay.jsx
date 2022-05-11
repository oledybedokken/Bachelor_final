import { Box } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import MapGL, { Source, Layer } from 'react-map-gl';
import { GetWeatherData } from '../../../Apis/Queries';
import NewDrawer from '../../../Components/NewDrawer';
import { UserSettingsContext } from '../../../Context/UserSettingsContext'
import TimeControlPanel from '../../Ssb/Maps/TimeControlPanel';
import { useQuery } from 'react-query';
import BeatLoader from "react-spinners/BeatLoader";
import Elements from './Elements';
const interpolateHeatmapLayer = require('interpolateheatmaplayer');
const MapDisplay = () => {
    //Fetching the data
    //unix time zone
    const points = [{
        lat: 62.470663,
        lon: 6.176846,
        val: 16
    },
    {
        lat: 48.094903,
        lon: -1.371596,
        val: 30
    }];
    const [selectedTime, setSelectedTime] = useState([946681200])
    const [selectedElement, setSelectedElement] = useState('mean(air_temperature P1M)')
    const { timeSettings, playSpeed, setTimeSettings, setPlaySpeed } = useContext(UserSettingsContext);
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback(() => {
        const testLayer = interpolateHeatmapLayer.create({
            points: points,
            layerID: "testInterpolate",
            roi:[{lat:70.965744,lon:32.420481},{lat:57.732568,lon:10.935453},{lat:57.807822,lon:1.914863},{lat:71.675324,lon:21.686841}]
        })
        mapRef.current.getMap().addLayer(testLayer)
    }, []);
    const { data, isLoading, isFetching, isError, error } = useQuery(["weatherData", { selectedTime, selectedElement }], GetWeatherData,
        {
            retryDelay: 1000,
            refetchOnWindowFocus: false,
            onSuccess:()=>{
                console.log(data)
            }
        });
        console.log(data)
    const max = 10
    const min = 1
    const array = [1, 2, 3, 4]
    const [viewport, setViewport] = React.useState({
        longitude: 10.757933,
        latitude: 59.91149,
        zoom: 5,
        bearing: 0,
        pitch: 0,
    });
    const startingLatitude = -80;
    const startingLongitude = -180;
    const endingLatitude = 80;
    const endingLongitude = 180;
    if (isFetching || isLoading) {
        return <p>Loading</p>
    }

    return (
        <>
            <MapGL
                {...viewport}
                width="100%"
                height="100%"
                ref={mapRef}
                onLoad={onMapLoad}
                initialViewState={{
                    longitude: 10.757933,
                    latitude: 59.91149,
                }}
                onViewportChange={setViewport}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                mapboxApiAccessToken='pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg'
            >
                {isLoading || isFetching && <>
                    <BeatLoader />
                </>
                }
                <Elements setSelectedElement={setSelectedElement} />
                <Box sx={{ display: "flex", flexDirection: "column", width: "5%" }}>
                    <NewDrawer setTimeSettings={setTimeSettings} timeSettings={timeSettings} max={max} min={min} setPlaySpeed={setPlaySpeed} playSpeed={playSpeed}></NewDrawer>
                </Box>
            </MapGL>
            <TimeControlPanel times={array} /></>
    )
}

export default MapDisplay
/* {data && (
    <Source type='geojson' data={data}>
        <Layer {...WeatherLayer} />
    </Source>
)} */