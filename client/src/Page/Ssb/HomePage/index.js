import React, {  useContext } from 'react'
import { Box, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Toolbar, AppBar, Button, Typography } from '@mui/material'
import HeaderInfo from './HeaderInfo'
import Simple from './Simple';
import { SsbContext } from '../../../Context/SsbContext';
import PropTypes from 'prop-types';
import Advanced from './Advanced'
import { useQuery } from 'react-query'
import axios from 'axios';
import LoadingScreen from '../../../Components/LoadingScreen'
import { Image } from 'mui-image'
import { ColorModeContext } from '../../../Context/ColorModeContext'
import LogoDark from '../../../Assets/logoDarkMode.png'
import LogoLight from '../../../Assets/logoLightMode.png'
import { Link } from 'react-router-dom'
const HomePage = ({ mapStatus, setMapStatus, setSelectedRegionType, selectedRegionType }) => {
    const colorMode = useContext(ColorModeContext);
    const version= "simple"
    const { mapformat, setMapformat } = useContext(SsbContext);
    HomePage.propTypes = {
        id: PropTypes.string,
        mapStatus: PropTypes.bool,
    }
    const { isLoading: gettingCategories, error,isError, data: allCategories } = useQuery("Categories", () =>
        axios.get(
            "https://data.ssb.no/api/v0/no/table/"
        ).then((res) => {
            res.data.unshift({ id: "all", text: "All" })
            return (res.data)
        }
        )
    );
    const { data: allDataSets, isLoading: gettingAllDataSets } = useQuery("DataSets", () =>
        axios.get(
            "https://data.ssb.no/api/v0/no/table/?query=/(K/)%20NOT%20avslutta&filter=title"
        ).then((res) => {
            return res.data
        }
        ), {
        refetchOnWindowFocus: false,
    }
    );
    function handleMapFormatChange(e) {
        if (e.target.value === "heatmap") {
            setMapformat("heatmap")
            setSelectedRegionType("kommune")
        }
        else {
            setMapformat("choropleth")
        }
    }
    if (isError) {
        if(error.response.status===500){
         return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><Typography>Error 500</Typography></Container>;
         }
         if(error.response.status===400){
             return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><Typography>Missing Link! Please choose a id</Typography></Container>;
             }
     }
    if (gettingCategories || gettingAllDataSets) {
        return <LoadingScreen />
    }
    return (
        <>
            <AppBar position='static' color="transparent" elevation={0}>
                <Toolbar disableGutters>
                    <Container>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <Box component={Link} to="/" sx={{cursor:"pointer"}}>
                                
                                <Image src={colorMode.mode === "dark" ? LogoDark : LogoLight} duration={300}  sx={{ maxWidth: "200px" }}></Image>
                            </Box>
                            <Link to="/help" style={{ textDecoration: "none" }}>
                                <Button variant="contained">HELP!</Button>
                            </Link>
                        </Box>
                    </Container>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg">
                <HeaderInfo allCategories={allCategories} allDataSets={allDataSets}></HeaderInfo>
                <Box sx={{ display: "flex", justifyContent: "center", gap: "10px", mt: 4 }}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Visualisation style</FormLabel>
                        <RadioGroup row defaultValue="choropleth" onChange={(e) => handleMapFormatChange(e)} >
                            <FormControlLabel control={<Radio />} value="choropleth" label="Choropleth"></FormControlLabel>
                            <FormControlLabel control={<Radio />} value="heatmap" label="Heatmap (Only aviable for kommune)"></FormControlLabel>
                        </RadioGroup>
                    </FormControl>
                </Box>
                {
                    version === "simple" &&
                    <Simple mapformat={mapformat} setMapStatus={setMapStatus} mapStatus={mapStatus} setSelectedRegionType={setSelectedRegionType}></Simple>
                }
                {version === "advanced" ? <Advanced allCategories={allCategories} allDataSets={allDataSets} gettingAllDataSets={gettingAllDataSets} gettingCategories={gettingCategories} /> : null}
            </Container>
        </>
    )
}

export default HomePage
