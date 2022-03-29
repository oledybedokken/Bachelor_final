import React,{useState} from 'react'
import { Drawer,Box, Typography, Button,Toolbar,List,ListItem,AppBar, Divider, Switch} from '@mui/material'
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import Icon from '@mui/material/Icon';
import { ColorModeContext } from '../context/ColorModeContext';
import FileUpload from './FileUpload';

const DrawerKommune = ({open}) => {
    return(
        <>
        {/* <AppBar>
            <Toolbar>
                <h1 > Kommune </h1>
            </Toolbar>
        </AppBar>
        <Drawer 
            anchor={'right'}
            open={open}
            >
            <h1> Open </h1>
        </Drawer> */}
        </>

    )
}
export default DrawerKommune;