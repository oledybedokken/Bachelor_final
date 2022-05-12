import React, { useContext } from 'react'
import { Container, Typography,} from '@mui/material'
import { ColorModeContext } from '../../Context/ColorModeContext';
import MainBar from './MainBar';
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
