import React, { useState, createContext } from "react";

export const SourceContext = createContext();

export const SourceContextProvider = props => {
    const [sources, setSources] = useState(null)
    return (
        <SourceContext.Provider value={{ sources, setSources }}>
            {props.children}
        </SourceContext.Provider>
    )
}