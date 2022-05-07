import React from 'react'
import { data } from './data'
/* import Accordion from '@mui/material/Accordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps,} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails'; */
import {Accordion, AccordionDetails, AccordionSummary, Actions} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components'
import {IconContext} from 'react-icons'
import {FiPlus, FiMinus} from 'react-icons/fi'


const FAQ = () => {
  return (
    <div>
      {data.map((item) => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
