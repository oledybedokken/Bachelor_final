import React, { createContext, useState } from 'react'
export const SsbContext = createContext();
export const SsbContextProvider = (props) => {
  const [sorting, setSorting] = useState("");
  return (
    <SsbContext.Provider
      value={{
        sorting,
        setSorting,
      }}
    >
      {props.children}
    </SsbContext.Provider>
  );
};

export default SsbContext