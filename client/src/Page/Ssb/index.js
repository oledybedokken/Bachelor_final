
import React, { useState } from 'react'
import HomePage from './HomePage';
const Ssb = () => {
  const [selectedRegionType, setSelectedRegionType] = useState(null)
  const [mapStatus, setMapStatus] = useState(false)
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
  });     <Maps id={id} regionType={selectedRegionType}/> */