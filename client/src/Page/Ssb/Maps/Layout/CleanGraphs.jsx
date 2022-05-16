import { Box, Card, CardContent, CardHeader } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import SsbBarChart from '../../../../Components/Chart/SsbBarChart';
import SsbWaveChart from '../../../../Components/Chart/SsbWaveChart';
import SortingDropDownMenu from '../../../../Components/SortingDropDownMenu';
import SsbContext from '../../../../Context/SsbContext'
const CleanGraphs = ({ data, region,chosenRegion }) => {
    const { options,sorting } = useContext(SsbContext);
    const [graph, setGraph] = useState()
    function createSeries(array) {
        const series = []
        Object.entries(array[0].properties.verdier).forEach(([key, value]) => {
            const values = Object.values(value)
            series.push({ name: key, data: values })
        });
        return series
    }

    function multiRegions(){
        return chosenRegion.map((region,index)=>{return <p key={region.Region}>{region.Region}{index!==chosenRegion.length-1&&"+"}</p>})
    }
    function createMultiSeries(dataArray){
        const series = []
        const seriesArray = dataArray.map((e)=>{
            return {[e.properties.Region]:e.properties.verdier[options.ContentsCodes[sorting.contentCodeIndex].label]}
        });
        seriesArray.map((e)=>Object.entries(e).forEach(([key, value]) => {
            const values = Object.values(value)
            series.push({ name: key, data: values })
        }));
        return series
        //dataArray.filter()
    }
    useEffect(() => {
        if(chosenRegion.length===1){
        const dataArray = data.features.filter((e) => e.properties.Region === region);
        const series = createSeries(dataArray)
        setGraph({
            xaxis: { categories: options.times },
            series: series
        })}
        else{
            const dataArray = data.features.filter(function(e){if(chosenRegion.map((p)=>p.Region).includes(e.properties.Region)){return e.properties}})
            const series = createMultiSeries(dataArray)
            setGraph({
                xaxis: { categories: options.times },
                series: series
            })            
        }   
    }, [chosenRegion,sorting,region,data.features,options.times]);
    return (
        <>
        {chosenRegion.length===1&&
            <Card sx={{width:"80%",mt:"5px"}}>
                <CardHeader title={"Area Chart Single Region"} subheader={region + ":" + options.name.split(":")[1]}></CardHeader>
                <CardContent sx={{display:"flex",justifyContent:"center",flexDirection:"column"}}>
                    <Box sx={{ width: "90%",height:"300px"}}>
                        {graph &&
                            <SsbWaveChart graph={graph} />
                        }
                    </Box>
                </CardContent>
                <CardContent sx={{display:"flex",justifyContent:"center",flexDirection:"column"}}>
                    <Box sx={{ width: "90%" }}>
                        {graph &&
                            <SsbBarChart graph={graph} />
                        }
                    </Box>
                </CardContent>
            </Card>
        }
        {chosenRegion.length>1&&
        <Card sx={{width:"80%",mt:"5px",pb:"20%"}}>
                <CardHeader title={"Area Chart MultiRegion"} subheader={<Box sx={{display:"flex"}}>Chosen Regions:{multiRegions()}</Box>}></CardHeader>
                <CardContent sx={{display:"flex",justifyContent:"center",flexDirection:"column"}}>
                    <SortingDropDownMenu/>
                    <Box sx={{ width: "80%", height:"250px" }}>
                        {graph &&
                            <SsbWaveChart graph={graph} />
                        }
                    </Box>
                </CardContent>
                <CardContent sx={{display:"flex",justifyContent:"center",flexDirection:"column"}}>
                    <Box sx={{ width: "80%",height:"250px" }}>
                        {graph &&
                            <SsbBarChart graph={graph} />
                        }
                    </Box>
                </CardContent>
            </Card>
            }
        </>
        
    )
}

export default CleanGraphs