import { Box } from '@mui/material'
import React from 'react'
import ColorBox from './ColorBox'
const ChoroplethPalette = ({colors,fullScreen}) => {
  return (
    <Box sx={{height:"100%",width:"60px",ml:fullScreen?"1%":"1%",mt:fullScreen?"0":"11%"}}>
    {colors.map((color)=><ColorBox color={color.color} key={color.label} label={color.label}/>)}
    </Box>
  )
}

export default ChoroplethPalette