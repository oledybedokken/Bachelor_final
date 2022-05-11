import React from 'react'
import { data } from './data'
import { ColorModeContext } from '../../../Context/ColorModeContext';
import {Accordion, AccordionDetails, AccordionSummary, Actions} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components'



const FAQ = () => {

  const colorMode = React.useContext(ColorModeContext);

  return (
    <div>
      {data.map((item) => (
        <Accordion sx={{backgroundColor: colorMode.mode === "dark" ? "#212B36" : "#d6f5f5"}}>
          <AccordionSummary sx={{display: "flex", justifyContent: "center"}} expandIcon={<ExpandMoreIcon />} >
            <h3>{item.question}</h3>
          </AccordionSummary>
          <AccordionDetails sx={{display: "flex", justifyContent: "center"}}>
            <h6>{item.answer}</h6>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default FAQ
