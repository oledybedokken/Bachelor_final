import { AppBar, Typography,Box,Toolbar,Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <AppBar position="static" sx={{mb:"10px"}}>
       <Toolbar disableGutters>
      <Typography variant="h5" component="div" sx={{ pl: "2%" }} noWrap>
        MAPPING
      </Typography>
      <Box sx={{ display: 'flex'}}>
        <Button component={Link} variant ="text" to="/inntekt" sx={{color:"#fff"}}>INNTEKT</Button>
        <Button component={Link} to="/vaermap" variant="text" sx={{color:"#fff"}}>Vær Map</Button>
      </Box>
      
      </Toolbar>
    </AppBar>
  );
};

export default Header;
