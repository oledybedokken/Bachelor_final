import React from 'react'
import { Drawer,Box, Typography, Button,Toolbar,AppBar, Divider, Switch} from '@mui/material'
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import Icon from '@mui/material/Icon';
import { ColorModeContext } from '../Context/ColorModeContext';
import FileUpload from './FileUpload';
const useStyles = makeStyles({
  drawerPaper: {
    width:"200px"
  }
});
const MyDrawer = ({DrawerInnhold}) => {
  const colorMode = React.useContext(ColorModeContext);
  const classes = useStyles();
    const [state,setState] = React.useState(false)
    const toggleDrawer =(open) =>(event)=>{
        setState(open)
    }
  const paths = [{label:"Incomes",pathname:"/incomes",icon:"payments"},{label:"Weather",pathname:"/weather",icon:"cloud"},]
  return (
    <div>
        <AppBar color="transparent" position="static" elevation={0}>
        <Toolbar>
        <MenuIcon onClick={toggleDrawer(true)} fontSize='large' sx={{color:"#fff",cursor:"pointer"}}></MenuIcon>
        <Drawer
            anchor={'left'}
            open={state}
            onClose={toggleDrawer(false)}
            classes={{paper:classes.drawerPaper}}
          >
            <><Typography variant='h5' textAlign={"center"}>Data ViZ</Typography>
            {paths.map((path)=>{
              return(
                <Button href="#text-buttons" component={Link} to={{pathname:path.pathname}} key={path.label}>{path.label}<Icon fontSize='small' sx={{ml:"2%"}}>{path.icon}</Icon></Button>
              )
            })}
            <Box sx={{display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Typography>DarkMode:</Typography>
              <Switch checked={colorMode.mode==="dark"} onChange={colorMode.toggleColorMode}></Switch>
            </Box>
            <FileUpload/>
            <Divider></Divider>
              {DrawerInnhold()}
              </>
              <Typography>If some data for a specific municipality is missing for some years, that means the SSB is missing "Number basis". Either they never got the data or it was to unreliable to be posted.</Typography>
          </Drawer>
          </Toolbar>
          </AppBar>
    </div>
  )
}

export default MyDrawer