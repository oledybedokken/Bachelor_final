import React, { useContext } from 'react'
import { Container, TextField, Typography, Button, Box, Autocomplete, Checkbox, FormControlLabel } from '@mui/material'
import mainpageBackground from "../../Assets/mainpageBackground.png";
import { ColorModeContext } from '../../context/ColorModeContext';


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
            <Typography variant="h1" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"}>Help</Typography>
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"}>Go to weather documentation</Typography>
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"}>Go to SSB documentation</Typography>
        </Container>
    </>
    
  )
}

export default Help
