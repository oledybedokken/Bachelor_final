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
const delimitation = [
    {
        "Lat": 58.876757827896306,
        "Lon": 11.881643616280888
    },
    {
        "Lat": 58.82822263473829,
        "Lon": 11.186346643290852
    },
    {
        "Lat": "57.912686819868505",
        "Lon": "7.476790555439328"
    },
    {
        "Lat": 58.312298449537096,
        "Lon": 5.6030650517562375
    },
    {
        "Lat": 59.29308944955574,
        "Lon": 4.597435154638623
    },
    {
        "Lat": 62.044315808590355,
        "Lon": 4.497823276243542
    },
    {
        "Lat": 63.90167395134969,
        "Lon": 8.386691071710919
    },
    {
        "Lat": 65.78132314149487,
        "Lon": 10.969111182413434
    },
    {
        "Lat": 68.99622052100831,
        "Lon": 12.799815394602154
    },
    {
        "Lat": 71.32599822634651,
        "Lon": 24.95207832070384
    },
    {
        "Lat": 70.40816832615413,
        "Lon": 33.75659034462962
    },
    {
        "Lat": 69.00071308527767,
        "Lon": 29.063824274263716
    },
    {
        "Lat": 68.54696459233939,
        "Lon": 24.900207080564833
    },
    {
        "Lat": 68.67151113738113,
        "Lon": 22.334051885328627
    },
    {
        "Lat": 63.99473920322428,
        "Lon": 13.975403465948437
    },
    {
        "Lat": 58.876757827896306,
        "Lon": 11.881643616280888
    }
]
const MapDisplay = () => {
    const theme = useTheme();
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
    const points = [
        {
            "lat": 69.3073,
            "lon": 16.1312,
            "val": -1
        },
        {
            "lat": 59.9423,
            "lon": 10.72,
            "val": -2
        },
        {
            "lat": 59.6193,
            "lon": 10.215,
            "val": -3
        },
        {
            "lat": 61.8957,
            "lon": 7.8955,
            "val": -9
        },
        {
            "lat": 61.122,
            "lon": 9.063,
            "val": -8
        },
        {
            "lat": 62.3293,
            "lon": 5.268,
            "val": 3
        },
        {
            "lat": 61.0917,
            "lon": 10.4762,
            "val": -7
        },
        {
            "lat": 60.7022,
            "lon": 6.9373,
            "val": -4
        },
        {
            "lat": 61.2928,
            "lon": 5.0443,
            "val": 1
        },
        {
            "lat": 59.23,
            "lon": 10.3483,
            "val": -1
        },
        {
            "lat": 61.5648,
            "lon": 7.9957,
            "val": -11
        },
        {
            "lat": 64.1587,
            "lon": 12.4692,
            "val": -8
        },
        {
            "lat": 69.3695,
            "lon": 24.4312,
            "val": -18
        },
        {
            "lat": 59.8558,
            "lon": 10.4358,
            "val": -3
        },
        {
            "lat": 61.6595,
            "lon": 7.2762,
            "val": -5
        },
        {
            "lat": 58.507,
            "lon": 6.5045,
            "val": 0
        },
        {
            "lat": 63.4597,
            "lon": 10.9305,
            "val": -3
        },
        {
            "lat": 64.7977,
            "lon": 10.5493,
            "val": 0
        },
        {
            "lat": 69.6537,
            "lon": 18.9368,
            "val": -4
        },
        {
            "lat": 59.6605,
            "lon": 10.7818,
            "val": -3
        },
        {
            "lat": 59.2852,
            "lon": 11.1128,
            "val": -1
        },
        {
            "lat": 59.3742,
            "lon": 10.798,
            "val": -1
        },
        {
            "lat": 70.2452,
            "lon": 19.4997,
            "val": 0
        },
        {
            "lat": 62.6043,
            "lon": 9.6667,
            "val": -7
        },
        {
            "lat": 66.8102,
            "lon": 13.9793,
            "val": -1
        },
        {
            "lat": 60.7733,
            "lon": 10.8055,
            "val": -5
        },
        {
            "lat": 61.4648,
            "lon": 10.1277,
            "val": -8
        },
        {
            "lat": 58.6592,
            "lon": 5.5553,
            "val": 3
        },
        {
            "lat": 58.3988,
            "lon": 8.7893,
            "val": 2
        },
        {
            "lat": 61.2042,
            "lon": 2.2687,
            "val": 4
        },
        {
            "lat": 59.1513,
            "lon": 10.8288,
            "val": 0
        },
        {
            "lat": 60.383,
            "lon": 5.3327,
            "val": 2
        },
        {
            "lat": 58.3711,
            "lon": 1.9091,
            "val": 6
        },
        {
            "lat": 58.8565,
            "lon": 9.5745,
            "val": 1
        },
        {
            "lat": 63.4107,
            "lon": 10.4538,
            "val": -4
        },
        {
            "lat": 59.6479,
            "lon": 6.3499,
            "val": 0
        },
        {
            "lat": 58.109,
            "lon": 6.5675,
            "val": 2
        },
        {
            "lat": 59.0272,
            "lon": 10.5242,
            "val": 1
        },
        {
            "lat": 63.4882,
            "lon": 10.8795,
            "val": -4
        },
        {
            "lat": 59.9847,
            "lon": 10.6693,
            "val": -4
        },
        {
            "lat": 68.1535,
            "lon": 14.6485,
            "val": 0
        },
        {
            "lat": 61.7873,
            "lon": 6.1835,
            "val": -1
        },
        {
            "lat": 56.5434,
            "lon": 3.2244,
            "val": 5
        },
        {
            "lat": 60.9345,
            "lon": 10.0358,
            "val": -7
        },
        {
            "lat": 59.5766,
            "lon": 7.3897,
            "val": -7
        },
        {
            "lat": 61.0272,
            "lon": 5.3813,
            "val": 1
        },
        {
            "lat": 60.2065,
            "lon": 11.0802,
            "val": -5
        },
        {
            "lat": 68.9968,
            "lon": 23.0335,
            "val": -18
        },
        {
            "lat": 61.6513,
            "lon": 10.1082,
            "val": -9
        },
        {
            "lat": 62.6785,
            "lon": 8.5473,
            "val": -1
        },
        {
            "lat": 65.2023,
            "lon": 10.9965,
            "val": 0
        },
        {
            "lat": 60.7002,
            "lon": 10.8695,
            "val": -5
        },
        {
            "lat": 69.7255,
            "lon": 29.8977,
            "val": -11
        },
        {
            "lat": 66.7628,
            "lon": 12.486,
            "val": 1
        },
        {
            "lat": 69.2349,
            "lon": 17.9014,
            "val": -5
        },
        {
            "lat": 58.0732,
            "lon": 8.0532,
            "val": 2
        },
        {
            "lat": 58.34,
            "lon": 8.5225,
            "val": 0
        },
        {
            "lat": 59.3822,
            "lon": 9.2128,
            "val": -2
        },
        {
            "lat": 65.7017,
            "lon": 11.8562,
            "val": 0
        },
        {
            "lat": 68.7553,
            "lon": 23.5387,
            "val": -17
        },
        {
            "lat": 69.6005,
            "lon": 17.8312,
            "val": -1
        },
        {
            "lat": 62.034,
            "lon": 4.986,
            "val": 2
        },
        {
            "lat": 65.32285,
            "lon": 7.3156,
            "val": 3
        },
        {
            "lat": 59.7662,
            "lon": 7.3653,
            "val": -6
        },
        {
            "lat": 70.3707,
            "lon": 31.0962,
            "val": -3
        },
        {
            "lat": 69.9775,
            "lon": 23.3582,
            "val": -8
        },
        {
            "lat": 64.1727,
            "lon": 9.4052,
            "val": 1
        },
        {
            "lat": 60.9785,
            "lon": 9.224,
            "val": -8
        },
        {
            "lat": 69.6767,
            "lon": 18.9133,
            "val": -4
        },
        {
            "lat": 70.06,
            "lon": 24.9793,
            "val": -10
        },
        {
            "lat": 60.2892,
            "lon": 5.2265,
            "val": 1
        },
        {
            "lat": 58.2,
            "lon": 8.0767,
            "val": 0
        },
        {
            "lat": 60.6435,
            "lon": 3.7193,
            "val": 4
        },
        {
            "lat": 71.0888,
            "lon": 28.217,
            "val": -2
        },
        {
            "lat": 59.3065,
            "lon": 4.8723,
            "val": 3
        },
        {
            "lat": 59.8402,
            "lon": 6.9825,
            "val": -6
        },
        {
            "lat": 61.5717,
            "lon": 4.6817,
            "val": 3
        },
        {
            "lat": 65.8255,
            "lon": 14.1942,
            "val": -6
        },
        {
            "lat": 60.5938,
            "lon": 7.527,
            "val": -9
        },
        {
            "lat": 67.267,
            "lon": 14.3637,
            "val": -1
        },
        {
            "lat": 61.887,
            "lon": 12.0462,
            "val": -10
        },
        {
            "lat": 62.8585,
            "lon": 6.5378,
            "val": 2
        },
        {
            "lat": 59.8397,
            "lon": 8.1785,
            "val": -6
        },
        {
            "lat": 62.2305,
            "lon": 7.4218,
            "val": 0
        },
        {
            "lat": 69.8362,
            "lon": 21.8958,
            "val": -3
        },
        {
            "lat": 62.1133,
            "lon": 9.2862,
            "val": -9
        },
        {
            "lat": 63.7045,
            "lon": 9.6105,
            "val": -2
        },
        {
            "lat": 63.8467,
            "lon": 8.4667,
            "val": 1
        },
        {
            "lat": 59.0257,
            "lon": 8.5187,
            "val": -1
        },
        {
            "lat": 57.9815,
            "lon": 7.048,
            "val": 3
        },
        {
            "lat": 64.0217,
            "lon": 11.4493,
            "val": -5
        },
        {
            "lat": 58.7605,
            "lon": 5.6508,
            "val": 2
        },
        {
            "lat": 70.7057,
            "lon": 30.07,
            "val": -3
        },
        {
            "lat": 58.8843,
            "lon": 5.637,
            "val": 2
        },
        {
            "lat": 64.4013,
            "lon": 10.455,
            "val": 0
        },
        {
            "lat": 58.6582,
            "lon": 8.63,
            "val": -1
        },
        {
            "lat": 58.6361,
            "lon": 9.1479,
            "val": 1
        },
        {
            "lat": 71.0937,
            "lon": 23.9817,
            "val": -1
        },
        {
            "lat": 62.5617,
            "lon": 6.115,
            "val": 1
        },
        {
            "lat": 61.6775,
            "lon": 8.369,
            "val": -11
        },
        {
            "lat": 61.9157,
            "lon": 6.5585,
            "val": -3
        },
        {
            "lat": 69.0577,
            "lon": 18.5437,
            "val": -11
        }
    ]
    const [hoverInfo, setHoverInfo] = useState(null)
    //Layer

    /*  const [points, setPoints] = useState(null) */
    const [selectedTime, setSelectedTime] = useState([946681200])
    const [timeSeries,setTimeSeries]=useState([])
    const [selectedElement, setSelectedElement] = useState('mean(air_temperature P1M)')
    const { timeSettings, setTimeSettings, playSpeed, setPlaySpeed } = useContext(UserSettingsContext);
    //Interpolating
    
    const { data, isLoading, isFetching } = useQuery(["weatherData", { selectedTime, selectedElement }], GetWeatherData,
        {
            retryDelay: 1000,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                if (data) {
                    setTimeSeries(data.data.timesData)
                }
            }
        });
        const InterPolateLayer= interpolateHeatmapLayer.create({
            points: points,
            layerID: "Interpolate",
            p: 2,
            maxValue:20,
            minValue:-20,
            roi: [
                {
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
                }
            ]
        })
        if(data){
            console.log(data)}
    /* const onMapLoad = React.useCallback(() => {
        if (points) {
            
            mapRef.current.getMap().addLayer(temperatureLayer, 'road-label-medium');
        }
    }, []); */

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
    //Map settings
    function getCursor({ isHovering, isDragging }) {
        return isDragging ? "grabbing" : isHovering ? "pointer" : "default";
    }
    const filteredData = useMemo(() => {})
    if (isFetching || isLoading) {
        return <p>Loading</p>
    }
    
    return (<>
        <MapGL
            {...viewport}
            width="100%"
            height="100%"
            ref={mapRef}
            /* onLoad={onMapLoad} */
            initialViewState={{
                longitude: 10.757933,
                latitude: 59.91149,
            }}
            getCursor={getCursor}
            clickRadius={2}
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
                {/* <Layer {...InterPolateLayer}/> */}
            </Source>
            <Elements setSelectedElement={setSelectedElement} />
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
        {console.log(selectedTime)}
        {timeSeries.length>0&&
        <TimeControlPanel times={timeSeries} weather={true} selectedTime={selectedTime} setSelectedTime={setSelectedTime}/>}
        </>
    )
}

export default MapDisplay
/* {data && (
    <Source type='geojson' data={data}>
        <Layer {...WeatherLayer} />
    </Source>
)} */