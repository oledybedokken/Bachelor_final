import { Box, Card, CardContent, CardHeader, Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import Heatmap from './Heatmap'
import { ColorModeContext } from '../../../Context/ColorModeContext'
import { useQuery } from 'react-query';
import { GetMapSsb } from '../../../Apis/Queries'
import LoadingScreen from '../../../Components/LoadingScreen';
import { SsbContext } from '../../../Context/SsbContext';
import Choropleth from './Choropleth';
import SortingDropDownMenu from '../../../Components/SortingDropDownMenu';
const Maps = ({ id, mapFormat, regionType }) => {
    const colorMode = useContext(ColorModeContext);
    const { setSorting, setOptions } = useContext(SsbContext);
    const url = "https://data.ssb.no/api/v0/dataset/" + id.id + ".json?lang=no";
    const { data, isLoading, isFetching, isError, error } = useQuery(["ssbData", { url: url, mapFormat: mapFormat, regionType: regionType }], () => GetMapSsb({ url: url, mapFormat: mapFormat, regionType: regionType }),
        {
            retryDelay: 1000,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setSorting({ options: data.sorting, id: 0, contentCodeIndex: 0 })
                setOptions(data.options)
            }
        });
    if (isError) {
        return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><Typography>{error}</Typography></Container>;
    }
    if (isFetching) {
        return <LoadingScreen text={"Contacting SSB"} />;
    }
    if (isLoading) {
        return <LoadingScreen text={"Loading data from SSB"} />;
    }
    return (
        <Container maxWidth="" sx={{ mt: "50px" }} disableGutters>
            <Grid container direction={"row"} justifyContent="center" alignItems="center" spacing={3}>
                <Grid item >
                    <Card sx={{ maxWidth: "300px" }}>
                        <CardHeader title="Sorting"></CardHeader>
                        <CardContent>
                            <SortingDropDownMenu></SortingDropDownMenu>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader title="Color Picker"></CardHeader>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardHeader title={mapFormat.charAt(0).toUpperCase() + mapFormat.slice(1) + " - " + id.title} />
                        <CardContent>
                            <Box sx={{ zIndex: 0, height: 750, overflow: "hidden", position: "relative", borderRadius: "25px" }}>
                                {data && mapFormat === "heatmap" &&
                                    <Heatmap geoJson={data.geoJson} colorMode={colorMode} />
                                }
                                {data && mapFormat === "choropleth" && <Choropleth geoJson={data.geoJson} colorMode={colorMode} />}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardHeader title="Settings"></CardHeader>
                        <CardContent>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Time chooser</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="slider"
                                    name="radio-buttons-group">
                                    <FormControlLabel value="slider" control={<Radio />} label="Slider" />
                                    <FormControlLabel value="dropdown" control={<Radio />} label="Dropdown" />
                                    <FormControlLabel value="controller" control={<Radio />} label="Controller" />
                                </RadioGroup>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Maps