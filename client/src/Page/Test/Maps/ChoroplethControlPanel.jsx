import React from 'react'
import {Card,Box,Typography,Slider} from '@mui/material'
const ChoroplethControlPanel = ({steps,selectedTime,selectFormat,setSelectedTime}) => {
    function handleChangeTime(){
        
    }
    return (
        <Card sx={{ backgroundColor: "rgba(33, 43, 54, 0.5)", zIndex: 9, minWidth: "250px", position: "absolute", right: 0, top: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ minWidth: "80%" }}>
                <Typography>Time:{steps[selectedTime]}</Typography>
                <Slider min={0} max={steps.length - 1} value={selectedTime} onChange={handleChangeTime}></Slider>
            </Box>
            <Box>
            </Box>
        </Card>
    )
}

export default ChoroplethControlPanel