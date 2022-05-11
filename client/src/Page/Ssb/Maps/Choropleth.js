import React, { useMemo, useContext, useState, useCallback, } from 'react'
import SsbContext from '../../../Context/SsbContext';
import { range } from 'd3-array';
import { scaleQuantile } from 'd3-scale';
import MapGL, { Source, Layer,Popup } from 'react-map-gl';
import MapControlFullscreen from './MapTools/MakeWindowBig';
import { useTheme } from '@mui/material/styles';
import TimeControlPanel from './TimeControlPanel';
import MapControlGeolocate from './MapTools/GeoLocate';
import NewDrawer from '../../../Components/NewDrawer';
import { Box } from '@mui/material';
import { UserSettingsContext } from '../../../Context/UserSettingsContext'
import SortingDropDownMenu from '../../../Components/SortingDropDownMenu';
const Choropleth = ({ geoJson, colorMode, max, min, name }) => {
  //const theme = useTheme()
  //Declaration of variables
  const { fullScreen, timeSettings, playSpeed, setTimeSettings, setPlaySpeed,chosenRegion,setChosenRegion,setSideBarStatus } = useContext(UserSettingsContext)
  const { sorting, options, customFilter } = useContext(SsbContext);
  const [allDays, setAllDays] = useState(false)
  const [selectedTime, setSelectedTime] = useState(0);
  //Map layers and other map related
  const [hoverInfo, setHoverInfo] = useState(null)
  const DrawerSpecialInfo = (anchor) => (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <SortingDropDownMenu></SortingDropDownMenu>
    </Box>
  );
  const dataLayer = {
    id: 'data',
    type: 'fill',
    filter: ["has", "percentile"],
    paint: {
      'fill-color': [
        "interpolate",
        ["exponential", 1],
        ["get", "percentile"],
        0,
        "#a7d5ed",
        2,
        "#a7d5ed",
        20,
        "#c23728",
        30,
        "#e14b31",
        40,
        "#de6e56",
        50,
        "#e1a692",
        60,
        "#e2e2e2",
        70,
        "#a7d5ed",
        80,
        "#63bff0",
        90,
        "#22a7f0",
        100,
        "#1984c5"
      ],
      'fill-opacity': 1,
    }
  };
  const InntektSymbol = {
    id: "symbol",
    source: "inntektData",
    type: 'symbol',
    filter: ["has", "percentile"],
    layout: {
      "text-field": ["get", "value"],
      "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
      "text-size": 12,
      "text-padding": [
        "interpolate",
        ["linear"],
        ["zoom"],
        1,
        20,
        7,
        40,
        9,
        100
      ]
    },
    paint: {
      "text-color": "hsl(0, 0%, 100%)",
      "text-halo-color": "hsl(0, 0%, 0%)",
      "text-halo-width": 1,
      "text-halo-blur": 0.5
    }
  }
  const InntektLine = {
    id: "lines",
    source: "inntektData",
    type: 'line',
    layout: {
      'line-cap': "butt"
    },

    filter: ["has", "percentile"],
    paint: {
      'line-color': [
        "interpolate",
        ["exponential", 1],
        ["get", "percentile"],
        0,
        "#111111",
      ],
      'line-opacity': 0.5,
      'line-width': 0.5
    }
  }
  const [viewport, setViewport] = React.useState({
    longitude: 10.757933,
    latitude: 59.91149,
    zoom: 5,
  });
  //Map geojson loading
  function updatePercentiles(featureCollection, accessor) {
    const { features } = featureCollection;
    const scale = scaleQuantile()
      .domain(features.map(accessor))
      .range(range(100));
    return {
      type: "FeatureCollection",
      features: features.map((f) => {
        const value = accessor(f);
        const properties = {
          ...f.properties,
          value,
          percentile: scale(value),
        };
        return { ...f, properties };
      }),
    };
  }
  const filteredData = useMemo(() => {
    let sortedArray = []
    if (sorting.options.length > 0) {
      const Sorting = Object.values(sorting.options[sorting.id]);
      sortedArray = geoJson.features.map((element) => {
        const value = element.properties.verdier.filter(e => e.filters.every(filter => Sorting.includes(filter)))[0]
        return { ...element, properties: { ...element.properties, verdier: value } }
      })
    }
    else {
      sortedArray = geoJson.features.filter(e => e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[selectedTime]])
    }
    if (customFilter.showZero === true) {
      sortedArray = sortedArray.filter(e => e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[selectedTime]] !== 0);
    }
    const geoJsonBrukBar = {
      "type": "FeatureCollection",
      "features": sortedArray
    }
    return (
      geoJsonBrukBar &&
      updatePercentiles(geoJsonBrukBar, (f) => f.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[selectedTime]]));
  }, [selectedTime, sorting, customFilter]);

  const onClick = useCallback((event) => {
    event.preventDefault()
    const { features } = event;
    const clickedFeature = features && features[0];
    console.log(clickedFeature);
    if (clickedFeature) { 
      let valgtSted = geoJson.features.filter(region => clickedFeature.properties.RegionNumber === region.properties.RegionNumber);
      setChosenRegion([...chosenRegion, valgtSted[0].properties]); setSideBarStatus(true)}
  }, [chosenRegion]);

  const onHover = useCallback((event) => {
    const { features } = event;
    const hoveredFeature = features && features[0];
    setHoverInfo(
      hoveredFeature
        ? {
          feature: hoveredFeature,
          lat: event.lngLat[0],
          long: event.lngLat[1],
        }
        : null
    );
  }, []);
  //render
  return (
    <>
      <Box width={"100%"}>
        <MapGL {...viewport} onHover={onHover} onClick={onClick} onViewportChange={setViewport} width="100%" height="100%" interactiveLayerIds={["data"]} mapboxApiAccessToken="pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg" mapStyle={colorMode.mode === "dark" ? "mapbox://styles/mapbox/dark-v10?optimize=true" : "mapbox://styles/mapbox/light-v10?optimize=true"}>
          {fullScreen ?
            <Box sx={{ display: "flex", flexDirection: "column", width: "5%" }}>
              <NewDrawer setTimeSettings={setTimeSettings} timeSettings={timeSettings} max={max} min={min} setPlaySpeed={setPlaySpeed} playSpeed={playSpeed} DrawerSpecialInfo={DrawerSpecialInfo}></NewDrawer>
            </Box> : <><MapControlFullscreen /><MapControlGeolocate></MapControlGeolocate></>}
          <Source type="geojson" data={filteredData}>
            <Layer {...dataLayer}></Layer>
            <Layer {...InntektSymbol}></Layer>
            <Layer {...InntektLine}></Layer>
          </Source>
          {hoverInfo && (
            <Popup
              longitude={hoverInfo.lat}
              latitude={hoverInfo.long}
              closeButton={false}
              anchor="bottom"
            >
              {
                <>
                  <div style={{ width: "150px", color: "#000000" }}>
                    <div>
                      <p>Kommune Navn:</p>
                      <p>{hoverInfo.feature.properties.Region}</p>
                    </div>
                    <div>
                      <p>{options.ContentCode.label}:<br></br><span style={{ fontWeight: 700 }}>{hoverInfo.feature.properties.value} {options.ContentsCodes[sorting.contentCodeIndex].unit.base}</span></p>
                    </div>
                  </div>
                </>
              }
            </Popup>
          )}
        </MapGL>
        <TimeControlPanel times={options.times} timeSettings={timeSettings} playSpeed={playSpeed} allDays={allDays} setAllDays={setAllDays} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
      </Box>
    </>
  )
}

export default Choropleth