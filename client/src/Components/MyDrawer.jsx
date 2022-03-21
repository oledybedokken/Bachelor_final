import React from 'react'
import { Drawer,Box, Typography, Button,Toolbar,List,ListItem,AppBar, Divider, Switch} from '@mui/material'
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import Icon from '@mui/material/Icon';
import { ColorModeContext } from '../context/ColorModeContext';
const useStyles = makeStyles({
  drawerPaper: {
    width:"200px"
  }
});
const MyDrawer = ({DrawerInnhold}) => {
  const colorMode = React.useContext(ColorModeContext);
  console.log(colorMode)
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
            <Divider></Divider>
              {DrawerInnhold()}
              </>
          </Drawer>
          </Toolbar>
          </AppBar>
    </div>
  )
}

export default MyDrawer