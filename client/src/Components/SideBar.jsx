import React from 'react'
import { Box, Card, CardHeader } from '@mui/material'
import CleanGraphs from '../Page/Ssb/Maps/Layout/CleanGraphs';
import MultiCityGraph from '../Page/Ssb/Maps/Layout/MultiCityGraph';
function SideBar({ data, chosenRegion }) {
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
    }}>
        <Box sx={{ display: "flex", justifyContent: "center",flexDirection:"column",alignItems:"center" }}>
            <CleanGraphs data={data.geoJson} region={chosenRegion[0].Region} />
            {chosenRegion.length > 1 &&
                <Card>
                    <CardHeader title={"Area chart comparison"} subheader={createString()}></CardHeader>
                    <MultiCityGraph/>
                </Card>
            }
        </Box>
    </Box>);
}

export default SideBar
