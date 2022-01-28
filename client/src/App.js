import './App.css';
import routes from './routes';
import {Routes, Route} from 'react-router-dom';
import { Suspense } from 'react';
function App() {
  return (
    <div className="App">
      <Suspense fallback={<p>Loading...</p>}>

      <Routes>
        {routes.map((info,index)=>(
          <Route path={info.path} element={<info.comp/>} key={index}></Route>
        ))}
      </Routes>
      </Suspense>
    </div>
  );
}

export default App;
