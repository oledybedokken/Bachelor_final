import React, { useContext } from 'react';
import './App.css';
import routes from './routes';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CssBaseline } from '@mui/material';
function App() {
  return (
        <Suspense fallback={<p>Loading...</p>}>
          <CssBaseline/>
          <Routes>
            {routes.map((route, index) => {
              return (
                <Route path={route.path} element={<route.element />} key={index}></Route>
              )
            })}
          </Routes>
        </Suspense>
  );
}

export default App;