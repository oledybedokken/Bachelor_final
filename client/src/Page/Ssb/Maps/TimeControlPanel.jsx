import React, { useContext, useState, useEffect } from 'react'
import { Card, Box, Typography, Slider, Switch, FormControl, InputLabel, Select, MenuItem, IconButton, Collapse, Alert, TextField } from '@mui/material'
import SsbContext from '../../../Context/SsbContext';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { UserSettingsContext } from '../../../Context/UserSettingsContext'
const TimeControlPanel = ({ selectedTime, allDays, setSelectedTime, setAllDays, times, weather }) => {
    const { timeSettings, playSpeed, sideBarStatus } = useContext(UserSettingsContext)
    const [alertOpen, setAlertOpen] = React.useState(true);
    const [playTime, setPlayTime] = React.useState(3000)
    const { options, mapformat } = useContext(SsbContext)
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [paused, setPaused] = useState(true);
    const DateConverter = (input) => {
        var s = new Date(input * 1000).toISOString();
        return s.split("T")[0];
    }
    function handleChangeTime(e, period) {
        if (period) {
            if(period==="month"){
                const value =DateConverter(selectedTime);
                const newValue = new Date(`${value.split("-")[0]}-${e.target.value}-${value.split("-")[2]}`);
                const arr =[Math.floor(newValue.getTime() / 1000)]
                setSelectedTime(arr);
            }
            if(period==="year"){
                const value =DateConverter(selectedTime);
                const newValue = new Date(`${e.target.value}-${value.split("-")[1]}-${value.split("-")[2]}`);
                const arr =[Math.floor(newValue.getTime() / 1000)]
                setSelectedTime(arr);
            }
        }
        else{
        setSelectedTime(e.target.value)}
    }
    const handleControllerChange = (event, way) => {
        if (way === "next") {
            if (selectedTime === times.length - 1) {
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
                    const next = selectedTime < times.length - 1 ? selectedTime + 1 : 0;
                    setSelectedTime(next);
                }, playSpeed * 1000);
            }
            return function () {
                clearTimeout(timeout);
            };
        },
        [paused, selectedTime, times.length]
    );
    const findAviableMonths = (arr) => {
        return Array.from(new Set(arr.filter((element) => element.split("-")[0] === DateConverter(selectedTime).split("-")[0]).map(item => item.split("-")[1])));
    }
    const findUniqueYears = (arr) => Array.from(new Set(arr.map(item => item.split('-')[0])))
    return (
        <Card sx={{ backgroundColor: "rgba(33, 43, 54, 0.9)", zIndex: 9, width: "250px", position: "absolute", right: sideBarStatus ? "70%" : "3%", bottom: sideBarStatus ? "5px" : "null", top: !sideBarStatus ? "0" : "5", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: "5px" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                {mapformat === "heatmap" && <> <Typography>All Days:</Typography>
                    <Switch checked={allDays} onChange={() => handleAllDays()}></Switch></>}
            </Box>
            <Typography>Time:{times[selectedTime]}</Typography>
            {timeSettings === "slider" &&!weather  &&
                <>
                    <Box sx={{ minWidth: "80%" }}>
                        <Slider min={0} max={times.length - 1} disabled={allDays} value={selectedTime} onChange={(e) => handleChangeTime(e)}></Slider>
                    </Box>
                </>
            }

            {timeSettings === "dropdown"&&<>{weather === false ?
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Chosen Sorting</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedTime}
                        label="Chosen Sorting"
                        onChange={handleChangeTime}
                    >
                        {times.filter((time) => time !== times[selectedTime]).map((time, index) => (
                            <MenuItem value={index} key={index}>{times[index]}</MenuItem>
                        ))}
                    </Select>
                </FormControl> : <><FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={DateConverter(selectedTime).split("-")[0]}
                        label="Chosen Sorting"
                        onChange={(e) => handleChangeTime(e, "year")}
                    >
                        {findUniqueYears(times).sort().map((year) => (<MenuItem value={year} key={year}>{year}</MenuItem>))}
                    </Select>
                </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Month</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={DateConverter(selectedTime).split("-")[1]}
                            label="Chosen Sorting"
                            onChange={(e) => handleChangeTime(e, "month")}
                        >
                            {findAviableMonths(times).sort().map((month) => (<MenuItem value={month} key={month}>{months[parseInt(month) - 1]}</MenuItem>))}
                        </Select>
                    </FormControl>
                    </>}
                </>
            }
            {timeSettings === "controller" &&!weather  &&
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
                                sx={{ cursor: "pointer", color: selectedTime !== times.length - 1 ? "#fff" : "#cc3300" }}></ArrowCircleRightIcon>
                            <RestartAltIcon onClick={(e) => reset(e, "next")} sx={{ cursor: "pointer", color: "#fff" }}></RestartAltIcon>
                        </Box>
                    }</Box>
            }
        </Card>
    )
}

export default TimeControlPanel