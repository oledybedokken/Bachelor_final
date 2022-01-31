import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import { SourceContextProvider } from './context/SourceContext';
ReactDOM.render(
    <BrowserRouter>
    <SourceContextProvider>
    <App />
    </SourceContextProvider>
    </BrowserRouter>
,
  document.getElementById('root')
);

