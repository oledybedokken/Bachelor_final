import {Grid, Typography } from "@mui/material";
import React from "react";
import Image from 'mui-image';
import imageHomePage from '../../Assets/homepage.png'
import { ColorModeContext } from '../../Context/ColorModeContext';
const Banner = () => {
  const colorMode = React.useContext(ColorModeContext);
  return (

    <Grid container spacing={2} sx={{mt:"2%"}}>
      <Grid item xs={12} md={7} container direction={"column"} spacing={8} sx={{pt:"0px"}}>
        <Grid item>
        <Typography variant="h1" sx={{ color: colorMode.mode==="dark"?'common.white':'common.black' }}>
                Data for <br />
                the people<br /> with
                <Typography component="span" variant="h1" sx={{ color: 'primary.main' }}>
                  &nbsp;Dataviz
                </Typography>
              </Typography>
        </Grid>
        <Grid item> 
        <Typography variant="body">
          This web application aims to develop to visualize and plot data that
          has both a geographical and a temporal component. The design involves
          a map where the data varies geographically and over time. Technologies
          and data to use were at the discretion of the group. The task description
          suggested Data from Norwegian Climate Service Center, traffic
          data from the Norwegian Public Roads Administration, and data on air
          pollution from the municipalities. In the project, mainly data from
          Frost.met.no and SSB was used. The application was developed with
          empha- sizing the implementation of functionalities, user-friendly,
          and navigation.
        </Typography>
        </Grid>
      </Grid>
      <Grid item md={5} xs={0} sx={{display:{md:"flex",xs:"none"}}} justifyContent="center">
        <Image src={colorMode.mode==="dark"?imageHomePage:imageHomePage} duration={500} width="80%" fit="scale-down"></Image>
      </Grid>
    </Grid>
  );
};

export default Banner;
