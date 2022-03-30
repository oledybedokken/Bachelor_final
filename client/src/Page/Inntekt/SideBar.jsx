import React, {useMemo} from "react";
import {Legend, Tooltip, ResponsiveContainer} from 'recharts'; // Graph in general
import { PieChart, Pie} from 'recharts'; // Pie
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts'; // Bar
import { Box, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
const SideBar = ({ setSideBarStatus, valgteSteder, setValgteSteder,sidebarStatus }) => {
  function RemoveItem(slettSted){
    setValgteSteder(valgteSteder.filter(sted=>sted!==slettSted))
  }
  //
  const data = useMemo(() => {
    const currArray = []
  valgteSteder.map((sted) => {
    console.log(sted)
    let objsted = {}
    objsted["name"] = sted.navn;
    objsted["value"] = sted.inntekt[2017];
    currArray.push(objsted)
  })
  return currArray;
  }, [valgteSteder])
  //
  return (
    <Box>
      <CloseIcon
        onClick={() => setSideBarStatus(!sidebarStatus)}
        fontSize="large"
        sx={{ cursor: "pointer", width: "50px", height: "50px" }}
      ></CloseIcon>
      {valgteSteder.map((sted) => {
        return (
          <>
            <div display = {"flex"}>
              <h1 >{sted.navn} - {sted.inntekt[2012]} kr</h1>
              <Button onClick={()=>RemoveItem(sted)}>Remove</Button>
            </div>
          </>
             
          
        );
      })}

      <BarChart width={150} height={40} data={data}>
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
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

/*
<ResponsiveContainer width="100%" height="100%">
              <BarChart width={150} height={40} data={data}>
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer> 
*/