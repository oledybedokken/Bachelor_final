import React from 'react'
import {PieChart, Pie, Legend, Tooltip, ResponsiveContainer} from 'recharts';
import SourceFinder from "../../Apis/SourceFinder";
import Inntekt from '.';



const Chart = ({ data }) => {
    {data && console.log(data.features)}
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default Chart