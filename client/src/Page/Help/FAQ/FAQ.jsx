import React from 'react'
import { data } from './data'
import { ColorModeContext } from '../../../Context/ColorModeContext';
import {Accordion, AccordionDetails, AccordionSummary, Actions} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components'
import {IconContext} from 'react-icons'
import {FiPlus, FiMinus} from 'react-icons/fi'


const FAQ = () => {

  const colorMode = React.useContext(ColorModeContext);

  return (
    <div>
      {data.map((item) => (
        <Accordion sx={{backgroundColor: colorMode.mode === "dark" ? "#212B36" : "#1976d2"}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            <h1>{item.question}</h1>
          </AccordionSummary>
          <AccordionDetails>
            <h6>{item.answer}</h6>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default FAQ
