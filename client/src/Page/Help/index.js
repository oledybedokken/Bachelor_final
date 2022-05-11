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
        <Container maxWidth="xl">
            <MainBar color={colorMode} />
            <Typography variant="h1" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>Help</Typography><br />
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"} to={"/"}>Go to weather documentation</Typography><br />
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"}>Go to SSB documentation</Typography>
            <FAQ />
        </Container>
    </>
    
  )
}

export default Help
