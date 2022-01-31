import React from 'react';
import MapSide from './MapSide';
import MapView from './MapView';
import {Box} from '@mui/material'
const Map = () => {
  return <div className='container'><Box sx={{height:"500px",width:"90%"}}><MapView/></Box>{/* <MapSide/> */}</div>;
};

export default Map;
