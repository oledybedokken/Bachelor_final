import React,{useContext, useEffect} from 'react'
import {Select, MenuItem,InputLabel,OutlinedInput,FormControl } from '@mui/material'
import SsbContext from '../context/SsbContext';
const SortingDropDownMenu = ({fetched}) => {
  const{sorting,setSorting} = useContext(SsbContext);
  const handleChange=index=>event=>{
    let newOptions = sorting.options.slice(0)
    newOptions[index]["value"]=event.target.value
    setSorting((prevState)=>({
      ...prevState,
      options:newOptions
    }))
  }

  const handleContentChange=(event)=>{
    setSorting((prevState)=>({
      ...prevState,
      ContentCode:event.target.value
    }))
  }
  return(
    <>
    {sorting.value!=="NoSortNeeded"&&sorting.options.map((sort,index)=>
    <FormControl sx={{mt:2}} key={sort.value}>
    <InputLabel id="demo-simple-select-helper-label">{sort.value}:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sort.value}
          onChange={handleChange(index)}
          input={<OutlinedInput label={sort.value}/>}
          fullWidth
        >
          {sort.options.map((item) =>{return (<MenuItem value={item} key={item}>{item}</MenuItem>) })}
        </Select></FormControl>
    )}
    {sorting.ContentsCodes.length>1&&
      <FormControl sx={{mt:2}} >
      <InputLabel id="demo-simple-select-helper-label">ContentCodes</InputLabel>
      <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sorting.ContentCode}
          onChange={(e)=>handleContentChange(e)}
          input={<OutlinedInput label={sorting.ContentCode}/>}
          fullWidth
        >{sorting.ContentsCodes.map((item)=>{return(<MenuItem value={item} key={item}>{item}</MenuItem>)})}</Select></FormControl>
      }
    </>
  )
}

export default SortingDropDownMenu