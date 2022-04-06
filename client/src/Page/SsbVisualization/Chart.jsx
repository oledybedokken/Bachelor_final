import React from 'react'
import {PieChart, Pie} from 'recharts';


const Chart = ({ data }) => {
    {data && console.log(data.features.slice(0,5))}
    return (
        <>
        {data &&
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="properties.value"
                    nameKey="properties.navn"
                    isAnimationActive={false}
                    data={data.features.slice(0,5)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                />
            </PieChart>
        }</>
    )
}

export default Chart