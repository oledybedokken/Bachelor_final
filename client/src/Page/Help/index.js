import React, { useContext } from 'react'
import { Container, TextField, Typography, Button, Box, Autocomplete, Checkbox, FormControlLabel } from '@mui/material'
import mainpageBackground from "../../Assets/mainpageBackground.png";
import { ColorModeContext } from '../../Context/ColorModeContext';
import MainBar from './MainBar';
import SortingDropDownMenu from '../../Components/SortingDropDownMenu';
import FAQ from './FAQ/FAQ'

const Help = () => {
    const colorMode = useContext(ColorModeContext);
  return (
    <>
        <Container
            maxWidth=""
            disableGutters
            sx={{
            backgroundImage: colorMode.mode === "dark" ?
                "URL(" +
                mainpageBackground +
                "),linear-gradient(180deg, #172347 0%, #015268 100%)" :
                "URL(" +
                mainpageBackground +
                "),rgb(240, 242, 245)"
            ,
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
            <MainBar color={colorMode} />
            <Typography variant="h1" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"}>Help</Typography><br />
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"} to={"/"}>Go to weather documentation</Typography><br />
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"}>Go to SSB documentation</Typography>
            <FAQ />
        </Container>
    </>
    
  )
}

export default Help
