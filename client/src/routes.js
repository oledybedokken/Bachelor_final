import React from 'react'
const Home = React.lazy(()=>import("./Page/Home"));
const Værdata = React.lazy(()=>import("./Page/Værdata"));
const Inntekt = React.lazy(()=>import("./Page/Inntekt"))
const routes=[
    {
        path:"/",element:Home
    },
    {path:"/vaermap",element:Værdata},
    {path:"/inntekt",element:Inntekt}
]
export default routes;
