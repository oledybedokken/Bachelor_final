import { Box, Container, Stack, Typography } from '@mui/material';
import React, { useContext, useState, useCallback, useEffect } from 'react'
import MapGL, { Layer, Source } from 'react-map-gl';
import {  GetWeatherData } from '../../../Apis/Queries';
import NewDrawer from '../../../Components/NewDrawer';
import { UserSettingsContext } from '../../../Context/UserSettingsContext'
import TimeControlPanel from '../../Ssb/Maps/TimeControlPanel';
import {useQuery } from 'react-query';
import BeatLoader from "react-spinners/BeatLoader";
import Elements from './Elements';
import { useTheme, alpha } from '@mui/material/styles';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './ClusterLayers';
import Error from '../../Error';
import mapboxgl from 'mapbox-gl';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
export const WeatherFillLayer = {
    id: 'fillLayer',
    type: 'fill',
    source: "thisWeatherData",
    paint: {
        'fill-color':
            [
                "interpolate",
                ["exponential", 1],
                ["get", "value"],
                -30,
                "hsla(300, 100%, 83%, 0.9215686274509803)",
                -20,
                "hsla(249, 63%, 25%, 0.9215686274509803)",
                -10,
                "hsla(214, 54%, 51%, 0.9215686274509803)",
                0,
                "hsla(163, 42%, 50%, 0.9215686274509803)",
                10,
                "hsla(74, 76%, 57%, 0.9215686274509803)",
                15,
                "hsla(36, 80%, 58%, 0.9215686274509803)",
                30,
                "hsla(337, 60%, 47%, 0.9215686274509803)"
            ]
        ,
        'fill-opacity': 0.7,
    }
};
export const adminLayer = {
    id:"SourceLayerLanduse",
    type:"line",
    'source-layer':'country_boundaries',
    source:'sourceLayer',
    paint: {
        'line-color': '#ffffff',
        'line-opacity': 0.6,
        'line-width': 1.5
      }
}

