import React from 'react'
import { Paper, Button, Typography } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
const SlideShow = () => {

    const cards = [
        { url: "https://images.pexels.com/photos/6882085/pexels-photo-6882085.jpeg?cs=srgb&dl=pexels-yaroslav-shuraev-6882085.jpg&fm=jpg", label: "From freezing winters to warm summers, see the history of norwegian temperatures.", heading: "Temperatures" },
        { url: "https://images.pexels.com/photos/3384695/pexels-photo-3384695.jpeg?cs=srgb&dl=pexels-stein-egil-liland-3384695.jpg&fm=jpg", label: "Heavy wind speeds are common in Norway. Checkout out the history of wind speeds in Norway over the last 50 years.", heading: "Wind" },
        { url: "https://cdn.pixabay.com/photo/2019/05/16/21/34/bergen-4208335_960_720.jpg", label: "Ever been to Bergen, well then you know about the rain. Check out the history of humidity for the last 50 years in Norway.", heading: "Humidity" }]

    return (
        <Swiper
        slidesPerView={"auto"}
        centeredSlides={true}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        rewind={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper"
      >
        {cards.map((item)=>(
        <SwiperSlide><Item item={item}></Item></SwiperSlide>))}
        </Swiper>
    )
    function Item(props) {
        return (
            <Paper sx={{backgroundImage: 'url(' + props.item.url + ')', height: "500px", backgroundSize: 'cover',backgroundPosition: 'center',display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"Center",boxShadow: "0px 4px 4px 0px #00000040,inset 0 0 0 1000px rgba(0,0,0,.5)"}} >
                <Typography variant="h3" color="#fff" sx={{fontWeight:700}}>{props.item.heading}</Typography>
                <Typography variant="body" color="#fff" sx={{pt:"2%"}}>{props.item.label}</Typography>
                <Button className="CheckButton" variant="contained" sx={{mt:"5%"}}>
                    Check it out!
                </Button>
            </Paper>
        )
    }
}

export default SlideShow