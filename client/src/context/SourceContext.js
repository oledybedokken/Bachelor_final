import React, { useState, createContext } from "react";

export const SourceContext = createContext();

export const SourceContextProvider = props => {
    const [sources, setSources] = useState(null)
    const[cities, setCities] = useState(null)
    return (
        <SourceContext.Provider value={{ sources, setSources, cities, setCities }}>
            {props.children}
        </SourceContext.Provider>
    )
}