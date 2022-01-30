import './App.css';
import routes from './routes';
import {Routes, Route} from 'react-router-dom';
import { SourceContextProvider } from './context/SourceContext';
import { Suspense } from 'react';
import Home from './Page/Home';
import MapSide from './Page/MapSide';
function App() {
/*   return (
    <div className="App">
      <Suspense fallback={<p>Loading...</p>}>

      <Routes>
        {routes.map((info,index)=>(
          <Route path={info.path} element={<info.comp/>} key={index}></Route>
          <Route exact path ="/MapSide" element={<MapSide/>}></Route>
        ))}
      </Routes>
      </Suspense>
    </div>
  ); */

  return(
    <SourceContextProvider>
      <div className='container'>
        <Routes>
          <Route exact path ="/" element={<Home/>}/>
          <Route exact path="/MapSide" element={<MapSide/>}/>
        </Routes>

      </div>
    </SourceContextProvider>
  );
}

export default App;
