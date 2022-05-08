import React, { useContext } from 'react'
import { Select, MenuItem, InputLabel, OutlinedInput, FormControl, Box, Checkbox, FormControlLabel } from '@mui/material'
import { SsbContext } from '../Context/SsbContext';
const SortingDropDownMenu = () => {
  const { sorting, setSorting, options, customFilter, setCustomFilter, mapformat } = useContext(SsbContext);
  const handleChange = (event, index, newId) => {
    let newSort = sorting.options[sorting.id]
    newSort[newId] = event.target.value
    const newIndex = sorting.options.findIndex((valuee) => ((JSON.stringify(Object.values(valuee)) === (JSON.stringify(Object.values(newSort))))));
    setSorting({ ...sorting, id: newIndex });
  }
  const handleContentChange = (event) => {
    setSorting((prevState) => ({
      ...prevState,
      contentCodeIndex: event.target.value
    }))
  }
  const handleCheckBoxChange = (e) => {
    setCustomFilter({ showZero: !customFilter.showZero })
  }
  return (
    <><Box sx={{ maxWidth: "100%" }}>
      {options.options && options.options.map((listOfSorts, index) => {
        return (
          <Box>
            <FormControl sx={{ mt: 2 }} key={listOfSorts.id}>
              <InputLabel id="demo-simple-select-helper-label">{listOfSorts.id}:</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sorting.options[sorting.id]}
                onChange={(e) => handleChange(e, index, listOfSorts.id)}
                input={<OutlinedInput label={listOfSorts.id} />}
                fullWidth
              >
                {listOfSorts.options.map((item) => { return (<MenuItem value={item} key={item}>{item}</MenuItem>) })}
              </Select></FormControl>
          </Box>
        )
      })}

      {options.ContentsCodes.length > 1 &&
        <FormControl sx={{ mt: 2, maxWidth: "100%" }} >
          <InputLabel id="demo-simple-select-helper-label">ContentCodes</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sorting.contentCodeIndex}
            onChange={(e) => handleContentChange(e)}
            input={<OutlinedInput label="Contentcode" />}
            fullWidth
          >{options.ContentsCodes.map((item, index) => { return (<MenuItem value={index} key={index}>{item.label}</MenuItem>) })}</Select></FormControl>
      }
      {mapformat === "choropleth" &&
        <Box>
          <FormControlLabel control={<Checkbox
            checked={customFilter.showZero}
            onChange={(e) => handleCheckBoxChange(e)}
            inputProps={{ 'aria-label': 'controlled' }}
          />} label="Show values with zero" />
        </Box>
      }
    </Box>
    </>
  )
}
export default SortingDropDownMenu