
import React, { useState, useContext, useEffect } from 'react'
import { SsbContext } from '../../Context/SsbContext';
import HomePage from './HomePage';

import Maps from './Maps';
const Ssb = () => {
  const { setSorting, setOptions, mapformat, setMapformat } = useContext(SsbContext);
  const [id, setId] = useState(null)
  const [selectedRegionType, setSelectedRegionType] = useState(null)
  const [geoJson, setGeoJson] = useState(null);
  const [mapStatus, setMapStatus] = useState(false)
  const handleChange = (event) => {
    setMapformat(event.target.value);
  };

  return (
    <>
      {!mapStatus ?
        <HomePage id={id} setId={setId} mapStatus={mapStatus} setMapStatus={setMapStatus} setSelectedRegionType={setSelectedRegionType} selectedRegionType={selectedRegionType} />
        : <Maps id={id} mapFormat={mapformat} regionType={selectedRegionType} />
      }
    </>
  )
}

export default Ssb

/* const { data, refetch, isLoading, isFetching,isError, error } = useQuery("ssbData", async () => {
    const url = "https://data.ssb.no/api/v0/dataset/" + id + ".json?lang=no";
    const { data } = await SourceFinder.get("incomejson", {
      params: { url: url, mapFormat: mapformat },
    });
    setSorting({ options: data.sorting, id: 0, contentCodeIndex: 0 })
    setOptions(data.options)
    return data;
  }, {
    refetchOnWindowFocus: false,
    enabled: false // turned off by default, manual refetch is needed
  }); */