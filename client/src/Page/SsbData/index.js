import React, { useEffect, useState, useContext } from 'react'
//Fetching
import { useQuery } from 'react-query';
import SourceFinder from '../../Apis/SourceFinder';

//Design
import { ColorModeContext } from '../../context/ColorModeContext';
import { Container, TextField, Typography, Button, Box, Autocomplete, Checkbox, FormControlLabel } from '@mui/material'
import { BeatLoader, DotLoader } from 'react-spinners';
import FillOutForm from './FillOutForm';
import MainBar from './MainBar';
import mainpageBackground from "../../Assets/mainpageBackground.png";
import SsbVisualization from '../SsbVisualization';
const SsbData = () => {
    const colorMode = useContext(ColorModeContext);
    const [sorting, setSorting] = useState(null)
    const [geoJson, setGeoJson] = useState(null);
    const [options, setOptions] = useState(null);
    const [mapFormatSelect, setMapFormatSelect] = useState("heatmap");
    const [id, setId] = useState("")
    //Fetching data from the server
    const { data, refetch, isLoading, isError, error } = useQuery("ssbData", async () => {
        const url = "https://data.ssb.no/api/v0/dataset/" + id + ".json?lang=no";
        const { data } = await SourceFinder.get("incomejson", {
            params: { url: url, mapFormat: mapFormatSelect },
        });
        setGeoJson(data.geoJson)
        setSorting(data.sorting)
        setOptions(data.options)
        return data;
    }, {
        refetchOnWindowFocus: false,
        enabled: false // turned off by default, manual refetch is needed
    });

    //On page load fetch all data needed about SSB datasets

    //Depending on the status of the query fetch
    if (isLoading) {
        return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><BeatLoader color={'#123abc'} /><Typography>Right now we are preparing your map!</Typography></Container>;
    }
    if (isError) {
        return <Typography>{error.message}</Typography>
    }
    return (
        <>
            {!data ?
                <>
                    <Container
                        maxWidth=""
                        sx={{
                            backgroundImage: colorMode.mode === "dark" ?
                                "URL(" +
                                mainpageBackground +
                                "),linear-gradient(to bottom right, #1c527e 50%, #0d4b62 50%);" :
                                "URL(" +
                                mainpageBackground +
                                "),#fff",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                        }}
                    >
                        <MainBar colorMode={colorMode} />
                        <FillOutForm colorMode={colorMode} setId={setId} id={id} mapFormat={mapFormatSelect}
                            setMapFormatSelect={setMapFormatSelect} refetch={refetch} />
                    </Container>
                </> : <SsbVisualization geoJson={geoJson} sorting={sorting} options={options}/>}
        </>
    )
}

export default SsbData