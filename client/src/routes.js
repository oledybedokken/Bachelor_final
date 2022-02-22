import React from 'react'
const Home = React.lazy(()=>import("./Page/Home"));
const Map = React.lazy(()=>import("./Page/Map"));
const SourceTesting = React.lazy(()=>import("./Page/SourceTesting"));
const Test = React.lazy(()=>import("./Page/Test"));
const Test2 = React.lazy(()=>import("./Page/Test2"));
const routes=[
    {
        path:"/",element:Home
    },
    {
        path:"/map",element:Map
    },
    {path:"/sourcetesting",element:SourceTesting},
    {path:"/test",element:Test},
    {path:"/test2",element:Test2},
]
export default routes;
