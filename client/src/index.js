import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ColorModeContextProvider } from './context/ColorModeContext';
/* ReactDOM.render(
  <BrowserRouter>
    <ColorModeContextProvider>
      <App />
    </ColorModeContextProvider>
  </BrowserRouter>
  ,
  document.getElementById('root')
); */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter>
  <ColorModeContextProvider>
    <App />
  </ColorModeContextProvider>
</BrowserRouter>)

