import React from 'react'
import ReactApexChart from 'react-apexcharts';
import BaseOptionChart from './BaseOptionChart';

const SsbBarChart = ({graph}) => {
    const xaxis = { ...BaseOptionChart().xaxis, ...graph.xaxis }
    const chartOptions = { ...BaseOptionChart(), xaxis}
    console.log(graph.series[0]['data']);
    console.log(graph.xaxis.categories[0]);
    return (
      <>
        <ReactApexChart type="bar" options={chartOptions} series={graph.series} height={370} background={"#000000"} />
      </>
    )
}

export default SsbBarChart
