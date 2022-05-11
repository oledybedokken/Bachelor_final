import React from 'react'
import { AppBar, Box, Toolbar,FormControlLabel, Container, Button } from '@mui/material'
import Image from 'mui-image';
import MainBar from './MainBar';
import { Link } from 'react-router-dom';
import Error404 from '../../Assets/Error404.jpg'

const Error = () => {
  const backhome = {label:"HOME",path:"/"}

  return (
    <div>
      <MainBar />
      <Container sx={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Error 404: Page not found</h1>
      <p>Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be sure to check your spelling.</p>
      <Image src={Error404} duration={500} width="60%" fit="scale-down"></Image>
      <Button key={backhome.label} to={backhome.path} component={Link} variant="contained" color="primary" sx={{display: "inline-flex",alignItems: "center", pt:"10px",fontSize:"1.5em",whiteSpace:"nowrap",fontWeight:700}} >Back to Home</Button>
      </Container>
      
    </div>
  )
}

export default Error
