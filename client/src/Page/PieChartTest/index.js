import React from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts'; // Bar
const PieChartTest = () => {
    const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
    ];
    console.log(data);
    return (
        <>
            <h1>Hello Graph</h1>
            <div>
                <BarChart width={1500} height={400} data={data}>
                    <Bar dataKey="uv" fill="#8884d8" />
                </BarChart>
            </div>
        </>
    );
};

export default PieChartTest;
{/* 

import Palette from "../Inntekt/Palette";
<Palette/>
<PieChart width={200} height={200}>
    <Pie
        dataKey="value"
        isAnimationActive={false}
        data={data01}
        cx="50%"
        cy="50%"
        outerRadius={40}
        fill="#8884d8"
        label
    />
    <Tooltip />
</PieChart> */}
/* const data01 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
        { name: 'Group E', value: 278 },
        { name: 'Group F', value: 189 },
    ]; */