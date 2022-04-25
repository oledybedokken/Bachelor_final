import React, { useContext, useMemo, useEffect } from 'react';
import './App.css';
import routes from './routes';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoadingScreen from './Components/LoadingScreen';
import { CssBaseline } from '@mui/material';
import { LazyMotion } from "framer-motion"

const queryClient = new QueryClient()
function App() {
  const loadFeatures = () => import('./Settings/features').then((res) => res.default);
  return (
    <QueryClientProvider client={queryClient}>
      <LazyMotion strict features={loadFeatures}>
        <Suspense fallback={
          <>
            <LoadingScreen />
          </>}>
          <CssBaseline />
          <Routes>
            {routes.map((route, index) => {
              return (
                <Route path={route.path} element={<route.element />} key={index}></Route>
              )
            })}
          </Routes>
        </Suspense>
      </LazyMotion>
    </QueryClientProvider >
  );
}

export default App;