export const WeatherStrokeLayer={
    id: 'lineLayer',
    type: 'line',
    source: "thisWeatherData",
    layout: {
        'line-cap': "round"
      },
      paint: {
        'line-color': [
            "interpolate",
            ["exponential", 1],
            ["get", "value"],
            -30,
            "hsla(300, 100%, 100%, 0.9215686274509803)",
            -20,
            "hsla(249, 63%, 33%, 0.9215686274509803)",
            -10,
            "hsla(220, 63%, 33%, 0.9215686274509803)",
            -5,
            "hsla(214, 54%, 66%, 0.9215686274509803)",
            0,
            "hsla(163, 42%, 65%, 0.9215686274509803)",
            10,
            "hsla(74, 76%, 74%, 0.9215686274509803)",
            20,
            "hsla(36, 80%, 75%, 0.9215686274509803)",
            30,
            "hsla(337, 60%, 61%, 0.9215686274509803)"
          ],
        'line-opacity': 0,
        'line-width': 0
      }
}
const MapDisplay = () => {
    const theme = useTheme();
    const { timeSettings, setTimeSettings, playSpeed, setPlaySpeed } = useContext(UserSettingsContext);
    //Fetching the data
    //unix time zone
    useEffect(() => {
        setTimeSettings("dropdown")
    }, [])
    const mapRef = React.useRef();
    const [viewport, setViewport] = React.useState({
        longitude: 12.1828,
        latitude: 65.5926,
        zoom: 4,
        bearing: 0,
        pitch: 0,
    });
    //Layer

    const [selectedTime, setSelectedTime] = useState([946681200])
    const [timeSeries, setTimeSeries] = useState([])
    const [selectedElement, setSelectedElement] = useState('mean(air_temperature P1M)');
    const [hoverInfo, setHoverInfo] = useState(null)
    //Interpolating
    const { data, isLoading, isFetching,isError,error } = useQuery(["weatherData", { selectedTime, selectedElement }], GetWeatherData,
        {
            retryDelay: 1000,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                if (data) {
                    setTimeSeries(data.data.timesData)
                }
            }
        });
    //OnClick function
    const onClick = (event) => {
        const feature = event.features[0];
        console.log(feature)
        if (feature.layer.id==="clusters") {
                const clusterId = feature && feature.properties.cluster_id;
                const mapboxSource = mapRef.current.getMap().getSource('weatherData');
                mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err) {
                        return;
                    }
                    setViewport({
                        ...viewport,
                        longitude: feature !== "undefined" && feature.geometry.coordinates[0],
                        latitude: feature !== "undefined" && feature.geometry.coordinates[1],
                        // eslint-disable-next-line no-restricted-globals
                        zoom: isNaN(zoom) ? 3 : zoom,
                        transitionDuration: 500
                    });
                });
        }
    };
    const onMouseEnter = useCallback(event => {
        if (event.features[0].layer.id === "unclustered-point") {
            console.log("happend")
            const {
                features,
                srcEvent: { offsetX, offsetY },
            } = event;
            const hoveredFeature = features && features[0];
            setHoverInfo(
                hoveredFeature
                    ? {
                        feature: hoveredFeature,
                        x: offsetX,
                        y: offsetY, 
                    }
                    : null
            );
        }
    })
    const onMouseLeave = useCallback(event => {
        if (hoverInfo) {
            setHoverInfo(null)
            const map = mapRef.current.getMap();
            map.setFeatureState({
                source: "weatherData",
                id: hoverInfo
            },
                { hover: false })
        }
    }
    );
    //Map settings
    function getCursor({ isHovering, isDragging }) {
        return isDragging ? "grabbing" : isHovering ? "pointer" : "default";
    }
    /* if (isFetching || isLoading) {
        return <p>Loading</p>
    } */
    if(isError){
        if(error.response.status===500){
            return <Error errorCode={500} />
            }
            if(error.response.status===400){
                return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><Typography>Missing Link! Please choose a id</Typography></Container>;
                }
    }
    return (<>
        <MapGL
            {...viewport}
            width="100%"
            height="100%"
            ref={mapRef}
            initialViewState={{
                longitude: 10.757933,
                latitude: 59.91149,
            }}
            getCursor={getCursor}
            clickRadius={2}
            /* onLoad={onMapLoad} */
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            interactiveLayerIds={clusterLayer&&[clusterLayer.id, unclusteredPointLayer.id]}
            onClick={onClick}
            /* onHover={onHover} */
            onViewportChange={setViewport}
            mapStyle="mapbox://styles/mapbox/dark-v9"
            mapboxApiAccessToken='pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg'
        >
            {(isLoading || isFetching) ?<>
            <Container sx={{width:"100%",display:"flex",justifyContent:"center"}}><BeatLoader/></Container>
            </>:<>
            
            <Source id="weatherData" type="geojson" cluster clusterMaxZoom={14} clusterRadius={50} data={data.data.sourceData} generateId={true}>
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer}/>
            </Source>
            <Source id="thisWeatherData" type="geojson" data={data.data.rasterResponse}>
                <Layer {...WeatherStrokeLayer}></Layer>
                <Layer {...WeatherFillLayer} beforeId="clusters"></Layer>
            </Source>
            </>
            }
            <Source url="mapbox://mapbox.country-boundaries-v1" type="vector" id="sourceLayer">
                <Layer {...adminLayer} beforeId="road-label-small"></Layer>
            </Source>
            {selectedElement &&
                <Elements selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
            }
            <Box sx={{ background: 'linear-gradient(0deg, rgba(149,137,211,1) 0%, rgba(150,209,216,1) 10%, rgba(95,143,197,1) 20%, rgba(80,140,62,1) 30%, rgba(121,146,28,1) 40%, rgba(223,177,6,1) 50%, rgba(243,150,6,1) 60%, rgba(236,95,21,1) 70%, rgba(190,65,18,1) 90%, rgba(138,43,10,1) 100%);', width: "35px", position: "absolute", right: 5, bottom: 25, zIndex: 9,height:"250px",display:"flex",justifyContent:"space-between",direction:"column" }}>
                <Stack justifyContent="space-between" alignItems="center">
                    <Typography variant='h5'>40</Typography>
                    <Typography variant='h5'>20</Typography>
                    <Typography variant='h5'>10</Typography>
                    <Typography variant='h5'>0</Typography>
                    <Typography variant='h5'>-10</Typography>
                    <Typography variant='h5'>-20</Typography>
                    <Typography variant='h5'>-30</Typography>
                </Stack>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", width: "5%" }}>
                <NewDrawer setTimeSettings={setTimeSettings} weather={true} timeSettings={timeSettings} max={10} min={1} setPlaySpeed={setPlaySpeed} playSpeed={playSpeed}></NewDrawer>
            </Box>
            {hoverInfo && (
                <Box
                    sx={{
                        p: 1,
                        zIndex: 99,
                        borderRadius: 1,
                        position: 'absolute',
                        pointerEvents: 'none',
                        color: 'common.white',
                        backgroundColor: alpha(theme.palette.grey[900], 0.8),
                    }}
                    style={{ left: hoverInfo.x, top: hoverInfo.y }}
                >
                    <Typography component="div" variant="caption">
                        <strong>SourceName:</strong> {hoverInfo.feature.properties.name}
                    </Typography>
                    <Typography component="div" variant="caption">
                        <strong>{selectedElement}:</strong> {hoverInfo.feature.properties.value}
                    </Typography>
                </Box>
            )}
        </MapGL>
        {timeSeries.length > 0 &&
            <TimeControlPanel times={timeSeries} weather={true} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />}
    </>
    )
}

export default MapDisplay