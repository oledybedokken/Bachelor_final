import { AppBar, Box, Toolbar,FormControlLabel, Container } from '@mui/material'
import React from 'react'
import Image from 'mui-image';
import Daynightswitch from '../../Components/Layout/DayNightSwitch';
import LogoLight from '../../Assets/logoLightMode.png';
import LogoDark from '../../Assets/logoDarkMode.png'
import { ColorModeContext } from '../../Context/ColorModeContext';

const MainBar = () => {
  const colorMode = React.useContext(ColorModeContext);
  return (
    <>
      <AppBar position='static' color="transparent" elevation={0}>
          <Toolbar disableGutters>
            <Container sx={{display:"flex", alignItems:"center", justifyContent:"space-between"}} disableGutters maxWidth="">
              <Box sx={{justifyContent:"left"}}>
                <Image src={colorMode.mode==="dark"?LogoDark:LogoLight} duration={300} sx={{maxWidth:"200px"}}></Image>
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