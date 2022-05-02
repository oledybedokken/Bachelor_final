import React, { useEffect } from 'react'
import { BeatLoader } from 'react-spinners'
import { Container, Typography } from '@mui/material'
const LoadingScreen = ({text}) => {
    return (
        <>
            <Container maxWidth="" sx={{width:"100vw",height:"100vh",mx:0,display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}} disableGutters><Typography>{text?text:"Page Loading"}</Typography><BeatLoader color={'#fff'}/></Container>
        </>
    )
}

export default LoadingScreen