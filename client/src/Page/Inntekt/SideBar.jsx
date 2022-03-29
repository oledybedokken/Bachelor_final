import React from "react";
import { Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
const SideBar = ({ setSideBarStatus, valgteSteder, setValgteSteder,sidebarStatus }) => {
  function RemoveItem(slettSted){
    setValgteSteder(valgteSteder.filter(sted=>sted!==slettSted))
  }
  return (
    <Box>
      <CloseIcon
        onClick={() => setSideBarStatus(!sidebarStatus)}
        fontSize="large"
        sx={{ cursor: "pointer", width: "50px", height: "50px" }}
      ></CloseIcon>
      {valgteSteder.map((sted) => {
        return <h1 onClick={()=>RemoveItem(sted)}>{sted.properties.navn}</h1>;
      })}
    </Box>
  );
};

export default SideBar;
