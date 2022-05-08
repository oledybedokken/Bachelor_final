import React, { useContext } from 'react'
import { Box, Button, Card, CardContent, CardHeader, Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material'
import SortingDropDownMenu from '../../../../Components/SortingDropDownMenu';
import { SsbContext } from '../../../../Context/SsbContext';
import Heatmap from '../Heatmap';
import Choropleth from '../Choropleth';
import { ColorModeContext } from '../../../../Context/ColorModeContext';
import TimeSettingsTest from '../../../../Components/TestTimeSettings';
import { func } from 'prop-types';
const Clean = ({ id, data, timeSettings, playSpeed, setTimeSettings, max, min, setPlaySpeed}) => {
    const { mapformat,fullScreen,setFullScreen } = useContext(SsbContext);
    const colorMode = useContext(ColorModeContext);
    function handleChange(e) {
        setFullScreen(!fullScreen)
    }
    return (
        data && data.geoJson.features.length > 0 ?
            <Container maxWidth="" sx={{ mt: "50px" }} disableGutters>
                <Grid container direction={"row"} justifyContent="center" alignItems="center" spacing={3}>
                    <Grid item >
                        <Box sx={{display:"flex",justifyContent:"center",p:"5px",mb:"5px"}}>
                            <Button variant="contained" onClick={handleChange}>Go fullscreen mode!</Button>
                        </Box>
                        <Card sx={{ maxWidth: "300px" }}>
                            <CardHeader title="Sorting"></CardHeader>
                            <CardContent>
                                <SortingDropDownMenu></SortingDropDownMenu>
                            </CardContent>
                        </Card>
                        <TimeSettingsTest setTimeSettings={setTimeSettings} timeSettings={timeSettings} parseInt={parseInt} max={max} min={min} setPlaySpeed={setPlaySpeed} playSpeed={playSpeed} />
                    </Grid>
                    <Grid item>
                        <Card>
                            {data &&
                                <>
                                    <CardHeader title={mapformat.charAt(0).toUpperCase() + mapformat.slice(1) + " - " + id.title} />
                                    <CardContent>
                                        <Box sx={{ zIndex: 0, height: 750,width:"100%", overflow: "hidden", position: "relative", borderRadius: "25px",display:"flex" }}>
                                            {data && mapformat === "heatmap" &&
                                                <Heatmap geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} />
                                            }
                                            {data && mapformat === "choropleth" && <Choropleth geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} />}
                                        </Box>
                                    </CardContent>
                                </>
                            }
                        </Card>
                    </Grid>
                    <Grid item>

                    </Grid>
                </Grid>
            </Container>
            :
            <Typography>Error 404</Typography>
    )
}


export default Clean