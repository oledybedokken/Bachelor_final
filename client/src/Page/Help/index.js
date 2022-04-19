import React, { useContext } from 'react'
import { Box, Card, CardMedia, Container } from "@mui/material";
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
            }}
        >
            <h1>Help</h1>
            <a >Go to weather documentation</a>
            <a >Go to SSB documentation</a>
        </Container>
    </>
    
  )
}

export default Help
