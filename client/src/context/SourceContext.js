import React, {useState, createContext} from "react";

export const SourceContext = createContext();

export const SourceContextProvider = props => {
    const[sources, setSources] = useState([])


return(
    <SourceContext.Provider value={{sources, setSources}}>
        {props.child}
    </SourceContext.Provider>
)
}