import React from 'react';
import ReactDOM from 'react-dom';
/* import ReactDOM from 'react-dom/client'; */
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ColorModeContextProvider } from './Context/ColorModeContext';
import { SsbContextProvider } from './Context/SsbContext';
import { UserSettingsContextProvider } from './Context/UserSettingsContext';
ReactDOM.render(
  <BrowserRouter>
    <ColorModeContextProvider>
      <UserSettingsContextProvider>
        <SsbContextProvider>
          <App />
        </SsbContextProvider>
      </UserSettingsContextProvider>
    </ColorModeContextProvider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);
/* const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter>
  <ColorModeContextProvider>
    <App />
  </ColorModeContextProvider>
</BrowserRouter>) */

