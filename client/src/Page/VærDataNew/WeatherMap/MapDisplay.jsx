import { Box, Typography } from '@mui/material';
import React, { useContext, useState, useCallback, useMemo } from 'react'
import MapGL, { Layer, Popup, Source } from 'react-map-gl';
import { GetWeatherData } from '../../../Apis/Queries';
import NewDrawer from '../../../Components/NewDrawer';
import { UserSettingsContext } from '../../../Context/UserSettingsContext'
import TimeControlPanel from '../../Ssb/Maps/TimeControlPanel';
import { useQuery } from 'react-query';
import BeatLoader from "react-spinners/BeatLoader";
import Elements from './Elements';
import { useTheme, alpha } from '@mui/material/styles';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './ClusterLayers';
const interpolateHeatmapLayer = require('interpolateheatmaplayer');
const MapDisplay = () => {
    const theme = useTheme();
    const { timeSettings, setTimeSettings, playSpeed, setPlaySpeed } = useContext(UserSettingsContext);
    //Fetching the data
    //unix time zone
    const mapRef = React.useRef();
    const [viewport, setViewport] = React.useState({
        longitude: 12.1828,
        latitude: 65.5926,
        zoom: 4,
        bearing: 0,
        pitch: 0,
    });
    const [points, setPoints] = useState([]);

    //Layer
    const [roi, setRoi] = useState([{
        "lat": 58.876757827896306,
        "lon": 11.881643616280888
    },
    {
        "lat": 58.82822263473829,
        "lon": 11.186346643290852
    },
    {
        "lat": 57.912686819868505,
        "lon": 7.476790555439328
    },
    {
        "lat": 58.312298449537096,
        "lon": 5.6030650517562375
    },
    {
        "lat": 59.29308944955574,
        "lon": 4.597435154638623
    },
    {
        "lat": 62.044315808590355,
        "lon": 4.497823276243542
    },
    {
        "lat": 63.90167395134969,
        "lon": 8.386691071710919
    },
    {
        "lat": 65.78132314149487,
        "lon": 10.969111182413434
    },
    {
        "lat": 68.99622052100831,
        "lon": 12.799815394602154
    },
    {
        "lat": 71.32599822634651,
        "lon": 24.95207832070384
    },
    {
        "lat": 70.40816832615413,
        "lon": 33.75659034462962
    },
    {
        "lat": 69.00071308527767,
        "lon": 29.063824274263716
    },
    {
        "lat": 68.54696459233939,
        "lon": 24.900207080564833
    },
    {
        "lat": 68.67151113738113,
        "lon": 22.334051885328627
    },
    {
        "lat": 63.99473920322428,
        "lon": 13.975403465948437
    },
    {
        "lat": 58.876757827896306,
        "lon": 11.881643616280888
    }])
    const [selectedTime, setSelectedTime] = useState([946681200])
    const [timeSeries, setTimeSeries] = useState([])
    const [selectedElement, setSelectedElement] = useState('mean(air_temperature P1M)');
    const [hoverInfo, setHoverInfo] = useState(null)
    //Interpolating
    const { data, isLoading, isFetching } = useQuery(["weatherData", { selectedTime, selectedElement }], GetWeatherData,
        {
            retryDelay: 1000,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                if (data) {
                    setPoints(data.data.points)
                    setTimeSeries(data.data.timesData)

                    setRoi(data.data.delimitation)
                }
            }
        });
    const InterPolateLayer = useMemo(() => interpolateHeatmapLayer.create({
        points: points,
        layerID: "InterPolateLayer",
        p: 3,
        roi: roi,
    }), [selectedTime, points]);

    //OnClick function
    const onClick = (event) => {
        const feature = event.features[0];
        if (feature) {
            if (feature.layer.id === "unclustered-point") {
            }
            else {
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
        }
    };

    const onMouseEnter = useCallback(event => {
        if (event.features[0].layer.id === "unclustered-point") {
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
    const onMapLoad = React.useCallback(() => {
        const testLayer = interpolateHeatmapLayer.create({
            points: points,
            layerID: "testInterpolate"
        })
        mapRef.current.getMap().addSource(('vecSource', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-streets-v8'
        }));
    }, []);
    //Map settings
    function getCursor({ isHovering, isDragging }) {
        return isDragging ? "grabbing" : isHovering ? "pointer" : "default";
    }
    if (isFetching || isLoading) {
        return <p>Loading</p>
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
            onLoad={onMapLoad}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
            onClick={onClick}
            onViewportChange={setViewport}
            mapStyle="mapbox://styles/mapbox/dark-v9"
            mapboxApiAccessToken='pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg'
        >
            {(isLoading || isFetching) && <>
                <BeatLoader />
            </>
            }
            <Source id="weatherData" type="geojson" cluster clusterMaxZoom={14} clusterRadius={50} data={data.data.sourceData} generateId={true}>
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
            </Source>
            <Source id="vectorTest" type="vector" url="mapbox://mapbox.mapbox-streets-v8">
                <Layer {...InterPolateLayer}  source-layer="landuse" beforeId="clusters" ></Layer>
            </Source>
            <Elements selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
            <Box sx={{ display: "flex", flexDirection: "column", width: "5%" }}>
                <NewDrawer setTimeSettings={setTimeSettings} timeSettings={timeSettings} max={10} min={1} setPlaySpeed={setPlaySpeed} playSpeed={playSpeed}></NewDrawer>
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
/* {data && (
    <Source type='geojson' data={data}>
        <Layer {...WeatherLayer} />
    </Source>
)} */