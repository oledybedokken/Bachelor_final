import React, { createContext, useState } from 'react'
export const SsbContext = createContext();
export const SsbContextProvider = (props) => {
  const [sorting, setSorting] = useState("");
  const [options, setOptions] = useState("");
  const [id,setId] = useState("")
  const [customFilter, setCustomFilter] = useState({showZero:true});
  const [mapformat, setMapformat] = useState("choropleth");
  const[fullScreen,setFullScreen]=useState(false)
  return (
    <SsbContext.Provider
      value={{
        sorting,
        setSorting,
        options,
        setOptions,
        customFilter,
        setCustomFilter,
        mapformat,
        setMapformat,
        fullScreen,
        setFullScreen,
        id,
        setId
      }}
    >
      {props.children}
    </SsbContext.Provider>
  );
};
export default SsbContext
