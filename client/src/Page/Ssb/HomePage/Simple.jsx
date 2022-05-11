import { Button, Card, CardHeader, Container, Grid, Stack } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, Autocomplete, Checkbox, TextField } from '@mui/material'
import axios from 'axios';
import LoadingScreen from '../../../Components/LoadingScreen';
import { Image } from 'mui-image';
import ChoroplethPreview from '../../../Assets/choroplethPreview.png'

import { Link } from 'react-router-dom';
import heatMapPreview from '../../../Assets/heatMapPreview.png'
import JSONstat from "jsonstat-toolkit";
import { SsbContext } from '../../../Context/SsbContext';
import { GetAllSets } from '../../../Apis/Queries';
import SsbWaveChart from '../../../Components/chart/SsbWaveChart';
const Simple = ({ setMapStatus, setSelectedRegionType }) => {
    const [checkBox, setCheckBox] = useState(false)
    const [showGraph, setShowGraph] = useState(false)
    const [options, setOptions] = useState({})
    const [chosenKommune, setChosenKommune] = useState(false)
    const [regionType, setRegionType] = useState("both")
    const [graph, setGraph] = useState({})
    const [filterOptions, setFilterOptios] = useState(null)
    const { mapformat, setMapformat, id, setId } = useContext(SsbContext);
    //Graph preview
    function getGraph() {
        if (id !== "") {
            console.log(id.id)
            const url = "https://data.ssb.no/api/v0/dataset/" + id.id + ".json?lang=no";
            //const url = "https://data.ssb.no/api/v0/dataset/1052.json"
            getOptions(url)
        }
    }
    function getOptions(url) {
        return JSONstat(url).then(main);
    }
    async function main(j) {
        var ds = j.Dataset(0);
        let array = ds.toTable({ type: "arrobj" }, function (d) {
            if (d.value !== null) {
                return d
            }
        });
        let variabler = ds.id.filter(item => { return item !== 'Region' && item !== 'ContentsCode' && item !== 'Tid' })
        let ContentsCodesIds = ds.Dimension("ContentsCode").id
        let ContentsCodes = []
        setOptions({ categories: ds.Dimension("Tid").id })
        ContentsCodesIds.forEach((content, index) => {
            const ContentCodeObject = {
                label: ds.Dimension("ContentsCode").Category(index).label,
                unit: ds.Dimension("ContentsCode").Category(index).unit
            }
            ContentsCodes.push(ContentCodeObject)
        });
        const title = ds.label;
        const time =  { categories: ds.Dimension("Tid").id }
        console.log(ContentsCodesIds.length)
        console.log(ds.Data({ "ContentsCode": ContentsCodesIds[0]}))
        const series = { series: [
            { name: ds.Dimension("ContentsCode").Category(ContentsCodesIds[0]).label, data: ds.Data({ "ContentsCode": ContentsCodesIds[0] }, false) },
            {name: ds.Dimension("ContentsCode").Category(ContentsCodesIds[1]).label, data: ds.Data({ "ContentsCode": ContentsCodesIds[1] }, false)}
        ] }
        const newGraph ={...graph}
        newGraph.xaxis=time
        newGraph.title = title;
        setGraph(graph => ({ ...newGraph, ...series }))
        setShowGraph(true)
    }
    //Regarding map and sorting
    function findRegionType(inpId) {
        const activeId = muncicipilacityIds.filter((e) => e.id === inpId)
        if (activeId[0]["tags"].includes("kommuner")) {
            setSelectedRegionType("kommune")
        }
        else if (activeId[0]["tags"].includes("fylker")) {
            setSelectedRegionType("fylke")
        }
        else { return "error" }
    }
    const { isLoading: gettingIds, isFetching, error, data: muncicipilacityIds } = useQuery("simpleDataSets", () => GetAllSets());
    function filterByRegionType() {
        return muncicipilacityIds.filter((dataSet) => [regionType, "tidsserie"].every(tag => dataSet.tags.includes(tag)))
    }
    const dataFiltered = useMemo(() => regionType === "both" ? muncicipilacityIds : filterByRegionType())
    function changeRegionTypeState() {
        setRegionType("kommuner")
    }
    useEffect(() => {
        if (mapformat === "heatmap") {
            changeRegionTypeState()
        }
    }, [mapformat]);
    //Loading..
    if (gettingIds || isFetching) {
        <LoadingScreen />
    }
    return (
        <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: "15px" }}>
            <Card sx={{ px: "15px", py: "15px" }}>
                <Grid container>
                    <Grid item md={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", }}>
                            {mapformat !== "heatmap" &&
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Fylke or Kommune</FormLabel>
                                    <RadioGroup row defaultValue="both" onChange={(e) => setRegionType(e.target.value)} >
                                        <FormControlLabel disabled={mapformat === "heatmap"} control={<Radio />} value="both" label="Both"></FormControlLabel>
                                        <FormControlLabel control={<Radio />} value="kommuner" label="Kommune"></FormControlLabel>
                                        <FormControlLabel control={<Radio />} disabled={mapformat === "heatmap"} value="fylker" label="Fylke"></FormControlLabel>
                                    </RadioGroup>
                                </FormControl>
                            }
                            <Typography variant="h6">Choose dataset:</Typography>
                            {dataFiltered &&
                                <Autocomplete
                                    disablePortal
                                    options={dataFiltered}
                                    onChange={(event, value) => {
                                        if (!value) {
                                            setId("")
                                        }
                                        else {
                                            findRegionType(value.id)
                                            setId(value);
                                        }
                                    }}
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option) => checkBox ? option.id : option.title}
                                    renderInput={(params) => <TextField {...params} label="Dataset" />}
                                />}</Box>

                        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                            <Button variant="contained" size="large" component={Link} to={"/ssb/map/" + id.id} disabled={id === "" ? true : false}>Get Map</Button>
                            <Button variant="contained" color="warning" size="large" onClick={getGraph} disabled={id === "" ? true : false}>Preview graph</Button>
                        </Stack>
                            {/* {dropDownAviable && } */}
                            
                    </Grid>
                    <Grid item md={6}>
                    {showGraph===true ? 
                            <Card>
                                <CardHeader title={graph.title.split(":")[1]}></CardHeader>
                                <Box width="500px"></Box>
                                <SsbWaveChart graph={graph}/>
                            </Card>:
                        <Box>
                            <Typography align='center' variant="h6">Map preview</Typography>
                            <Image src={mapformat === "heatmap" ? heatMapPreview : ChoroplethPreview} fit="fill" duration={300}></Image>
                        </Box>}
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}

export default Simple