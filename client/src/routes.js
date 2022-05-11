import React from 'react'
import {useRoutes} from 'react-router-dom';
const OldHome = React.lazy(()=>import("./Page/Home"));
const weatherData = React.lazy(()=>import("./Page/Værdata"));
const Help = React.lazy(() => import("./Page/Help"));
const Ssb = React.lazy(()=>import("./Page/Ssb"))
const SsbMapView = React.lazy(()=>import("./Page/Ssb/Maps"))
const Error = React.lazy(()=>import("./Page/Error"))
const MainWeatherData = React.lazy(()=>import("./Page/VærDataNew"));
const WeatherAdmin = React.lazy(()=>import("./Page/VærDataNew/Admin"))
export default function Router(){
    return useRoutes([
        {path:"/",element:<OldHome/>},
        {path:"/weather",element:<weatherData/>},
        {path:"/help",element:<Help/>},
        {path:"/ssb",element:<Ssb/>},
        {path:"/ssb/map/:id",element:<SsbMapView/>},
        {path:"/*", element: <Error/>},
        {path:"/weathertest",element:<MainWeatherData/>},
        {path:"/weathertest/admin",element:<WeatherAdmin/>}
    ])
}
//export default routes;
/* 
const SsbData = React.lazy(() => import("./Page/SsbData"));
const SsbDataId = React.lazy(() => import("./Page/SsbVisualization"));
{path:"/ssb",element:SsbData},
    {path:"/ssb/:id",element:SsbDataId}, */