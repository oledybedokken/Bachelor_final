import React from 'react'
import { Box, Card, CardHeader } from '@mui/material'
import CleanGraphs from '../Page/Ssb/Maps/Layout/CleanGraphs';
import MultiCityGraph from '../Page/Ssb/Maps/Layout/MultiCityGraph';
import CloseIcon from '@mui/icons-material/Close';
function SideBar({ data, chosenRegion,sideBarStatus,setSideBarStatus }) {
    function createString(){
        const str=''
        console.log(chosenRegion.map((region)=>{return region.Region}))
    }
    return (<Box sx={{
        top: 0,
        bottom: 0,
        right: 0,
        width: "50vw",
        height: "100vh",
        position: "absolute",
    }}><Box sx={{paddingLeft:"50px",cursor:"pointer"}}><CloseIcon onClick={()=>setSideBarStatus(false)}/></Box>
        <Box sx={{ display: "flex", justifyContent: "center",flexDirection:"column",alignItems:"center",height:"95%" }}>
            <CleanGraphs data={data.geoJson} region={chosenRegion[0].Region} chosenRegion={chosenRegion}/>
        </Box>
    </Box>);
}

export default SideBar
