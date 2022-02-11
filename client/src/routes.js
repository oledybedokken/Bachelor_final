import React from 'react'
const Home = React.lazy(()=>import("./Page/Home"));
const Map = React.lazy(()=>import("./Page/Map"));
const SourceTesting = React.lazy(()=>import("./Page/SourceTesting"));
const Test = React.lazy(()=>import("./Page/Test"));
const routes=[
    {
        path:"/",element:Home
    },
    {
        path:"/map",element:Map
    },
    {path:"/sourcetesting",element:SourceTesting},
    {path:"/test",element:Test},
]
export default routes;
