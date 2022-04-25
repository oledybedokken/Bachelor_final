import React, { useState, useEffect,useContext } from 'react'
//fetch related
import { usePromiseTracker } from "react-promise-tracker";
import axios from 'axios';
//Design Related
import { Container, TextField, Typography, Button, Box, Autocomplete, Checkbox, FormControlLabel } from '@mui/material'
import { DotLoader } from 'react-spinners';
import MapFormat from '../../Components/MapFormat';
import { Image } from 'mui-image';
//Images
import ChoroplethPreview from '../../Assets/choroplethPreview.png'
import heatMapPreview from '../../Assets/heatMapPreview.png'
//Data
import { SsbContext } from '../../Context/SsbContext';
const FillOutForm = ({ colorMode, setId, id,refetch }) => {
    const {mapformat} = useContext(SsbContext);
    const [checkBox, setCheckBox] = useState(false)
    const { promiseInProgress } = usePromiseTracker();
    const [muncicipilacityIds, setMuncicipilacityIds] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://data.ssb.no/api/v0/dataset/list.json?lang=no");
                if (response) {
                    const filter = ["kommuner", "tidsserie"]
                    const currentArray = []
                    response.data.datasets.forEach((dataset) => {
                        const value = filter.every(kommunertidsserie => {
                            return dataset.tags.includes(kommunertidsserie)
                        })
                        if (value === true && dataset.id !== "65962") {
                            currentArray.push(dataset)
                        }
                    })
                    setMuncicipilacityIds(currentArray)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, []);

    return (
        <Container sx={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#fff" : "rgb(12, 13, 14)"}>Welcome to ssb map Visualization!</Typography>
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#fff" : "rgb(12, 13, 14)"}>Need help on how it works, visit help!</Typography>
            <Box sx={{ display: "flex", mt: 5 }}>
                <Box>
                    {muncicipilacityIds ?
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="h5">Choose dataset:</Typography>
                            <Autocomplete
                                disablePortal
                                options={muncicipilacityIds}
                                onChange={(event, value) => {
                                    setId(value.id);
                                }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => checkBox ? option.id : option.title}
                                renderInput={(params) => <TextField {...params} label="Dataset" />}
                            />
                            <FormControlLabel sx={{ ml: "5px" }} control={<Checkbox color={colorMode.mode === 'dark' ? 'secondary' : 'primary'} checked={checkBox} onChange={() => setCheckBox(!checkBox)} />} label="Choose with Id instead" />
                        </Box>
                        :
                        <Typography>Fetching aviable Ids</Typography>}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <MapFormat></MapFormat>
                    <Box sx={{ flex: "1", ml: 2, display: "flex", justifyContent: "center" }}>
                        {mapformat ? <Image src={mapformat === "heatmap" ? heatMapPreview : ChoroplethPreview} fit="fill" duration={300} width="80%"></Image> : <Image src={heatMapPreview} fit="fill" duration={300} width="80%"></Image>}
                    </Box>
                </Box>
            </Box>
            {id !== "" && <Typography>Urlen som vil bli vist: {"https://data.ssb.no/api/v0/dataset/" + id + ".json?lang=no"}</Typography>}
            {(promiseInProgress === true) &&
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <DotLoader color={"#123abc"} />
                    <Typography>Contating SSB to recieve sorting options</Typography>
                </Box>}
            <Button variant="contained" disabled={id===""} onClick={() => refetch()} sx={{ mt: 2 }}>Create Map with data</Button>
        </Container>
    )
}

export default FillOutForm
