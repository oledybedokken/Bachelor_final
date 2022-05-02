import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
const Switch = ({setVersion,version}) => {
    const handleChange = (event, newAlignment) => {
        setVersion(newAlignment);
      };
      
  return (
    <ToggleButtonGroup exclusive value={version} onChange={handleChange} color={'primary'}>
        <ToggleButton value="advanced">
          ADVANCED
        </ToggleButton>
        <ToggleButton value="simple">
          SIMPLE
        </ToggleButton>
      </ToggleButtonGroup>
  )
}

export default Switch