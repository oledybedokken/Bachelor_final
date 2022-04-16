import React from 'react'
import {FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'
const MapFormat = ({mapFormatSelect,setMapFormatSelect}) => {
    const handleChange = (event) => {
        setMapFormatSelect(event.target.value);
      };
    return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Visualisation</FormLabel>
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={mapFormatSelect}
        name="radio-buttons-group"
        value={mapFormatSelect}
        onChange={handleChange}>
        <FormControlLabel value="heatmap" control={<Radio />} label="Heatmap" />
        <FormControlLabel value="choropleth" control={<Radio />} label="Choropleth" />
        </RadioGroup>
    </FormControl>
  )
}

export default MapFormat