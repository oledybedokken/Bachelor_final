import { Button, Card, Container, Grid, Stack } from '@mui/material';
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, Autocomplete, Checkbox, TextField } from '@mui/material'
import axios from 'axios';
import LoadingScreen from '../../Components/LoadingScreen';
import { Image } from 'mui-image';
import ChoroplethPreview from '../../Assets/choroplethPreview.png'
import ReactApexChart from 'react-apexcharts';
import heatMapPreview from '../../Assets/heatMapPreview.png'
import JSONstat from "jsonstat-toolkit";
const Simple = ({ mapformat,id,setId,setMapStatus}) => {
    const [checkBox, setCheckBox] = useState(false)
    const [showGraph, setShowGraph] = useState(false)
    const [options, setOptions] = useState({})
    const [chosenKommune, setChosenKommune] = useState(false)
    const [graph, setGraph] = useState({})
    const [filterOptions, setFilterOptios] = useState(null)
    function getGraph() {
        if (id !== "") {
            const url = "https://data.ssb.no/api/v0/dataset/" + id + ".json?lang=no";
            getOptions(url)
        }
    }
    function getMap(){
        setMapStatus(true)
    }
    function getOptions(url) {
        return JSONstat(url).then(main);
    }
    async function main(j) {
        console.log("working")
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
        })
        console.log(ContentsCodes)
    }
    const { isLoading: gettingIds, error, data: muncicipilacityIds } = useQuery("Categories", () =>
        axios.get(
            "https://data.ssb.no/api/v0/dataset/list.json?lang=no"
        ).then((res) => {
            const filter = ["kommuner", "tidsserie"]
            const newArray = []
            res.data.datasets.forEach((dataset) => {
                const value = filter.every(kommunertidsserie => {
                    return dataset.tags.includes(kommunertidsserie)
                })
                if (value === true && dataset.id !== "65962") {
                    newArray.push(dataset)
                }
            })
            return (newArray)
        }
        )
    );

    if (gettingIds) {
        <LoadingScreen />
    }
    return (
        <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: "15px" }}>
            <Card sx={{px:"15px",py:"15px"}}>
                <Grid container>
                    <Grid item md={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", }}>
                            <Typography variant="h6">Choose dataset:</Typography>
                            <Autocomplete
                                disablePortal
                                options={muncicipilacityIds}
                                onChange={(event, value) => {
                                    setId(value.id);
                                }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => checkBox ? option.id : option.title}
                                renderInput={(params) => <TextField {...params} label="Dataset" />}
                            /></Box>
                        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                            <Button variant="contained" size="large" onClick={() => getMap()}>Get Map</Button>
                            <Button variant="contained" color="warning" size="large" onClick={getGraph}>Preview graph</Button>
                        </Stack>
                        {/* {dropDownAviable && } */}
                        {showGraph && {/* <ReactApexChart type="area" series={item.data} options={chartOptions} height={364} /> */ }}
                    </Grid>
                    <Grid item md={6}>
                        <Box>
                            <Typography align='center' variant="h6">Map preview</Typography>
                            <Image src={mapformat === "heatmap" ? heatMapPreview : ChoroplethPreview} fit="fill" duration={300}></Image>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}

export default Simple