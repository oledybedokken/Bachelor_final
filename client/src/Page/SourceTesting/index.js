import React, { useState } from "react";
import {
  FormGroup,
  FormControl,
  TextField,
  Container,
  Stack,
  Button
} from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import SourceTable from "./SourceTable";
import Axios from 'axios';

const SourceTesting = () => {
const[element,setElement]=useState("")
const[source,setSource]=useState("")
  const [startDato, setStartDato] = useState(new Date("2014-08-18T21:11:54"));
  const [sluttDato, setSluttDato] = useState(new Date("2015-08-18T21:11:54"));
  const [Sources,setSources] = useState(null)
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
          <TextField
            id="outlined-helperText"
            label="Source"
            value={source}
            onChange={handleSource}
          ></TextField>
           <Button variant="contained">Trykk meg for å hente data</Button>
          </Stack>
          </LocalizationProvider>
        </FormControl>
      </FormGroup>
    </Container>
    {Sources&&
    <SourceTable source={Sources}/>
    }
    </>
  );
};

export default SourceTesting;
