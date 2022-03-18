import React from 'react'
import { Drawer,Box, Typography, Button,Toolbar,List,ListItem,AppBar} from '@mui/material'
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
  drawerPaper: {
    paddingTop: "50px"
  }
});
const MyDrawer = ({DrawerInnhold}) => {
  const classes = useStyles();
    const [state,setState] = React.useState(false)
    const toggleDrawer =(open) =>(event)=>{
        setState(open)
    }
  return (
    <div>
        <AppBar color="transparent" position="static" elevation={0}>
        <Toolbar>
        <MenuIcon onClick={toggleDrawer(true)} fontSize='large' sx={{color:"#fff",cursor:"pointer"}}></MenuIcon>
        <Drawer
            anchor={'left'}
            open={state}
            onClose={toggleDrawer(false)}
            className={{
              paper:classes.drawerPaper
            }}
          >
              {DrawerInnhold()}
          </Drawer>
          </Toolbar>
          </AppBar>
    </div>
  )
}

export default MyDrawer