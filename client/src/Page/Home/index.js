import React from 'react';
import UpdateSources from './content';
import Banner from './Banner';
import FileUpload from '../../Components/FileUpload';
import { Container } from '@mui/material';
import mainpageBackground from '../../Assets/mainpageBackground.png';
import MainBar from './MainBar'
const index = () => {
  return <><Container maxWidth="" sx={{height:"100vh", background:'URL('+mainpageBackground+'),linear-gradient(180deg, #172347 0%, #015268 100%);', backgroundRepeat:"no-repeat",backgroundSize: "cover"}}><MainBar/><Banner/><UpdateSources/><FileUpload/></Container></>
};

export default index;
