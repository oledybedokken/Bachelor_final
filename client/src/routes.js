import React from 'react'
const Home = React.lazy(()=>import("./Page/Home"));
const Map = React.lazy(()=>import("./Page/Map"));
const SourceTesting = React.lazy(()=>import("./Page/SourceTesting"));
const routes=[
    {
        path:"/",element:Home
    },
    {
        path:"/map",element:Map
    },
    {path:"/sourcetesting",element:SourceTesting}
]
export default routes;
