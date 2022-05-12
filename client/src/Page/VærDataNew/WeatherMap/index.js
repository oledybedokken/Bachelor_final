import { Box } from '@mui/material'
import React from 'react'
import MapDisplay from './MapDisplay'

const WeatherMap = () => {
    return (
        <Box sx={{ width: "100vw", height: "100vh" }}>
            <MapDisplay/>
        </Box>
    )
}

export default WeatherMap