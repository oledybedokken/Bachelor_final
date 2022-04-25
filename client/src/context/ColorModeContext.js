import React, { useState, createContext, useMemo } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import palette from "../Theme/Palette";
import typography from "../Theme/Typography";
import ComponentsOverrides from "../Theme/overrides";
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
    const themeColors = useMemo(
        () =>({
                palette:mode==="dark"?palette.dark:palette.light,
                typography,
                shape: { borderRadius: 8 },
            }), [mode]
    )
    const theme = createTheme(themeColors)
    theme.components=ComponentsOverrides(theme)
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
        </ColorModeContext.Provider>
        //test
    )
}
/* palette: {
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
        paper:mode==="dark"?"#212B36":"#ffffff",
        default:mode==="dark"?"#161C24":"#ffffff",
        neutral: mode==="dark"?alpha("#919EAB",0.16):"#F4F6F8",
    },
    text:{
        cards:mode==="dark"?"#000000":"#fff",
    },
    action:{
        active:"#fff",
        selected:mode==="dark"?alpha("#919EAB",0.16):"#fff",
    },
    navBarButton:{
        main: "#fff",
        light: "#ffffff",
        dark: "#b2b2b2"
    },
}, */