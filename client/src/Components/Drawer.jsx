import React from 'react'
import { Drawer,Box, Typography, Button,Toolbar,List,ListItem,AppBar} from '@mui/material'
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
const MyDrawer = () => {
    const [state,setState] = React.useState(false)
    const toggleDrawer =(open) =>(event)=>{
        setState(open)
    }
    const DrawerInnhold = (anchor)=>(
        <div onClick={toggleDrawer(false)}>
          <Toolbar />
          <List>
              <ListItem button>
              <Link to="/vaermap">Vær Map</Link>
              </ListItem>
              <ListItem button>
                <Link to="/inntekt">Inntekt</Link>
              </ListItem>
          </List>
        </div>
      );
  return (
    <div>
        <AppBar position="static">
        <Toolbar>
        <MenuIcon onClick={toggleDrawer(true)} fontSize='large'></MenuIcon>
        
        <Drawer
            anchor={'left'}
            open={state}
            onClose={toggleDrawer(false)}
          >
              {DrawerInnhold()}
          </Drawer>
          </Toolbar>
          </AppBar>
    </div>
  )
}

export default MyDrawer