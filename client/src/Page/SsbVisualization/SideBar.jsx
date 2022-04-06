import React, {useMemo} from "react";
import {Legend, Tooltip, ResponsiveContainer} from 'recharts'; // Graph in general
import { PieChart, Pie} from 'recharts'; // Pie
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts'; // Bar
import { LineChart, Line } from "recharts";
import { Box, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const SideBar = ({ setSideBarStatus, valgteSteder, setValgteSteder,sidebarStatus }) => {
  function RemoveItem(slettSted){
    setValgteSteder(valgteSteder.filter(sted=>sted!==slettSted))
  }

let color = ['red','blue', 'green', 'orange', 'brown', 'purple', 'pink']

  // Kommune med flere år
  const kommunedata = useMemo(() => {
    const currArray = []
    valgteSteder.map((sted) => {
      let objsted = {}
      objsted["RegionNumber"] = sted.RegionNumber;
      objsted["Region"] = sted.Region;
      for (const aar in sted["Samlet inntekt, median (kr)"]){
        objsted[aar] = sted["Samlet inntekt, median (kr)"][aar]
      }
      currArray.push(objsted)
    })
    
    return currArray;
  }, [valgteSteder])

  //Året med flere kommuner
  const aardata = useMemo(() => {
    const curraarArray = []
    let enSted = valgteSteder.slice(0, 1)
    enSted.map((stedi) => {
      for (const aar in stedi["Samlet inntekt, median (kr)"]){
        let objaar = {}
        objaar["aar"] = aar
        valgteSteder.map((sted) => {
          objaar[sted.Region] = sted["Samlet inntekt, median (kr)"][aar]
        })
        curraarArray.push(objaar)
      }
      /*let objsted = {}
      for (const aar in sted["Samlet inntekt, median (kr)"]){
        objsted["RegionNumber" + aar] = aar
        objsted["Region" + sted["Samlet inntekt, median (kr)"]] = sted["Samlet inntekt, median (kr)"]
        //curraarArray.push(objsted)
      }
      curraarArray.push(objsted)*/
    })
    return curraarArray;
  }, [valgteSteder])
  return (
    <Box>
      <CloseIcon
        onClick={() => setSideBarStatus(!sidebarStatus)}
        fontSize="large"
        sx={{ cursor: "pointer", width: "50px", height: "50px" }}
      ></CloseIcon>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow>
              <TableCell>Kommune Nr</TableCell>
              <TableCell>Kommune</TableCell>
              <TableCell >Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {valgteSteder.map((sted) => {
              return (
                //Bruk data Grid istedet: https://mui.com/components/tables/
                <TableRow key ={sted.RegionNumber}> 
                  <TableCell>{sted.RegionNumber}</TableCell>
                  <TableCell>{sted.Region}</TableCell>
                  <TableCell><Button onClick={()=>RemoveItem(sted)} >Remove</Button></TableCell>
                </TableRow>
              
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <BarChart width={500} height={140} data={kommunedata}>
        <XAxis dataKey="Region" />
        <YAxis />
        <Legend />
        <Bar dataKey="2017" fill="#8884d8" />
        <Bar dataKey="2018" fill="#82ca9d" />
        <Bar dataKey="2020" fill="#78aa0d" />
      </BarChart>
      
      <LineChart
          width={500}
          height={300}
          data={aardata}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="aar" />
          <YAxis />
          <Tooltip />
          <Legend />
          {valgteSteder.map((sted, index) => {
              return (
                <Line type="monotone" dataKey={sted.Region} stroke={color[index]} />
              );
            })}
        </LineChart>
    </Box>
  );
};

export default SideBar;

//Soppel

/* 
<PieChart width={400} height={400}>
                <Pie
                  dataKey= "value"
                  isAnimationActive={false}
                  data={sted.properties.value}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                  
                />
              </PieChart> 

*/


