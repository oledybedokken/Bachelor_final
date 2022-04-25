import React, {useContext } from 'react'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material'
import { SsbContext } from '../Context/SsbContext';
const MapFormat = () => {
  const {mapformat,setMapformat} = useContext(SsbContext);
  const handleChange = (event) => {
    setMapformat(event.target.value);
  };
  
  return (
    <>
      <Typography variant="h5">Choose Mapstyle:</Typography>
      <FormControl >
        <FormLabel color="secondary" id="demo-radio-buttons-group-label">Visualisation</FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="heatmap"
          name="radio-buttons-group"
          value={mapformat}
          onChange={handleChange}
          row>
          <FormControlLabel value="heatmap" control={<Radio color="secondary" />} label="Heatmap" />
          <FormControlLabel value="choropleth" control={<Radio color="secondary" />} label="Choropleth" />
        </RadioGroup>
      </FormControl>
    </>
  )
}
export default MapFormat