import { Card, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
function TimeSettingsTest({setTimeSettings, timeSettings,  parseInt, max, min, setPlaySpeed, playSpeed }) {
    return (<Card sx={{
        mt: "5px"
    }}>
        <CardHeader title="Settings"></CardHeader>
        <CardContent>
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Time chooser</FormLabel>
                <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue={timeSettings} name="radio-buttons-group" onChange={e => setTimeSettings(e.target.value)}>
                    <FormControlLabel value="slider" control={<Radio />} label="Slider" />
                    <FormControlLabel value="dropdown" control={<Radio />} label="Dropdown" />
                    <FormControlLabel value="controller" control={<Radio />} label="Controller" />
                    {timeSettings === "controller" && <><TextField onChange={e => {
                        var value = Number.parseInt(e.target.value,10);
                        if (value > max) value = 10;
                        if (value < min) value = 1;
                        setPlaySpeed(value);
                    }} id="standard-number" label="Play speed(ms)" InputProps={{
                        inputProps: {
                            max: 10,
                            min: 1
                        }
                    }} size="small" type="number" sx={{
                        width: "100px"
                    }} variant="standard" value={playSpeed} /></>}
                </RadioGroup>
            </FormControl>
        </CardContent>
    </Card>);
}
export default TimeSettingsTest;