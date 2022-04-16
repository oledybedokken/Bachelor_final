import { Grid, Typography } from "@mui/material";
import React from "react";
import Image from 'mui-image';
import MainPageImage from '../../Assets/mainPage.png'
const Banner = () => {
  return (
    <Grid container spacing={2} sx={{mt:"2%",px:"5%"}}>
      <Grid item xs={7} container direction={"column"} spacing={3}>
        <Grid item>
        <Typography variant="h4" sx={{fontStyle: "normal",fontWeight: 800,fontSize: "54px",textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"}}>DATA FOR THE PEOPLE</Typography>
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
      <Grid item xs={5} display="flex" justifyContent="center">
        <Image src={MainPageImage} duration={500} width="50%"></Image>
      </Grid>
    </Grid>
  );
};

export default Banner;
