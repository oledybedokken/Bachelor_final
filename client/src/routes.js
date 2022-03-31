import React from 'react'
import Home from './Page/Home';
import newInntekt from './Page/Inntekt';
const OldHome = React.lazy(()=>import("./Page/Home"));
const weatherData = React.lazy(()=>import("./Page/Værdata"));
const Incomes = React.lazy(()=>import("./Page/Inntekt"))
const PieChartTest = React.lazy(() => import("./Page/PieChartTest"));
const SsbData = React.lazy(() => import("./Page/SsbData"));

const routes=[
    {
        path:"/",element:Home
    },
    {path:"/weather",element:weatherData},
    {path:"/incomes",element:Incomes},
    {path:"/ptest",element:PieChartTest},
    {path:"/ssb",element:SsbData}
]
export default routes;
