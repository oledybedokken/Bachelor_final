import React, { useContext } from 'react'
import { Box, Card, CardContent, CardHeader, Container, Drawer, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import SortingDropDownMenu from '../../../../Components/SortingDropDownMenu';
import { SsbContext } from '../../../../Context/SsbContext';
import Heatmap from '../Heatmap';
import Choropleth from '../Choropleth';
import { ColorModeContext } from '../../../../Context/ColorModeContext';
import NewDrawer from '../../../../Components/NewDrawer';
const FullScreenLayout = ({ id, data, timeSettings, playSpeed, setTimeSettings, max, min, setPlaySpeed }) => {
    const { mapformat } = useContext(SsbContext);
    const colorMode = useContext(ColorModeContext);
    return (
        <>
            <Container disableGutters maxWidth="">
                <Box
                    sx={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                    }}
                >
                    {data && mapformat === "heatmap" &&
                        <Heatmap geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} max={max} min={min} setPlaySpeed={setPlaySpeed} setTimeSettings={setTimeSettings}/>
                    }
                    {data && mapformat === "choropleth" && <Choropleth geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} setTimeSettings={setTimeSettings} />}
                </Box>
            </Container>
        </>
    )
}
export default FullScreenLayout
/*                        {mapformat === "choropleth" &&
        <Card>
            <CardHeader title="Color Picker" sx={{ cursor: "pointer" }} onClick={() => setShowColorPicker(!showColorPicker)}></CardHeader>
            <CardContent sx={{ display: showColorPicker === true ? "flex" : "none", justifyContent: "center", cursor: "pointer" }}>
                <Box>
                    <Palette />
                </Box>
            </CardContent>
        </Card>} 
        <>
            <Container maxWidth="" sx={{ mt: "50px" }}>
                <Box
                    sx={{
                        width: sidebarStatus ? "50vw" : "100vw",
                        height: "100vh",
                        display: "flex",
                    }}
                >
                    <Grid container direction={"row"} justifyContent="center" alignItems="center" spacing={3}>
                        <Grid item >
                            <Card sx={{ maxWidth: "300px" }}>
                                <CardHeader title="Sorting"></CardHeader>
                                <CardContent>
                                    <SortingDropDownMenu></SortingDropDownMenu>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card>
                                <CardHeader title={mapformat.charAt(0).toUpperCase() + mapformat.slice(1) + " - " + id.title} />
                                <CardContent>
                                    <Box sx={{ zIndex: 0, height: 750, overflow: "hidden", position: "relative", borderRadius: "25px" }}>
                                        {data && mapformat === "heatmap" &&
                                            <Heatmap geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} />
                                        }
                                        {data && mapformat === "choropleth" && <Choropleth geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} />}
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
                                            name="radio-buttons-group"
                                            onChange={(e) => setTimeSettings(e.target.value)}>
                                            <FormControlLabel value="slider" control={<Radio />} label="Slider" />
                                            <FormControlLabel value="dropdown" control={<Radio />} label="Dropdown" />
                                            <FormControlLabel value="controller" control={<Radio />} label="Controller" />
                                            {timeSettings === "controller" && <><TextField
                                                onChange={(e) => {
                                                    var value = parseInt(e.target.value);
                                                    console.log(value)
                                                    if (value > max) value = 10;
                                                    if (value < min) value = 1;
                                                    setPlaySpeed(value);
                                                }}
                                                id="standard-number"
                                                label="Play speed(ms)"
                                                InputProps={{
                                                    inputProps: {
                                                        max: 10, min: 1
                                                    }
                                                }}
                                                size="small"
                                                type="number"
                                                sx={{ width: "100px" }}
                                                variant="standard"
                                                value={playSpeed}
                                            /></>}
                                        </RadioGroup>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>*/