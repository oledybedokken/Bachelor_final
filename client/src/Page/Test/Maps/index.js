import { Box, Button, Card, CardContent, CardHeader, Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import Heatmap from './Heatmap'
import { ColorModeContext } from '../../../Context/ColorModeContext'
import { useQuery } from 'react-query';
import { GetMapSsb } from '../../../Apis/Queries'
import LoadingScreen from '../../../Components/LoadingScreen';
import { SsbContext } from '../../../Context/SsbContext';
import Choropleth from './Choropleth';
import SortingDropDownMenu from '../../../Components/SortingDropDownMenu';
import Palette from '../../SsbVisualization/Palette';
import Clean from './Layout/CleanLayout';
import FullScreenLayout from './Layout/FullScreenLayout';
const Maps = ({ id, regionType }) => {
    const colorMode = useContext(ColorModeContext);
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [playSpeed, setPlaySpeed] = useState(5);
    const min = 1
    const max = 10
    const [timeSettings, setTimeSettings] = useState("slider")
    const { setSorting, setOptions,mapformat,fullScreen,setFullScreen } = useContext(SsbContext);
    const url = "https://data.ssb.no/api/v0/dataset/" + id.id + ".json?lang=no";
    const { data, isLoading, isFetching, isError, error } = useQuery(["ssbData", { url: url, mapformat: mapformat, regionType: regionType }], () => GetMapSsb({ url: url, mapformat: mapformat, regionType: regionType }),
        {
            retryDelay: 1000,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setSorting({ options: data.sorting, id: 0, contentCodeIndex: 0 })
                setOptions(data.options)
            }
        });
    if (isError) {
        return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><Typography>{error}</Typography></Container>;
    }
    if (isFetching) {
        return <LoadingScreen text={"Contacting SSB"} />;
    }
    if (isLoading) {
        return <LoadingScreen text={"Loading data from SSB"} />;
    }
    return (
        fullScreen === true ? <FullScreenLayout id={id} data={data} timeSettings={timeSettings} playSpeed={playSpeed} setTimeSettings={setTimeSettings} max ={max} min={min} setPlaySpeed={setPlaySpeed}/> :
        <Clean id={id} data={data} timeSettings={timeSettings} playSpeed={playSpeed} setTimeSettings={setTimeSettings} max ={max} min={min} setPlaySpeed={setPlaySpeed}></Clean>
    )
}

export default Maps