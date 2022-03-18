import React from 'react';
import './App.css';
import routes from './routes';
import { Routes, Route } from 'react-router-dom';
import { SourceContextProvider } from './context/SourceContext';
import { Suspense } from 'react';
import Layout from './Components/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'mapbox-gl/dist/mapbox-gl.css';
function App() {
  return (
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            {routes.map((route, index) => {
              return (
                <Route path={route.path} element={<route.element />} key={index}></Route>
              )
            })}
          </Routes>
        </Suspense>
      </Layout>
  );
}

export default App;