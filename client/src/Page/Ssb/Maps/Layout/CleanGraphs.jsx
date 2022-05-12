import { Box, Card, CardContent, CardHeader } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import SsbWaveChart from '../../../../Components/Chart/SsbWaveChart';
import SsbContext from '../../../../Context/SsbContext'
const CleanGraphs = ({ data, region }) => {
    const { options } = useContext(SsbContext);
    const [graph, setGraph] = useState()
    function createSeries(array) {
        const series = []
        Object.entries(array[0].properties.verdier).forEach(([key, value]) => {
            const values = Object.values(value)
            series.push({ name: key, data: values })
        });
        return series
    }
    useEffect(() => {
        const dataArray = data.features.filter((e) => e.properties.Kommunenavn === region);
        const series = createSeries(dataArray)
        setGraph({
            xaxis: { categories: options.times },
            series: series
        })
    }, [])
    return (
        <>
            <Card sx={{width:"80%",mt:"5px"}}>
                <CardHeader title={"Area Chart Single Region"} subheader={region + ":" + options.name.split(":")[1]}></CardHeader>
                <CardContent sx={{display:"flex",justifyContent:"center"}}>
                    <Box sx={{ width: "90%" }}>
                        {graph &&
                            <SsbWaveChart graph={graph} />
                        }
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}

export default CleanGraphs