import React, { useMemo, useContext, useState } from 'react'
import SsbContext from '../../../Context/SsbContext';
import { range } from 'd3-array';
import { scaleQuantile } from 'd3-scale';
import MapGL, { Source, Layer } from 'react-map-gl';
import MapControlFullscreen from './MapTools/MakeWindowBig';
import { useTheme } from '@mui/material/styles';
import ChoroplethControlPanel from './ChoroplethControlPanel';

const Choropleth = ({ geoJson, colorMode }) => {
  const theme = useTheme()
  const { sorting, options, customFilter } = useContext(SsbContext);
  const [viewport, setViewport] = React.useState({
    longitude: 10.757933,
    latitude: 59.91149,
    zoom: 5,
  });
  const [timeId, setTimeId] = useState(0)
  const [hoverInfo, setHoverInfo] = useState(null)
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
        return { ...element, properties: { ...element.properties, verdier: value }}
      })
      console.log(sortedArray)
    }
    else {
      sortedArray = geoJson.features.filter(e => e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[timeId]])
    }
    if (customFilter.showZero === true) {
      sortedArray = sortedArray.filter(e => e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[timeId]] !== 0);
    }
    const geoJsonBrukBar = {
      "type": "FeatureCollection",
      "features": sortedArray
    }
    return (
      geoJsonBrukBar &&
      updatePercentiles(geoJsonBrukBar, (f) => f.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[timeId]]));
  }, [timeId, sorting, customFilter]);
  return (
    <>
    <MapGL {...viewport} onViewportChange={setViewport} width="100%" height="100%" interactiveLayerIds={["data"]} mapboxApiAccessToken="pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg" mapStyle={colorMode.mode === "dark" ? "mapbox://styles/mapbox/dark-v10?optimize=true" : "mapbox://styles/mapbox/light-v10?optimize=true"}>
      <MapControlFullscreen />
      <Source type="geojson" data={filteredData}>
        <Layer {...dataLayer}></Layer>
        <Layer {...InntektSymbol}></Layer>
        <Layer {...InntektLine}></Layer>
      </Source>
    </MapGL>
   <ChoroplethControlPanel selectedTime={timeId} steps={options.times}/>
    </>
  )
}

export default Choropleth