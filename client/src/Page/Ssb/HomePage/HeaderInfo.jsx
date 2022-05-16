import {  Box,  Card,  Grid, Typography } from '@mui/material'
import React from 'react'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CountUp from 'react-countup';
const HeaderInfo = ({ allDataSets }) => {
    function calculateCount(id) {
        if (allDataSets) {
            const totalDataSets = allDataSets.filter(item => item.path.split("/")[1]===id);
            return totalDataSets.length
        }
    }
    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center", flexDirection: "column" }}>
                <Typography variant="h3" >
                    Welcome to Ssb visualisation tool!
                </Typography>
                <Typography>
                    Visualise any of the most popular datasets provide by SSB.
                </Typography>
            </Box>
            {allDataSets&&
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Card sx={{ bgcolor: "primary.light", color: "primary.dark", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", py: 3 }}>
                        <Box sx={{ borderRadius: "50%", backgroundColor: "primary.lighter", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}><AttachMoneyIcon color={"primary.darker"} /></Box>
                        <Typography variant="h5"><CountUp end={calculateCount("al")}/></Typography>
                        <Typography variant="subtitle2">Arbeid og lønn</Typography>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card sx={{ bgcolor: "secondary.light", color: "secondary.dark", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", py: 3 }}>
                        <Box sx={{ borderRadius: "50%", bgcolor: "secondary.lighter", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}><AttachMoneyIcon color={"secondary.darker"} /></Box>
                        <Typography variant="h5"><CountUp end={calculateCount("be")}/></Typography>
                        <Typography variant="subtitle2">Befolkning</Typography>
                    </Card>

                </Grid>
                <Grid item xs={3}>
                    <Card sx={{ bgcolor: "warning.light", color: "warning.dark", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", py: 3 }}>
                        <Box sx={{ borderRadius: "50%", bgcolor: "warning.lighter", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}><AttachMoneyIcon color={"warning.darker"} sx={{ textAlign: "center" }} /></Box>
                        <Typography variant="h5"><CountUp end={calculateCount("he")}/></Typography>
                        <Typography variant="subtitle2">Helse</Typography>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card sx={{ bgcolor: "error.light", color: "error.dark", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", py: 3 }}>
                        <Box sx={{ borderRadius: "50%", bgcolor: "error.lighter", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}><AttachMoneyIcon color={"error.darker"} /></Box>
                        <Typography variant="h5"><CountUp end={calculateCount("sk")}/></Typography>
                        <Typography variant="subtitle2">Utdanning</Typography>
                    </Card>
                </Grid>
            </Grid>
}
        </>
    )
}

export default HeaderInfo