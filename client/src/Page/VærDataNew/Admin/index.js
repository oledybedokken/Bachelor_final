import { Alert, Button, Collapse, Container, IconButton } from '@mui/material'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import SourceFinder from '../../../Apis/SourceFinder'
import LoadingScreen from '../../../Components/LoadingScreen'
import { updateData, updateSources,updateWeatherData } from '../../../Apis/Queries'
import CloseIcon from '@mui/icons-material/Close';
const Admin = () => {
    const [alertMessage, setAlertMessage] = useState(null)
    const [alertOpen,setAlertOpen]=useState(false)
    const { mutate:fetchSources, isLoading:loadingSources, isFetching:fetchingSources,isError } = useMutation(updateSources, {
        onSuccess: data => {
            setAlertOpen(true)
            setAlertMessage("Updated: " + data.data.rows + " rows")
        }
    })
    const { mutate:fetchData, isLoading:loadingData, isFetching:fetchingData,isError:errorData } = useMutation(updateData, {
        onSuccess: data => {
            setAlertOpen(true)
            setAlertMessage("Updated: " + data.data.value + " rows")
            console.log("happend")
        }
    })
    const { mutate:fetchWeatherData, isLoading:loadingWeatherData, isFetching:fetchingWeatherData,isError:errorWeatherData } = useMutation(updateWeatherData, {
        onSuccess: data => {
            setAlertOpen(true)
            setAlertMessage("Updated: " + data.data.value + " rows")
        }
    })
    return (
        <Container>
            <Button onClick={fetchSources} variant="contained">Update sources!</Button>
            <Button onClick={fetchData} variant="contained">Update data!</Button>
            <Button onClick={fetchWeatherData} variant="contained">Update WeatherData!</Button>
            {(loadingSources || fetchingSources) && <p>Fetching sources!</p>}
            {(loadingData || fetchingData) && <p>Fetching data!</p>}
            {(loadingWeatherData || fetchingWeatherData) && <p>Fetching Weather data expected time 10min!</p>}
            <Collapse in={alertOpen}>
                <Alert severity={isError?"alert":"success"} action={
                    <IconButton aria-label="close" color="inherit" size="small" onClick={() => { setAlertOpen(false); }}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>}
                >
                    {alertMessage}</Alert>
            </Collapse>
        </Container>
    )
}

export default Admin