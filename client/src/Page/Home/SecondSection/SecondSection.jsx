import React from 'react'
import { Box, Button, Card, CardMedia, Grid, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SlideShow from './SlideShow'

const SecondSection = ({colorMode}) => {
    return (
        <>  
           <SlideShow></SlideShow>
            <Grid container spacing={4} alignItems="center" sx={{py:"5%"}}>
                <Grid item xs={6}>
                    <Card>
                        <CardMedia component="img"
                        height="300px"
                        fit="fill"
                            image="
                            https://datavizproject.com/wp-content/uploads/2015/10/1-Line-Chart.png
                            "
                            alt="green iguana">
                        </CardMedia>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", height:"100%",justifyContent:"center",gap:"25px" }}>
                        <Typography variant="h4" fontWeight={700}>WEATHER</Typography>
                        <Typography sx={{fontSize:"1.2rem",pr:"20%"}}>Norway is know for being cold and full of snow during the
                            Winter. The wind can be battering and hard to fight against.
                            But have you ever wondered how cold and windy it really gets?
                            Take a trip down memory lane with us visualize the weather for the last 30 years.
                        </Typography>
                        <Box>
                        <Button variant={colorMode==="dark"?"outlined":"contained"} color="secondary" size="large" sx={{ borderRadius: "25px" }} endIcon={<ArrowForwardIcon />}>
                            Explore Weather!
                        </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default SecondSection
/* 
import { Box, Card, CardContent, CardMedia, Grid } from '@mui/material'

import CardSecond from './CardSecond'<Grid container>
            <Grid item xs={8} spacing={2} container direction="row" justifyContent="center"
                alignItems="center">
                {cards.map((elementInfo) => {
                    return (
                        <Grid item xs={4}>
                            <CardSecond elementInfo={elementInfo} />
                        </Grid>
                    )
                })}
            </Grid>
            <Grid item xs={6}>

            </Grid>
        </Grid> */