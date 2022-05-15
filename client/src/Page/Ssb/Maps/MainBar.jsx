import { AppBar, Box, Toolbar,FormControlLabel, Container, Button } from '@mui/material'
import React from 'react'
import Image from 'mui-image';
import Daynightswitch from '../../../Components/Layout/DayNightSwitch';
import LogoLight from '../../../Assets/logoLightMode.png';
import LogoDark from '../../../Assets/logoDarkMode.png'
import { ColorModeContext } from '../../../Context/ColorModeContext';
import { Link } from 'react-router-dom';

const MainBar = ({colorMode}) => {
  const links =[{label:"WEATHER",path:"/weather"},{label:"SSB",path:"/ssb"},{label:"HELP",path:"/help"}]
  return (
    <>
    <AppBar position='static' color={colorMode.mode==="dark"?"transparent":"primary"} elevation={0}>
        <Toolbar disableGutters>
          <Container sx={{display:"flex", alignItems:"center", justifyContent:"space-around"}} disableGutters maxWidth="">
            <Box sx={{flex:"1",ml:2}}>
              <Link to="/">
                <Image src={colorMode.mode==="dark"?LogoDark:LogoLight} duration={300} sx={{maxWidth:"200px"}}></Image>
                </Link>
            </Box>
            <Box sx={{flex:"2",display: "flex",justifyContent: "space-between"}}>
              {links.map((link)=>(
                <Box sx={{width:"33%",textAlign:"center"}} key={link.path}>
                <Button key={link.label} to={link.path} component={Link} sx={{display: "inline-flex",alignItems: "center", pt:"10px",fontSize:"1.5em",whiteSpace:"nowrap",fontWeight:700}} variant="navBarButton">{link.label}</Button>
                </Box>
              ))}
            </Box>
            <Box sx={{flex:"1",display:"flex",justifyContent:"right"}}>
                <FormControlLabel
                  control={<Daynightswitch sx={{ m: 1 }} checked={colorMode.mode==="dark"?true:false} onChange={colorMode.toggleColorMode} />}
                  label=""
                />
              </Box>
              </Container>
        </Toolbar>
    </AppBar>
    </>
    
  )
}

export default MainBar