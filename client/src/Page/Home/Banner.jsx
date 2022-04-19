import {Grid, Typography } from "@mui/material";
import React from "react";
import Image from 'mui-image';
import mapDarkMode from '../../Assets/mapDarkMode.png'
import mapLightMode from '../../Assets/mapLightMode.png'
import { ColorModeContext } from '../../context/ColorModeContext';
import { useMediaQuery } from 'react-responsive'
const Banner = () => {
  const colorMode = React.useContext(ColorModeContext);
  return (

    <Grid container spacing={2} sx={{mt:"2%"}}>
      <Grid item xs={12} md={7} container direction={"column"} spacing={8} sx={{pt:"0px"}}>
        <Grid item>
        <Typography variant="h4" sx={{textAlign:{md:"left",xs:"center"},pt:4,fontStyle: "normal",fontWeight: 700,textShadow:"0px 4px 4px rgba(0, 0, 0, 0.55)"}}>DATA FOR THE PEOPLE</Typography>
        </Grid>
        <Grid item> 
        <Typography variant="body">
          This web application aims to develop to visualize and plot data that
          has both a geographical and a temporal component. The design involves
          a map where the data varies geographically and over time. Technologies
          and data to use were at the discretion of the group. The task descrip-
          tion suggested Data from Norwegian Climate Service Center, traffic
          data from the Norwegian Public Roads Administration, and data on air
          pollution from the municipalities. In the project, mainly data from
          Frost.met.no and SSB was used. The application was developed with
          empha- sizing the implementation of functionalities, user-friendly,
          and navigation.
        </Typography>
        </Grid>
      </Grid>
      <Grid item md={5} xs={0} sx={{display:{md:"flex",xs:"none"}}} justifyContent="center">
        <Image src={colorMode.mode==="dark"?mapDarkMode:mapLightMode} duration={500} width="65%" fit="scale-down"></Image>
      </Grid>
    </Grid>
  );
};

export default Banner;
