import React from 'react'
import { Box, Button, Card, CardHeader, CardMedia, Grid, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SlideShow from './SlideShow'
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {getWeatherGraph} from '../../../Apis/Queries'
import SsbWaveChart from '../../../Components/Chart/SsbWaveChart';
import ReactApexChart from 'react-apexcharts';
const SecondSection = ({colorMode}) => {
    const { data, isLoading, isFetching, isError, error } = useQuery("weatherGraph",getWeatherGraph);
    function createxAxis(){
        const series = [{
            name:"Bjorli",
            data:data.graph_values.map((weatherValue)=>weatherValue.value)
        }]
        const xAxis = {
            
        }
        const options= {
            chart: {
              height: 350,
              type: 'area'
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth'
            },
            xaxis: {
                type:'datetime',
                categories:data.graph_values.map((weatherValue)=>weatherValue.time)
            },
            tooltip: {
              x: {
                format: 'yyyy/MM'
              },
            },
          };
        return {series:series, options:options}
    }
    return (
        <>  
           <SlideShow></SlideShow>
            <Grid container spacing={4} alignItems="center" sx={{py:"5%"}}>
                <Grid item xs={6}>
                    {isLoading || isFetching?
                        <Typography>Loading graph</Typography>:
                    <Card>
                        <CardHeader title="Bjorli : Mean(air_temperature P1M)"></CardHeader>
                        <ReactApexChart series={createxAxis().series} height="300px" options={createxAxis().options} />
                    </Card>}
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
                        <Button component={Link} to="/weather" variant={colorMode==="dark"?"outlined":"contained"} color="secondary" size="large" sx={{ borderRadius: "25px" }} endIcon={<ArrowForwardIcon />}>
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