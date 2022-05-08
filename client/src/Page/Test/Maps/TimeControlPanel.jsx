import React, { useContext, useState, useEffect } from 'react'
import { Card, Box, Typography, Slider, Switch, FormControl, InputLabel, Select, MenuItem, IconButton, Collapse, Alert, TextField } from '@mui/material'
import SsbContext from '../../../Context/SsbContext';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
const TimeControlPanel = ({ selectedTime, allDays, setSelectedTime, setAllDays, timeSettings,playSpeed }) => {
    const [alertOpen, setAlertOpen] = React.useState(true);
    const [playTime, setPlayTime] = React.useState(3000)
    const { options, mapformat } = useContext(SsbContext)
    function handleChangeTime(e) {
        setSelectedTime(e.target.value)
    }
    const handleControllerChange = (event, way) => {
        if (way === "next") {
            if (selectedTime === options.times.length - 1) {
                return
            }
            else {
                setSelectedTime(selectedTime + 1)
                return
            }
        }
        else {
            if (selectedTime === 0) {
                return
            }
            else {
                setSelectedTime(selectedTime - 1)
                return
            }
        }
    };
    const handleAllDays = () => {
        setAllDays(!allDays)
        setAlertOpen(true)
    }
    const [paused, setPaused] = useState(true);
    const controllerPlay = () => {
        setPaused(false);
    };
    const resume = () => {
        setPaused(false);
    };
    const controllerPause = () => {
        setPaused(true);
    };
    const reset = () => {
        setSelectedTime(0);
        setPaused(true);
    };
    useEffect(
        function () {
            var timeout;
            if (!paused) {
                timeout = setTimeout(function () {
                    const next = selectedTime < options.times.length - 1 ? selectedTime + 1 : 0;
                    setSelectedTime(next);
                }, playSpeed*1000);
            }
            return function () {
                clearTimeout(timeout);
            };
        },
        [paused, selectedTime, options.times.length]
    );
    return (
        <Card sx={{ backgroundColor: "rgba(33, 43, 54, 0.5)", zIndex: 9, width: "250px", position: "absolute", right: "5px", top: "5px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: "5px" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                {mapformat === "heatmap" && <> <Typography>All Days:</Typography>
                    <Switch checked={allDays} onChange={() => handleAllDays()}></Switch></>}
            </Box>
            <Typography>Time:{options.times[selectedTime]}</Typography>
            {timeSettings === "slider" &&
                <>
                    <Box sx={{ minWidth: "80%" }}>
                        <Slider min={0} max={options.times.length - 1} disabled={allDays} value={selectedTime} onChange={(e) => handleChangeTime(e)}></Slider>
                    </Box>
                </>
            }
            {timeSettings === "dropdown" &&
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Chosen Sorting</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedTime}
                        label="Chosen Sorting"
                        onChange={handleChangeTime}
                    >
                        {options.times.filter((time) => time !== options.times[selectedTime]).map((time, index) => (
                            <MenuItem value={index}>{options.times[index]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
            {timeSettings === "controller" &&
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {allDays ?
                        <Collapse in={alertOpen}>
                            <Alert severity="info" action={
                                <IconButton aria-label="close" color="inherit" size="small" onClick={() => { setAlertOpen(false); }}>
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>}
                            >
                                Remove all times to see the controller.</Alert>
                        </Collapse>
                        :
                        <Box>
                            <ArrowCircleLeftIcon
                                onClick={(e) => handleControllerChange(e, "back")}
                                sx={{ cursor: "pointer", color: selectedTime !== 0 ? "#fff" : "#cc3300" }}></ArrowCircleLeftIcon>
                            <PlayCircleIcon
                                onClick={(e) => controllerPlay(e)}
                                sx={{ cursor: "pointer", color: paused ? "#fff" : "success.main" }} ></PlayCircleIcon>
                            <PauseCircleIcon
                                onClick={(e) => controllerPause(e)}
                                sx={{ cursor: "pointer", color: !paused ? "#fff" : "warning.main" }} ></PauseCircleIcon>
                            <ArrowCircleRightIcon
                                onClick={(e) => handleControllerChange(e, "next")}
                                sx={{ cursor: "pointer", color: selectedTime !== options.times.length - 1 ? "#fff" : "#cc3300" }}></ArrowCircleRightIcon>
                            <RestartAltIcon onClick={(e) => reset(e, "next")} sx={{ cursor: "pointer", color: "#fff" }}></RestartAltIcon>
                        </Box>
                    }</Box>
            }
        </Card>
    )
}

export default TimeControlPanel