import React, { useContext } from "react";
import Banner from "./Banner";
import { Box, Card, CardMedia, Container } from "@mui/material";
import mainpageBackground from "../../Assets/mainpageBackground.png";
import MainBar from "./MainBar";
import FirstNavigation from "./FirstNavigation";
import { ColorModeContext } from '../../Context/ColorModeContext';
import SecondSection from "./SecondSection/SecondSection";
import ThirdSection from "./ThirdSection/ThirdSection";
import Footer from "../../Components/Layout/Footer"
const Home = () => {
  const colorMode = useContext(ColorModeContext);
  return (
    <>
      <Container
        maxWidth=""
        disableGutters
        sx={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <MainBar colorMode={colorMode} />
        <Container maxWidth="xl">
          <Banner />
          <FirstNavigation />
        </Container>
        <Container maxWidth="xl" sx={{ mt: "10%" }}>
          <SecondSection colorMode={colorMode}/>
        </Container>
        <Container maxWidth="xl">
          <ThirdSection colorMode={colorMode}/>
        </Container>
        <Footer/>
      </Container>
    </>
  );
};

export default Home;
/*import { Image } from "mui-image";
import skyAndSun from "../../Assets/skyAndSun.png";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
<ParallaxLayer offset={0.7} speed={-0.2} duration={500} style={{ width: '20%', marginLeft: '70%', height: "150px" }}>
          <Image src={skyAndSun} fit="fill" />
        </ParallaxLayer>
        <ParallaxLayer>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://images.pexels.com/photos/3384695/pexels-photo-3384695.jpeg?cs=srgb&dl=pexels-stein-egil-liland-3384695.jpg&fm=jpg"
              alt="green iguana"
            />
          </Card>
        </ParallaxLayer>
        <ParallaxLayer offset={1}>
          <Container maxWidth="xl" sx={{display: "flex", justifyContent: "center"}} >
            <Box sx={{ width: "90%",display:"flex",justifyContent:"space-between"}}>
              <Box sx={{ width: "400px" }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image="https://images.pexels.com/photos/6882085/pexels-photo-6882085.jpeg?cs=srgb&dl=pexels-yaroslav-shuraev-6882085.jpg&fm=jpg"
                    alt="green iguana"
                  /></Card>
              </Box>
              <Box sx={{ width: "400px" }}>
                <Card><CardMedia
                  component="img"
                  height="200"
                  image="https://images.pexels.com/photos/360912/pexels-photo-360912.jpeg?cs=srgb&dl=pexels-visit-greenland-360912.jpg&fm=jpg"
                  alt="green iguana"
                /></Card>
              </Box>
            </Box>
          </Container>
        </ParallaxLayer> */