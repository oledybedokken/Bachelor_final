import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import PersonIcon from '@mui/icons-material/Person';
const FirstNavigation = () => {
  return (
      <Box sx={{ display: "flex", justifyContent: "space-evenly",width:"50%",mt:5}}>
        <Button variant="contained" sx={{borderRadius: "35px",fontWeight:700,fontSize:"2em"}} size="large" color="secondary" endIcon={<PersonIcon />}>SSB
        </Button>
        <Button variant="contained" sx={{ borderRadius: "35px",fontWeight:700,fontSize:"2em"}} size="large" color="secondary" endIcon={<CloudIcon />}>MET
        </Button>
        <Box sx={{ width: "100px", height: "100px" }}></Box>
      </Box>
  )
}

export default FirstNavigation 