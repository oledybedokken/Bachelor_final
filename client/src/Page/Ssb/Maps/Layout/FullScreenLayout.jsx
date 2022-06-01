import React, { useContext } from 'react'
import { Box, Container} from '@mui/material'
import { SsbContext } from '../../../../Context/SsbContext';
import Heatmap from '../Heatmap';
import Choropleth from '../Choropleth';
import { ColorModeContext } from '../../../../Context/ColorModeContext';
import { UserSettingsContext } from '../../../../Context/UserSettingsContext'
import SideBar from '../../../../Components/SideBar';
const FullScreenLayout = ({ id, data, max, min }) => {
    const {  timeSettings, playSpeed, setTimeSettings, setPlaySpeed, chosenRegion,setSideBarStatus,sideBarStatus } = useContext(UserSettingsContext)
    const { mapformat } = useContext(SsbContext);
    const colorMode = useContext(ColorModeContext);
    return (
        <>
            <Container disableGutters maxWidth="" display="flex" sx={{ flexDirection: "row" }}>
                <Box
                    sx={{
                        width: sideBarStatus ? "50vw" : "100vw",
                        height: "100vh",
                        display: "flex"
                    }}
                >
                    {data && mapformat === "heatmap" &&
                        <Heatmap geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} max={max} min={min} setPlaySpeed={setPlaySpeed} setTimeSettings={setTimeSettings} />
                    }
                    {data && mapformat === "choropleth" && <Choropleth geoJson={data.geoJson} colorMode={colorMode} timeSettings={timeSettings} playSpeed={playSpeed} setTimeSettings={setTimeSettings} />}
                </Box>
                {sideBarStatus&&chosenRegion.length > 0 &&
                    <SideBar data={data} chosenRegion={chosenRegion} sideBarStatus={sideBarStatus} setSideBarStatus={setSideBarStatus}/>}
            </Container>
        </>
    )
}
export default FullScreenLayout
  