import React, { useContext } from 'react';
import './App.css';
import routes from './routes';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Container, CssBaseline } from '@mui/material';
import { BeatLoader } from 'react-spinners';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ColorModeContext } from './context/ColorModeContext';
const queryClient = new QueryClient()
function App() {
  const colorMode = useContext(ColorModeContext);
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline/>
        <Suspense fallback={<Container sx={{ background:"linear-gradient(to bottom right, #1c527e 50%, #0d4b62 50%);",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            position: "absolute",height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><BeatLoader color={'#123abc'} /></Container>}>
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