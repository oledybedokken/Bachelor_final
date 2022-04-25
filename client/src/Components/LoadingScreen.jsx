import React from 'react'
import ProgressBar from './ProgressBar'
import { BeatLoader } from 'react-spinners'
import { Container } from '@mui/material'
const LoadingScreen = () => {
    return (
        <>
            <ProgressBar />
            <Container sx={{ backgroundColor: "primary.main", height: "100vh", width: "100vw" }} disableGutters fixed><BeatLoader color={'#123abc'} /></Container>
        </>
    )
}

export default LoadingScreen