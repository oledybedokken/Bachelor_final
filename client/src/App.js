import React from 'react';
import './App.css';
//import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoadingScreen from './Components/LoadingScreen';
import { CssBaseline } from '@mui/material';
import Route from './routes';
import ChartStyle from './Components/Chart/ChartStyle';
const queryClient = new QueryClient()
function App() {
  const loadFeatures = () => import('./Settings/features').then((res) => res.default);
  return (
    <QueryClientProvider client={queryClient}>
        <Suspense fallback={
          <>
            <LoadingScreen />
          </>}>
          <ChartStyle/>
          <CssBaseline />
            <Route />
        </Suspense>
    </QueryClientProvider >
  );
}

export default App;