import React, { useEffect, useState, useContext } from 'react'
//Fetching
import { useQuery } from 'react-query';
import SourceFinder from '../../Apis/SourceFinder';

//Stored values
import { ColorModeContext } from '../../Context/ColorModeContext';
import { SsbContext } from '../../Context/SsbContext';

//Design
import { Container, TextField, Typography, Button, Box, Autocomplete, Checkbox, FormControlLabel } from '@mui/material'
import { BeatLoader, DotLoader } from 'react-spinners';
import FillOutForm from './FillOutForm';
import MainBar from './MainBar';
import mainpageBackground from "../../Assets/mainpageBackground.png";
import SsbVisualization from '../SsbVisualization';

const SsbData = () => {
    const colorMode = useContext(ColorModeContext);
    const {setSorting,setOptions,setMapformat} = useContext(SsbContext);
    const [geoJson, setGeoJson] = useState(null);
    const [id, setId] = useState("")
    //Fetching data from the server
    function changeId(value){
        setId(value)
    }
    const { data, refetch, isLoading, isError, error } = useQuery("ssbData", async () => {
        const url = "https://data.ssb.no/api/v0/dataset/" + id + ".json?lang=no";
        const { data } = await SourceFinder.get("incomejson", {
            params: { url: url, mapformat: setMapformat },
        });
        setGeoJson(data.geoJson)
        setSorting({options:data.sorting,id:0,contentCodeIndex:0})
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
                                "),linear-gradient(to bottom right, #172347 0%, #015268 100%);" :
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
                        <FillOutForm colorMode={colorMode} setId={changeId} id={id} refetch={refetch} />
                    </Container>
                </> : <SsbVisualization geoJson={geoJson}/>}
        </>
    )
}

export default SsbData