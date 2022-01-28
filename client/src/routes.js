import React from 'react'
const Home = React.lazy(()=>import("./Page/Home"));
const MapSide = React.lazy(()=>import("./Page/MapSide"));
const routes=[
    {
        path:"/",comp:Home
    },
    {
        poath:"/map", comp:MapSide
    }
]
export default routes;
