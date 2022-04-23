import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import ColorBox from '../../Components/ColorBox'
import { SketchPicker } from 'react-color'

const Palette = () => {
    const colors =[{label:"NO DATA",color:"#121212"},{label:"0%",color:"hsl(0, 100%, 24%)"},{label:"20%",color:"hsl(4, 100%, 40%)"},{label:"40%",color:"hsl(11, 91%, 49%)"},{label:"60%",color:"hsl(16, 99%, 59%)"},{label:"80%",color:"hsl(21, 100%, 67%)"},{label:"100%",color:"hsl(29, 100%, 74%)"}]
    const [colorPick, setColorPick] = useState("#fff");
    const [showColorPicker, setShowColorPicker] = useState(false);

    return (
      <>
      {colors &&
    <Grid display="flex" flexDirection={"column"}>{colors.map((input)=>{
        return(
        <Grid item key={input.label} onClick = {() => setShowColorPicker(showColorPicker => !showColorPicker)}>
            <ColorBox color={input.color} label={input.label} onChange = {updateColor => setColorPick(updateColor)}></ColorBox>
        </Grid>)
    })}</Grid>}
    {!showColorPicker && (
      <SketchPicker />
    )}
    </>
  )
}

export default Palette