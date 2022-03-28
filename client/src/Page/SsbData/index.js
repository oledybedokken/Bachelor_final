import { Container, TextField, Typography } from '@mui/material'
import React from 'react'

const SsbData = () => {
  return (
      <>
      <Container sx={{justifyContent:"center",display:"flex",flexDirection:"column"}}>
    <Typography variant="h4">Welcome to ssb visualisation toolkit</Typography>
    <Typography>Velg data set:</Typography>
    <Typography>Kommuner:<a href="https://data.ssb.no/api/?tags=kommuner">Velg data set</a></Typography>
    <TextField id="outlined-basic" label="Ssb Json Link" variant="outlined" />
    </Container>
    </>
  )
}

export default SsbData