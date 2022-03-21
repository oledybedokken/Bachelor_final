import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ColorModeContextProvider } from './context/ColorModeContext';
ReactDOM.render(
  <BrowserRouter>
    <ColorModeContextProvider>
      <App />
    </ColorModeContextProvider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);

