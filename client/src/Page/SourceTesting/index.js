import React, { useState,useContext,useEffect } from "react";
import {
  FormGroup,
  FormControl,
  TextField,
  Container,
  Box,
  Button,Autocomplete
} from "@mui/material";
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import SourceTable from "./SourceTable";
import Axios from 'axios';
import { SourceContext } from "../../context/SourceContext";
import SourceFinder from "../../Apis/SourceFinder";
import axios from "axios";
import RenderLineChart from "./RenderLineChart"
const SourceTesting = () => {
const {sources, setSources} = useContext(SourceContext);
const[element,setElement]=useState("")
const[source,setSource]=useState("")
  const [startDato, setStartDato] = useState(new Date("2014-08-18T21:11:54"));
  const [sluttDato, setSluttDato] = useState(new Date("2015-08-18T21:11:54"));
  const [value, setValue] = React.useState([null, null]);
  const handleElement=(newValue)=>{
      setElement(element)
  }
  const handleSource = (newValue)=>{
      setSource(newValue)
  }
  const handleStart = (newValue) => {
    setStartDato(newValue);
  };
  const handleSlutt = (newValue) => {
    setSluttDato(newValue);
  };
  const handleSubmit = ()=>{
    axios.get().then((response)=>{
      console.log(response)
    })
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SourceFinder.get("/sources");
        setSources(response.data.data.plass);
      } catch (error) {}
    };
    if(sources === null){fetchData();}
  }, []);
  return (<>
    <Container maxWidth="md">
      <FormGroup>
      {/*   <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText="Check-in"
        endText="Check-out"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider> */}
    <FormControl>
          <TextField
            id="outlined-helperText"
            label="Element"
            value={element}
            onChange={handleElement}
          />
          {sources &&
          <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={sources.features}
          getOptionLabel={option => option.properties.id}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Source" />}
          onChange={(_event,newSource)=>{
            setSource(newSource)
          }}
        />}
           <Button variant="contained" onClick={()=>handleSubmit()}>Trykk meg for å hente data</Button>
        </FormControl>
      </FormGroup>
    </Container>
    {/* {sources&&
    <SourceTable rows={sources}/>
    } */}
    <RenderLineChart></RenderLineChart>
    </>
    
  );
};

export default SourceTesting;
