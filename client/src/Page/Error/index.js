import React from 'react'
import { Container, Button } from '@mui/material'
import Image from 'mui-image';
import MainBar from './MainBar';
import { Link } from 'react-router-dom';
import Error404 from '../../Assets/Error404.jpg'

const Error = ({errorCode=404}) => {
  const backhome = {label:"HOME",path:"/"}
  return (
    <div>
      <MainBar />
      <Container sx={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {errorCode===404}{<h1>Error {errorCode} not found</h1>}
        {errorCode===400}{<h1>Error {errorCode} bad request</h1>}
        {errorCode===500}{<h1>{errorCode}Internal Server Error</h1>}
      
      <p>Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be sure to check your spelling.</p>
      <p>Or maybe even SSB dosent provide for this.</p>
      <Image src={Error404} duration={500} width="60%" fit="scale-down"></Image>
      <Button key={backhome.label} to={backhome.path} component={Link} variant="contained" color="primary" sx={{display: "inline-flex",alignItems: "center", pt:"10px",fontSize:"1.5em",whiteSpace:"nowrap",fontWeight:700}} >Back to Home</Button>
      </Container>
      
    </div>
  )
}

export default Error
