import { Container, TextField, Typography, Select, MenuItem, Button,InputLabel,OutlinedInput,FormControl } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import SourceFinder from '../../Apis/SourceFinder';
import JSONstat from "jsonstat-toolkit";
import { BeatLoader } from 'react-spinners';
import Inntekt from '../Inntekt';

const SsbData = () => {
  const [url, setUrl] = useState("")
  const [id, setId] = useState("")
  const[optionFetching,setOptionFetching]=useState(false)
  //const[options,setOptions]=useState(null)
  const [options, setOptions] = useState({});
  const [sorting, setSorting] = useState("")
  function getOptions() {
    return JSONstat(url).then(main);
  }
  const handleIdChange = (event) => {
    setId(event.target.value)
    setUrl("https://data.ssb.no/api/v0/dataset/" + event.target.value + ".json?lang=no")
  }
  const { data, refetch, isLoading } = useQuery("ssbData", async () => {
    const { data } = await SourceFinder.get("/incomejson", {
      params: { sorting: sorting, url: url, sortingTypes: Object.keys(options)[0] },
    });
    console.log(data)
    return data;
  }, {
    refetchOnWindowFocus: false,
    enabled: false // turned off by default, manual refetch is needed
  });
  useEffect(() => {
    if (url !== "") {
      setOptionFetching(true)
      getOptions()
      setOptionFetching(false)
    }
  }, [url])
  async function main(j) {
    var ds = j.Dataset(0);
    let variabler = ds.id.filter(item => { return item !== 'Region' && item !== 'ContentsCode' && item !== 'Tid' })
    let variablerValues = {}
    variabler.map((item) => {
      let itemLength = ds.Dimension(item).length;
      variablerValues[item] = []
      for (let i = 0; i < itemLength; i++) {
        variablerValues[item].push(ds.Dimension(item).Category(i).label)
      }
    })
    setOptions(variablerValues)
    return variabler
  }
  const handleSelectChange = (event) => {
    setSorting(event.target.value)
  }
  const handleSubmit = () => {
    refetch();
    
  }
  const DropDownMenu = () => (
    <>
    <FormControl sx={{mt:2}}>
      {Object.entries(options).map(([key, values]) => (
        <>
        <InputLabel id="demo-simple-select-helper-label">{key}:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sorting}
          onChange={handleSelectChange}
          input={<OutlinedInput label={key}/>}
          fullWidth
        >
          {values.map((item) =>{ setSorting(values[0]); return (<MenuItem value={item} key={item}>{item}</MenuItem>) })}
        </Select></>))}
        </FormControl>
    </>
  );
  if (isLoading) {
    return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><BeatLoader color={'#123abc'} /><Typography>Right now we are preparing your map!</Typography></Container>;
  }
  return (
    <>
    {!data?
      <Container sx={{ justifyContent: "center", display: "flex", flexDirection: "column" }}>
        <Typography variant="h3" color="primary.main">Welcome to ssb visualisation toolkit</Typography>
        <Typography> Kommuner:<a href="https://data.ssb.no/api/?tags=kommuner">Velg data set</a></Typography>
        <TextField value={id} onChange={handleIdChange} required id="outlined-basic" label="Ssb Json Link" variant="outlined" />
        {url !== "" && <Typography>Urlen som vil bli vist: {url}</Typography>}
        {options && <><Typography variant="h4">Velg sorting:</Typography><DropDownMenu /></>}
        {optionFetching && <Typography variant = "h3">Loading Sorting Options...</Typography>}
        <Button variant="contained" disabled={sorting === ""} onClick={() => handleSubmit()} sx={{ mt: 2 }}>HENT DATA</Button>
      </Container>:<Inntekt data={data}/>}
    </>
  )
}

export default SsbData