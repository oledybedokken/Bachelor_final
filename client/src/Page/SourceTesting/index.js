import React, { useState,useContext,useEffect } from "react";
import {
  FormGroup,
  FormControl,
  TextField,
  Container,
  Stack,
  Button,Autocomplete
} from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
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
        console.log(response.data.data.plass)
        setSources(response.data.data.plass);
      } catch (error) {}
    };
    if(sources === null){fetchData();}
  }, []);
  return (<>
    <Container maxWidth="md">
      <FormGroup>
        <FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DesktopDatePicker
                label="Start Day"
                inputFormat="MM/dd/yyyy"
                value={startDato}
                onChange={handleStart}
                renderInput={(params) => <TextField {...params} />}
              />
              <DesktopDatePicker
                label="Start Day"
                inputFormat="MM/dd/yyyy"
                value={sluttDato}
                onChange={handleSlutt}
                renderInput={(params) => <TextField {...params} />}
              />
            
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
          </Stack>
          </LocalizationProvider>
        </FormControl>
      </FormGroup>
    </Container>
    {sources&&
    <SourceTable rows={sources}/>
    }
    <RenderLineChart></RenderLineChart>
    </>
    
  );
};

export default SourceTesting;
