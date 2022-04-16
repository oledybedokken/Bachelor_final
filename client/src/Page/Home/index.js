import React from "react";
import Banner from "./Banner";
import { Box, Container } from "@mui/material";
import mainpageBackground from "../../Assets/mainpageBackground.png";
import MainBar from "./MainBar";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import FirstNavigation from "./FirstNavigation";
const index = () => {
  return (
    <>
      <Container
        maxWidth=""
        sx={{
          background:
            "URL(" +
            mainpageBackground +
            "),linear-gradient(180deg, #172347 0%, #015268 100%);",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      ></Container>
      <Parallax pages={3} >
        <ParallaxLayer offset={0}>
          <MainBar/>
          <Banner/>
          <FirstNavigation/>
        </ParallaxLayer>
        <ParallaxLayer offset={0.8} style={{justifyContent:"flex-end",display: 'flex'}}>
          <Box>Hello</Box>
        </ParallaxLayer>
      </Parallax>
    </>
  );
};

export default index;
