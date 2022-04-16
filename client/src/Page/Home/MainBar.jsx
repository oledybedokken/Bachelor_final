import { AppBar, Box, Toolbar } from '@mui/material'
import React from 'react'
import LogoDark from '../../Assets/LogoDark.png';
import Image from 'mui-image'
const MainBar = () => {
    const links =[{label:"WEATHER",path:"/weather"},{label:"SSB",path:"/ssb"},{label:"Help",path:"/help"}]
  return (
      <>
    <AppBar position='fixed' color="transparent" elevation={0}>
        <Toolbar>
            <Box>
                <Image src={LogoDark}></Image>
            </Box>
        </Toolbar>
    </AppBar>
    </>
    
  )
}

export default MainBar