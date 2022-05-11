import React, { createContext, useState } from 'react'
export const UserSettingsContext = createContext();
export const UserSettingsContextProvider = (props) => {
  const[fullScreen,setFullScreen]=useState(false)
  const [playSpeed, setPlaySpeed] = useState(5);
  const[chosenRegion,setChosenRegion]=useState([])
  const [timeSettings, setTimeSettings] = useState("slider")
  return (
    <UserSettingsContext.Provider
      value={{
        timeSettings,
        setTimeSettings,
        fullScreen,
        setFullScreen,
        playSpeed,
        setPlaySpeed,
        chosenRegion,
        setChosenRegion
      }}
    >
      {props.children}
    </UserSettingsContext.Provider>
  );
};
export default UserSettingsContext