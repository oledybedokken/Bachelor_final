import React from 'react';
import MapView from './MapView';
import {Box} from '@mui/material'
const Map = () => {
  return <div className='container'><Box sx={{height:"500px",width:"90%"}}><MapView/></Box></div>;
};

export default Map;
