import { Box } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import SsbWaveChart from '../../../../Components/chart/SsbWaveChart';
import SsbContext from '../../../../Context/SsbContext'
const CleanGraphs = ({ data, region }) => {
    const { options } = useContext(SsbContext);
    const [demoSeries, setDemoSeries] = useState({})
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
        console.log(series)
        setGraph({
            xaxis: { categories: options.times },
            series: series
        })
    }, [])
    return (
        <>
            <Box>
                {graph &&
                    <SsbWaveChart graph={graph} />
                }
        </Box>
        </>
    )
}

export default CleanGraphs