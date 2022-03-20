import { Box, Grid } from '@mui/material'
import { height } from '@mui/system'
import React from 'react'
import ColorBox from '../../Components/ColorBox'
const Palette = () => {
    const colors =[{label:"NO DATA",color:"#000000"},{label:"0%",color:"hsl(0, 100%, 24%)"},{label:"20%",color:"hsl(4, 100%, 40%)"},{label:"40%",color:"hsl(11, 91%, 49%)"},{label:"60%",color:"hsl(16, 99%, 59%)"},{label:"80%",color:"hsl(21, 100%, 67%)"},{label:"100%",color:"hsl(29, 100%, 74%)"}]
  return (
      <>
      {colors &&
    <Grid display="flex" flexDirection={"column"}>{colors.map((input)=>{
        return(
        <Grid item key={input.label}>
            <ColorBox color={input.color} label={input.label}></ColorBox>
        </Grid>)
    })}</Grid>}
    </>
  )
}

export default Palette