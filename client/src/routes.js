import React from 'react'
const Home = React.lazy(()=>import("./Page/Home"));
const weatherData = React.lazy(()=>import("./Page/Værdata"));
const Incomes = React.lazy(()=>import("./Page/Inntekt"))
const PieChartTest = React.lazy(() => import("./Page/PieChartTest"));
const routes=[
    {
        path:"/",element:Home
    },
    {path:"/weather",element:weatherData},
    {path:"/incomes",element:Incomes},
    {path:"/ptest",element:PieChartTest}
]
export default routes;
