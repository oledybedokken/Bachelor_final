import { Box, Typography } from '@mui/material'
import React from 'react'

const ColorBox = ({color,label}) => {
  return (
    <Box width={"100px"} height={"50px"} sx={{backgroundColor:color,display:"flex",alignItems:"center", justifyContent:"center"}}><Typography color="#fff" align="center" variant ="h6">{label}</Typography></Box>
  )
}

export default ColorBox