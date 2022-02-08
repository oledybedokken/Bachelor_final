import { Container, Typography } from '@mui/material';
import {Link} from 'react-router-dom'
import React from 'react';

const Banner = () => {
  return <Container maxWidth="" sx={{height:"350px",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}} bgcolor="" >
    <Typography>Velkommen til værdata side!</Typography>
    <Typography>Sjekk ut vårt kart!</Typography>
    <Link to="/map">Map</Link>
  </Container>
};

export default Banner;
