
import { Box, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import SourceFinder from '../../Apis/SourceFinder';
import ChooseSet from './Advanced'
import Switch from './Switch'
import Simple from './Simple';
import { SsbContext } from '../../Context/SsbContext';
import { BeatLoader } from 'react-spinners';
import SsbVisualization from '../SsbVisualization';
const Test = () => {
  const [version, setVersion] = useState("simple")
  const { setSorting, setOptions, mapformat, setMapformat } = useContext(SsbContext);
  const [id, setId] = useState("")
  const [mapStatus, setMapStatus] = useState(false)
  const [geoJson, setGeoJson] = useState(null);
  const handleChange = (event) => {
    setMapformat(event.target.value);
  };
  const { data, refetch, isLoading, isError, error } = useQuery("ssbData", async () => {
    const url = "https://data.ssb.no/api/v0/dataset/" + id + ".json?lang=no";
    const { data } = await SourceFinder.get("incomejson", {
      params: { url: url, mapFormat: mapformat },
    });
    setGeoJson(data.geoJson)
    setSorting({ options: data.sorting, id: 0, contentCodeIndex: 0 })
    setOptions(data.options)
    console.log(data.geoJson)
    return data;
  }, {
    refetchOnWindowFocus: false,
    enabled: false // turned off by default, manual refetch is needed
  });
  useEffect(() => {
    console.log("skjedde")
    if (mapStatus === true) {
      if (id !== "") {
        refetch()
      }
    }
  }, [mapStatus])
  if(isError){
    return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><BeatLoader color={'#123abc'} /><Typography>Right now we are preparing your map!</Typography></Container>;
  }
  if (isLoading) {
    return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><BeatLoader color={'#123abc'} /><Typography>Right now we are preparing your map!</Typography></Container>;
}
  return (
    <>
    {!data?<>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Switch version={version} setVersion={setVersion}></Switch>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Visualisation style</FormLabel>
          <RadioGroup row defaultValue="heatmap" onChange={handleChange} >
            <FormControlLabel control={<Radio />} value="heatmap" label="Heatmap"></FormControlLabel>
            <FormControlLabel control={<Radio />} value="choropleth" label="Choropleth"></FormControlLabel>
          </RadioGroup>
        </FormControl>
      </Box>
      {version === "simple" &&
        <Simple mapformat={mapformat} setMapStatus={setMapStatus} id={id} setId={setId} mapStatus={mapStatus}></Simple>}
      {version === "advanced" ? <ChooseSet /> : null}
      </>
    :<SsbVisualization geoJson={geoJson}/>}
    </>
  )
}

export default Test