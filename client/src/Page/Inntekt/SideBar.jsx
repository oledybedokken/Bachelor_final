import React from "react";
import { Box, Button } from "@mui/material";
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
        return (
          <>
            <div display = "flex">
              <h1 >{sted.properties.navn} - {sted.properties.value} kr</h1>
              <Button onClick={()=>RemoveItem(sted)}>Remove</Button>
            </div>
          </>
        );
      })}
    </Box>
  );
};

export default SideBar;
