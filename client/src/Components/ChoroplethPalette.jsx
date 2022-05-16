import { Box } from '@mui/material'
import React from 'react'
import ColorBox from './ColorBox'
const ChoroplethPalette = ({colors}) => {
  return (
    <Box>
    {colors.map((color)=><ColorBox color={color.color} key={color.color} label={color.label}/>)}
    </Box>
  )
}

export default ChoroplethPalette