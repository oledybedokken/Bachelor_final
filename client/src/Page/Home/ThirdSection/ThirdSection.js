import React from 'react'
import { Box, Button, Card, CardMedia, Container, Grid, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
const ThirdSection = () => {
    return (
        <Grid container spacing={4} alignItems="center" justifyContent={"center"} sx={{ py: "5%" }}>
            <Grid item xs={6}>
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", gap: "25px", pl: "5%" }}>
                    <Typography variant="h4" fontWeight={700}>SSB - ANALYZE THE PEOPLE!</Typography>
                    <Typography sx={{ fontSize: "1.2rem", pr: "20%",lineHeight: "30px" }}>Ssb.no is the biggest statistics data provider for norway.

                        With no experience using json or excel it can be quite hard to understand some of the data until now!

                        Our ssb visualisation tool is here to make every understand the data provided by ssb.

                        Choose dataset for muncipilacity or county and watch the magic happend!
                    </Typography>
                    <Box>
                        <Button variant="outlined" color="secondary" size="large" sx={{ borderRadius: "25px" }} endIcon={<ArrowForwardIcon />}>
                            Explore Weather!
                        </Button>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={6} sx={{ position: "relative", height: "500px", display: "flex", }}>
                <Box sx={{ backgroundColor: "black", height: "200px", width: "270px", position: "absolute", left: "15%", mt: "16%", zIndex: 'modal' }}>
                    <Card>
                        <CardMedia src="https://images.pexels.com/photos/938580/pexels-photo-938580.jpeg?cs=srgb&dl=pexels-deva-darshan-938580.jpg&fm=jpg" component="img" height="200px"></CardMedia>
                    </Card>
                </Box>
                <Box sx={{ height: "270px", width: "320px", position: "absolute", left: "37%", mt: "13%", zIndex: 'tooltip' }}>
                    <Card>
                        <CardMedia src="https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?cs=srgb&dl=pexels-bruno-salvadori-2269872.jpg&fm=jpg" component="img" height="270px"></CardMedia>
                    </Card>
                </Box>
                <Box sx={{ backgroundColor: "black", height: "200px", width: "270px", position: "absolute", left: "65%", mt: "16%", zIndex: 'modal' }}>
                    <Card>
                        <CardMedia src="https://images.pexels.com/photos/10850673/pexels-photo-10850673.jpeg?cs=srgb&dl=pexels-abel-kayode-10850673.jpg&fm=jpg" component="img" height="200px"></CardMedia>
                    </Card>
                </Box>
            </Grid>

        </Grid>
    )
}

export default ThirdSection