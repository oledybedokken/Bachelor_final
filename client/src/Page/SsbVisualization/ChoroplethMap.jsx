import React, { useState } from 'react'

const ChoroplethMap = () => {
    const [viewport, setViewport] = React.useState({
        longitude: 10.757933,
        latitude: 59.91149,
        zoom: 5,
      });
    const [timeId,setTimeId]=useState(null)
    const [hoverInfo,setHoverInfo]=useState(null)
    const fillLayer={
        id:'fillLayer',
        type:"fill",
        paint:{
            'fill-color':{
                property:'percentile',
                stops:createStops()
            }
        },
        'fill-opacity': 0.8,
    };

    //We have to do this to avoid an error claiming that the year dosent exsist, but runtime for it is extremly fast on avg (0.2-1 ms per run so not that big of a deal)
    //Make the data
    const filteredData = useMemo(() => {
        let sortedArray = []
        if (sorting.options.length > 0) {
          console.log("skjedde")
          const Sorting = Object.values(sorting.options[sorting.id]);
          console.log(Sorting)
          sortedArray = geoJson.features.slice(0,5).map((element) => {
            const value = element.properties.verdier.filter(e => e.filters.every(filter => Sorting.includes(filter)))[0]
            return { ...element, properties: { ...element.properties, verdier: value } }
          })
        }
        else {
          sortedArray = geoJson.features.filter(e => e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[yearId]])
        }
        if (customFilter.showZero === true) {
          sortedArray = sortedArray.filter(e => e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[yearId]] !== 0);
        }
        const geoJsonBrukBar = {
          "type": "FeatureCollection",
          "features": sortedArray
        }
        return (
          geoJsonBrukBar &&
          updatePercentiles(geoJsonBrukBar, (f) => f.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label][options.times[yearId]]));
      }, [yearId, sorting, customFilter]);

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
      //Create the map
  return (
    <>
    <MapGl {...viewport} onHover={onHover}>
        <Source>
            <Layer {...fillLayer} data={filteredData}></Layer>
        </Source>
    </MapGl>
    </>
  )
}

export default ChoroplethMap