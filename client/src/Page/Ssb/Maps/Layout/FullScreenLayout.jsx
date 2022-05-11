import React, { useContext } from 'react'
import { Box, Card, CardContent, CardHeader, Container, Drawer, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import SortingDropDownMenu from '../../../../Components/SortingDropDownMenu';
import { SsbContext } from '../../../../Context/SsbContext';
import Heatmap from '../Heatmap';
import Choropleth from '../Choropleth';
import { ColorModeContext } from '../../../../Context/ColorModeContext';
import NewDrawer from '../../../../Components/NewDrawer';
import { UserSettingsContext } from '../../../../Context/UserSettingsContext'
import SsbWaveChart from '../../../../Components/chart/SsbWaveChart';
import CleanGraphs from './CleanGraphs';
const FullScreenLayout = ({ id, data, max, min }) => {
    const { fullScreen, timeSettings, playSpeed, setTimeSettings, setPlaySpeed, chosenRegion, setChosenRegion } = useContext(UserSettingsContext)
    const { mapformat } = useContext(SsbContext);
    const colorMode = useContext(ColorModeContext);
    console.log(chosenRegion)
    return (
        <>
            <Container disableGutters maxWidth="" display="flex" sx={{ flexDirection: "row" }}>
                <Box
                    sx={{
                        width: chosenRegion.length > 0 ? "50vw" : "100vw",
                        height: "100vh",
                        display: "flex"
                    }}
                >
                    {data && mapformat === "heatmap" &&
                        <Heatmap geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} max={max} min={min} setPlaySpeed={setPlaySpeed} setTimeSettings={setTimeSettings} />
                    }
                    {data && mapformat === "choropleth" && <Choropleth geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} setTimeSettings={setTimeSettings} />}
                </Box>
                {chosenRegion.length > 0 &&
                    <Box sx={{
                        top: 0,
                        bottom: 0,
                        right: 0,
                        width: "50vw",
                        height: "100vh",
                        position:"absolute"
                    }}>
                        <CleanGraphs data={data.geoJson} region={chosenRegion[0].Region}/>
                    </Box>}
            </Container>
        </>
    )
}
export default FullScreenLayout