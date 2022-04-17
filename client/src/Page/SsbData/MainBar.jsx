import { AppBar, Box, Toolbar,FormControlLabel, Container, Button } from '@mui/material'
import React from 'react'
import Image from 'mui-image';
import Daynightswitch from '../../Components/Layout/DayNightSwitch';
import LogoDark from '../../Assets/logoDarkMode.png'
import { ColorModeContext } from '../../context/ColorModeContext';
import { Link } from 'react-router-dom';

const MainBar = () => {
  const colorMode = React.useContext(ColorModeContext);
  const links =[{label:"WEATHER",path:"/weather"},{label:"SSB",path:"/ssb"},{label:"HELP",path:"/help"}]
  return (
      <>
    <AppBar position='static' color="transparent" elevation={0}>
        <Toolbar disableGutters>
          <Container sx={{display:"flex", alignItems:"center", justifyContent:"space-between"}} disableGutters maxWidth="">
            <Box sx={{flex:"1",ml:2}}>
                <Image src={LogoDark} duration={300} width="50%"></Image>
            </Box>
            <Box sx={{flex:"1",display:"flex",justifyContent:"right"}}>
                <FormControlLabel
                  control={<Daynightswitch sx={{ m: 1 }} checked={colorMode.mode==="dark"?true:false} onChange={colorMode.toggleColorMode} />}
                  label=""
                />
            </Box>
            <Box sx={{flex:"1",display: "flex",justifyContent: "space-evenly"}}>
                <Button key={links[2]["label"]} to={links[2]["path"]} component={Link} sx={{fontSize:"1.5em",color:"white",whiteSpace:"nowrap",":hover":{color:"#fff"},fontWeight:700}}>{links[2]["label"]}</Button>
            </Box>
          </Container>
        </Toolbar>
    </AppBar>
    </>
    
  )
}

export default MainBar