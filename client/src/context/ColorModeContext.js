import React, { useState, createContext, useMemo } from "react";
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
export const ColorModeContext = createContext({toggleColorMode:()=>{}});
export const ColorModeContextProvider = props => {
    const [mode,setMode] = useState("light");
    const colorMode = useMemo(
        ()=>({
            toggleColorMode: ()=>{
                setMode((prevMode)=>(prevMode ==="light"?"dark":"light"))
            },
            mode,
        }),
        [mode]
    );
    const theme = useMemo(
        ()=>
        createTheme({
            palette: {
              mode,
              primary:{
                  main:"#2196f3"
              }
            },
          })
    )
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme ={theme}>{props.children}</ThemeProvider>
        </ColorModeContext.Provider>
    )
}