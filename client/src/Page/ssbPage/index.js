import { Box, Container, TextField, Typography,Button } from '@mui/material'
import React, { useState } from 'react'

const mainssb = () => {
  const [dataset,setDataSet] = useState(null)
  
  return (
    <>
    <Container maxWidth="">
    <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
    <Typography variant="h4">WELCOME TO SSB DATA VISUALISATION</Typography>
    <Typography>Choose Dataset and visulasize all the data SSB have to offer</Typography>
    <Typography>Her er link til dataset<a href="https://data.ssb.no/api/">Link</a></Typography>
    <TextField id="outlined-basic" label="Link til dataset JSON-STAT" variant="outlined" fullWidth />
    <Button>Vis visualisering metoder for valgt dataset</Button>
    </Box>
    </Container>
    </>
  )
}

export default mainssb;