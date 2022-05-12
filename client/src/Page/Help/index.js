import React, { useContext, useState } from 'react'
import { Container, TextField, Typography, Button, Box, Autocomplete, Checkbox, FormControlLabel } from '@mui/material'
import mainpageBackground from "../../Assets/mainpageBackground.png";
import { ColorModeContext } from '../../Context/ColorModeContext';
import MainBar from './MainBar';
import SortingDropDownMenu from '../../Components/SortingDropDownMenu';
import FAQ from './FAQ/FAQ'
import Guide from './Guide/Guide';

const Help = () => {
  const [faq, setFAQ] = useState(false);
  const [guide, setGuide] = useState(false);
  const colorMode = useContext(ColorModeContext);
  console.log(faq);
  

  const faqclicked = () => {
    setFAQ((faq) => true)
    
    if(guide === true){
      setGuide((guide) => false)
    }
  }

  const guideclicked = () => {
    setGuide((guide) => true)
    if (faq === true){
      setFAQ((faq) => false)
    }
  }

  const backclicked = () => {
    setFAQ((faq) => false)
    setGuide((guide) => false)
  }

  const show = () => {
    if (faq && !guide) {
      return (
        <Box sx={{justifyContent:"center"}}>
          <FAQ />
          <br />
          <Button onClick={backclicked} sx={{backgroundColor:"#1976d2",fontSize:"100px",color:"white",whiteSpace:"nowrap",":hover":{color:"#fff"},fontWeight:700}}>Back to help</Button>
        </Box>
      )
    } else if(!faq && guide){
      return (
        <Box sx={{justifyContent:"center"}}>
          <Guide />
          <Button onClick={backclicked} sx={{backgroundColor:"#1976d2",fontSize:"100px",color:"white",whiteSpace:"nowrap",":hover":{color:"#fff"},fontWeight:700}}>Back to help</Button>
        </Box>
      )
    } else if(!faq && !guide){
      return(
      <Box sx={{display:"flex",justifyContent:"space-around"}}>
        <Button onClick={guideclicked} sx={{backgroundColor:"#1976d2",fontSize:"100px",color:"white",whiteSpace:"nowrap",":hover":{color:"#fff"},fontWeight:700}}>Guide</Button>
        <Button onClick={faqclicked} sx={{backgroundColor:"#1976d2",fontSize:"100px",color:"white",whiteSpace:"nowrap",":hover":{color:"#fff"},fontWeight:700}}>FAQ</Button>
      </Box>
      )
    }
  }

  return (
    <>
        <Container maxWidth="xl">
            <MainBar color={colorMode} />
            <Typography variant="h1" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>Help</Typography><br />
            {show()} 
        </Container>
    </>
    
  )
}

export default Help
