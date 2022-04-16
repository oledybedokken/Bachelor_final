import React, { useState, createContext, useMemo } from "react";
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
export const ColorModeContext = createContext({toggleColorMode:()=>{}});
export const ColorModeContextProvider = props => {
    const [mode,setMode] = useState("dark");
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
                  main:"#015268"
              },
              secondary:{
                  main:"#04E2B7"
              },
              background:{
                default:"linear-gradient(180deg, #172347 0%, #015268 100%)"
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