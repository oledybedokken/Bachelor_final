import { AppBar, Typography, Box, Toolbar, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  const Links = [{ path: "/vaermap", label: "Vær Map" }, { path: "/inntekt", label: "Inntekt" }]
  return (
    <AppBar position="static" sx={{ mb: "10px" }}>
      <Toolbar disableGutters>
        <Typography variant="h5" component="div" sx={{ pl: "2%" }} noWrap>
          MAPPING
        </Typography>
        <Box sx={{ display: 'flex' }}>
          {Links.map((link)=>{
            return(
              <Button component={Link} variant="text" to={link.path} sx={{ color: "#fff",'&:hover':{transform: 'translateY(-0.25em)'}}}>{link.label}</Button>
            )})}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
