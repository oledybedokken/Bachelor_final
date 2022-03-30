import React, { useContext } from 'react';
import './App.css';
import routes from './routes';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
  );
}

export default App;