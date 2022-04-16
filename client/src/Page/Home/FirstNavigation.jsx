import React from 'react';
import {Box,Button, Typography} from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
const FirstNavigation = () => {
  return (
    <Box sx={{display:"flex", justifyContent:"center"}}>
        <Button component="div" sx={{backgroundColor:"secondary.main",height:"100px", width:"100px"}} >
            <Typography>SSB</Typography>
        </Button>
        <Button component="div" sx={{backgroundColor:"secondary.main"}}>
        <Typography>WEATHER</Typography>
        <CloudIcon color="#fff"></CloudIcon>
        </Button>
    </Box>
  )
}

export default FirstNavigation