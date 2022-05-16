import React, { useContext } from 'react'
import { Typography} from '@mui/material'
import { ColorModeContext } from '../../../Context/ColorModeContext';

const Guide = () => {
    const colorMode = useContext(ColorModeContext);
    return (
        <div>
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"} to={"/"}>Go to weather documentation</Typography><br />
            <Typography variant="h3" color={colorMode.mode === "dark" ? "#ffffff" : "#000000"}>Go to SSB documentation</Typography>
        </div>
    )
}

export default Guide
