import React from 'react'
import ReactApexChart from 'react-apexcharts';
import BaseOptionChart from './BaseOptionChart';
const SsbWaveChart = ({ graph }) => {
  console.log(graph)
  const xaxis = { ...BaseOptionChart().xaxis, ...graph.xaxis }
  console.log(xaxis)
  const chartOptions = { ...BaseOptionChart(), xaxis}
  return (
    <>
      <ReactApexChart type="area" options={chartOptions} series={graph.series} height={370} background={"#000000"} />
    </>
  )
}

export default SsbWaveChart