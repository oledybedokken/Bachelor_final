import React, { useState, createContext, useMemo } from "react";
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
export const ColorModeContext = createContext({ toggleColorMode: () => { } });
export const ColorModeContextProvider = props => {
    const [mode, setMode] = useState("dark");
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
            },
            mode,
        }),
        [mode]
    );
    let theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: "#025385",
                        contrastText: mode === "dark" ? '#fff' : "#000000",
                        light: "#34759d",
                        dark: "#013a5d"
                    },
                    secondary: {
                        main: "#04e2b7",
                        contrastText: mode === "dark" ? '#fff' : "#000000",
                        dark: "#029e80",
                        light: "#36e7c5"
                    },
                    background: {
                        paper:mode==="dark"?"rgb(18, 18, 18)":"#fff",
                    },
                    text:{
                        cards:mode==="dark"?"#000000":"#fff",
                    }
                },
                Paper: {
                    backgroundColor: "#fff"
                }
            }), [mode]
    )
    theme = responsiveFontSizes(theme);
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
        </ColorModeContext.Provider>
    )
}