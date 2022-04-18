import React from 'react';
import { AppBar, Toolbar, Grid, Typography, Box } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import Image from 'mui-image'
import { Link } from 'react-router-dom';
const Footer = () => {
    const handleSubmit = (e, url) => {
        e.preventDefault();
        if (url) { window.open(url); }
    }
    return <AppBar position="static" color="transparent">
        <Toolbar>
            <Grid container justifyContent="space-around" alignItems={"center"}>
                <Grid item alignItems="center" sx={{ pt: 1 }}><Typography align='center' variant='h6'>@{(new Date().getFullYear())} DATAVIZ</Typography></Grid>
                <Grid item><Typography>Special thanks to: <span style={{cursor:"pointer",fontWeight:600}} onClick={(e)=>handleSubmit(e,"https://www.ssb.no/")}>Statistisk sentralbyrå (SSB)</span> and <span style={{cursor:"pointer",fontWeight:600}} onClick={(e)=>handleSubmit(e,"https://www.ssb.no/")}>Met.Api.no</span></Typography></Grid>
                <Grid item sx={{ pt: 1 }}><Typography sx={{ fontSize: 18 }}>Need any help? Checkout: <Link to="/help" style={{color:"#fff"}}>HELP</Link></Typography></Grid>
            </Grid>
        </Toolbar>
    </AppBar>;
};

export default Footer;