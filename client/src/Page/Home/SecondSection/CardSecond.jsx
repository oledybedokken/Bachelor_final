import React from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
const CardSecond = ({ elementInfo }) => {
    return (
        <Box width="100%">
            <Card sx={{height:"300px"}}>
                <CardMedia
                    component="img"
                    height="140px"
                    image={elementInfo.url}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" color="text.cards">
                        {elementInfo.heading}
                    </Typography>
                    <Typography variant="body2" color="text.cards">
                        {elementInfo.label}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}

export default CardSecond
