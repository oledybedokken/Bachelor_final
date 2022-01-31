import React from 'react'
const Home = React.lazy(()=>import("./Page/Home"));
const Map = React.lazy(()=>import("./Page/Map"));
const routes=[
    {
        path:"/",element:Home
    },
    {
        path:"/map",element:Map
    }
]
export default routes;
