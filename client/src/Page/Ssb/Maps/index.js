import { Container, Typography } from '@mui/material'
import React, { useContext, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { ColorModeContext } from '../../../Context/ColorModeContext'
import { useQuery } from 'react-query';
import { GetMapSsb } from '../../../Apis/Queries'
import LoadingScreen from '../../../Components/LoadingScreen';
import { SsbContext } from '../../../Context/SsbContext';
import {UserSettingsContext} from '../../../Context/UserSettingsContext'
//const {fullScreen,timeSettings, playSpeed, setTimeSettings,setPlaySpeed}=useContext(UserSettingsContext)
import Clean from './Layout/CleanLayout';
import FullScreenLayout from './Layout/FullScreenLayout';
const Maps = ({regionType }) => {
    const {id:loadingId} = useParams();
    useEffect(()=>{
        setId(loadingId)
    },[])
    const colorMode = useContext(ColorModeContext);
    const min = 1
    const max = 10
    const {fullScreen,timeSettings, playSpeed, setTimeSettings,setPlaySpeed}=useContext(UserSettingsContext)
    const { setSorting, setOptions,mapformat,setId,id } = useContext(SsbContext);
    const url = "https://data.ssb.no/api/v0/dataset/" + loadingId + ".json?lang=no";
    const { data, isLoading, isFetching, isError, error } = useQuery(["ssbData", { url: url, mapformat: mapformat, regionType: regionType }], () => GetMapSsb({ url: url, mapformat: mapformat, regionType: regionType }),
        {
            retryDelay: 2000,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                let contentCodeIndex=0
                if(data.options.ContentsCodes[0].label==="Antall husholdninger"){
                    contentCodeIndex=1
                }
                setSorting({ options: data.sorting, id: 0, contentCodeIndex: contentCodeIndex })
                setOptions({...data.options,name:data.name})
            }
        });
    if (isError) {
       if(error.response.status===500){
        return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><Typography>Error 500</Typography></Container>;
        }
        if(error.response.status===400){
            return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><Typography>Missing Link! Please choose a id</Typography></Container>;
            }
    }
    if (isFetching) {
        return <LoadingScreen text={"Contacting SSB"} />;
    }
    if (isLoading) {
        return <LoadingScreen text={"Loading data from SSB"} />;
    }
    return (
        <>
        {fullScreen === true ? <FullScreenLayout id={id} data={data} timeSettings={timeSettings} playSpeed={playSpeed} setTimeSettings={setTimeSettings} max ={max} min={min} setPlaySpeed={setPlaySpeed}/> :
        <Clean id={loadingId} data={data} timeSettings={timeSettings} playSpeed={playSpeed} setTimeSettings={setTimeSettings} max ={max} min={min} setPlaySpeed={setPlaySpeed}></Clean>
    }</>
    )
}

export default Maps