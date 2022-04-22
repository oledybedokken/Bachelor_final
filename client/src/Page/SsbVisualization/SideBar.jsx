import React, {useMemo,useContext} from "react";
import {Legend, Tooltip} from 'recharts'; // Graph in general
import { BarChart, Bar, XAxis, YAxis } from 'recharts'; // Bar
import { LineChart, Line } from "recharts"; // Line
import { ColorModeContext } from '../../context/ColorModeContext';
import mainpageBackground from "../../Assets/mainpageBackground.png";
import { Box, Button, Container } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SsbContext from '../../context/SsbContext';
const SideBar = ({ setSideBarStatus, valgteSteder, setValgteSteder,sidebarStatus }) => {
  const colorMode = useContext(ColorModeContext)
  const { sorting, setSorting } = useContext(SsbContext);
  function RemoveItem(slettSted){
    setValgteSteder(valgteSteder.filter(sted=>sted!==slettSted))
  }

let color = ['red','blue', 'green', 'orange', 'brown', 'purple', 'pink']
let color2 = ['#750e13', '#da1e28', '#ff8389', '#ffd7d9', '#fff1f1', '#e5f6ff', '#82cfff', '#1192e8', '#00539a']

  // Kommune med flere år
  const kommunedata = useMemo(() => {
    const currArray = []
    valgteSteder.map((sted) => {
      let objsted = {}
      objsted["RegionNumber"] = sted.RegionNumber;
      objsted["Region"] = sted.Region;
      for (const aar in sted[sorting.ContentCode]){
        objsted[aar] = sted[sorting.ContentCode][aar]
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
      for (const aar in stedi[sorting.ContentCode]){
        let objaar = {}
        objaar["aar"] = aar
        valgteSteder.map((sted) => {
          objaar[sted.Region] = sted[sorting.ContentCode][aar]
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
      <Box
      sx={{
        backgroundImage: colorMode.mode === "dark" ?
            "URL(" +
            mainpageBackground +
            "),linear-gradient(180deg, #015267, #162549);" :
            "URL(" +
            mainpageBackground +
            "),#fff",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        //position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        //left: 0,
        //width: "100vw",
        height: "100vh",
      }}
      >
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
            style = {{backgroundColor : "#ffffff"}}
          >
            <XAxis dataKey="aar" />
            <YAxis />
            <Tooltip />
            <Legend />
            {valgteSteder.map((sted, index) => {
                return (
                  <Line type="monotone" dataKey={sted.Region} stroke={color2[index]} />
                );
              })}
          </LineChart>
          <Button sx={{fontSize:"1.5em",color:"white",whiteSpace:"nowrap",":hover":{color:"#fff"},fontWeight:700}} variant="contained" >Download line graph to png</Button>

          <BarChart width={500} height={140} data={kommunedata} style = {{backgroundColor : "#ffffff"}}>
            <XAxis dataKey="Region" />
            <YAxis />
            <Legend />
            <Bar dataKey="2018" fill="#8884d8" />
            <Bar dataKey="2019" fill="#82ca9d" />
            <Bar dataKey="2020" fill="#78aa0d" />
          </BarChart>
          <Button sx={{fontSize:"1.5em",color:"white",whiteSpace:"nowrap",":hover":{color:"#fff"},fontWeight:700}} variant="contained" >Download bar graph to png</Button>
      </Box>
  );
};

export default SideBar;

