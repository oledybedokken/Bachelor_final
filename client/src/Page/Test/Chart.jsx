import React from 'react'
import { LineChart,CartesianGrid,XAxis,YAxis,Tooltip,Legend,Line } from 'recharts'
const Chart = ({data}) => {
    console.log(data)
  return (
    <div>
        <LineChart width={730} height={250} data={data.features}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="" stroke="#8884d8" />
  <Line type="monotone" dataKey="properties.value" stroke="#82ca9d" />
</LineChart>
    </div>
  )
}

export default Chart