import React,{useContext} from 'react'
import {Select, MenuItem,InputLabel,OutlinedInput,FormControl } from '@mui/material'
import SsbContext from '../context/SsbContext';
const SortingDropDownMenu = ({fetched}) => {
  const{sorting,setSorting} = useContext(SsbContext);
  const handleChange=(event)=>{
    setSorting((prevState)=>({
      ...prevState,
      value:event.target.value
    }))
  }
  return (
    <>
      {Object.entries(sorting.options).map(([key, values]) => (
        <FormControl sx={{mt:2}} key={key}>
        <InputLabel id="demo-simple-select-helper-label">{key}:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sorting.value}
          onChange={(e)=>handleChange(e)}
          input={<OutlinedInput label={key}/>}
          fullWidth
        >
          {values.map((item) =>{return (<MenuItem value={item} key={item}>{item}</MenuItem>) })}
        </Select></FormControl>))}
    </>
  )
}

export default SortingDropDownMenu