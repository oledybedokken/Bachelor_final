import { AppBar, Box, Button, Divider, Drawer, FormControlLabel, Stack, Switch, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { ColorModeContext } from '../Context/ColorModeContext';
import { makeStyles } from '@mui/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewIcon from '@mui/icons-material/KeyboardArrowLeft';
import SortingDropDownMenu from './SortingDropDownMenu';
import Daynightswitch from './Layout/DayNightSwitch';
import TimeSettingsTest from './TestTimeSettings';
import UserSettingsContext from '../Context/UserSettingsContext';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
const useStyles = makeStyles({
    drawerPaper: {
        width: "250px"
    }
});
const NewDrawer = ({ timeSettings, playSpeed, setTimeSettings, max, min, setPlaySpeed,DrawerSpecialInfo,weather=false }) => {
    const colorMode = React.useContext(ColorModeContext);
    const { setFullScreen, fullScreen } = React.useContext(UserSettingsContext);
    const classes = useStyles();
    const [state, setState] = React.useState(false)
    const toggleDrawer = (open) => (event) => {
        setState(open)
    }
    return (
        <div>
            <AppBar color="transparent" position="static" elevation={0}>
                <Toolbar>
                    <MenuIcon onClick={toggleDrawer(true)} fontSize='large' sx={{ color: "#fff", cursor: "pointer" }}></MenuIcon>
                    <Drawer
                        anchor={'left'}
                        open={state}
                        onClose={toggleDrawer(false)}
                        classes={{ paper: classes.drawerPaper }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "50px" }}>
                            <Link to="/"><HomeIcon /> </Link>
                            
                            <ArrowBackIosNewIcon color="#fff" size="small" sx={{ cursor: "pointer" }} onClick={toggleDrawer(false)} />
                        </Box>
                        <Divider />
                        <Stack sx={{ display: "flex", alignItems: "center", justifyContent: "center", pt: "10px", pb: "10px" }}>
                            <FormControlLabel sx={{ mr: 0 }}
                                control={<Daynightswitch sx={{ m: 1 }} checked={colorMode.mode === "dark" ? true : false} onChange={colorMode.toggleColorMode} />}
                                label=""
                            />
                           <Box sx={{display:"flex",justifyContent:"center",p:"5px",mb:"5px"}}>
                            <Button variant="contained" onClick={()=>setFullScreen(!fullScreen)}>Go small screen mode!</Button>
                        </Box>
                        </Stack>
                        <Divider />
                        {DrawerSpecialInfo&&DrawerSpecialInfo()}
                        <Divider />
                        <Box sx={{ borderRadius: "5px", borderColor: "rgba(145, 158, 171, 0.24)", borderStyle: "solid", borderWidth: "1px", m: "5px" }}>
                            {!weather&&
                            <TimeSettingsTest setTimeSettings={setTimeSettings} timeSettings={timeSettings} max={max} min={min} setPlaySpeed={setPlaySpeed} playSpeed={playSpeed} />
                            }
                        </Box>
                    </Drawer>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NewDrawer