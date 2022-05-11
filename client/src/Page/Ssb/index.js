
import React, { useState, useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import { SsbContext } from '../../Context/SsbContext';
import HomePage from './HomePage';

import Maps from './Maps';
const Ssb = () => {
  const {setMapformat,id, setId } = useContext(SsbContext);
  const [selectedRegionType, setSelectedRegionType] = useState(null)
  const [geoJson, setGeoJson] = useState(null);
  const [mapStatus, setMapStatus] = useState(false)
  const handleChange = (event) => {
    setMapformat(event.target.value);
  };
  return (
    <>
        <HomePage mapStatus={mapStatus} setMapStatus={setMapStatus} setSelectedRegionType={setSelectedRegionType} selectedRegionType={selectedRegionType} />
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
  }); */        {/* <Maps id={id} regionType={selectedRegionType}/> */}