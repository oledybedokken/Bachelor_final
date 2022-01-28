import './App.css';
import routes from './routes';
import {Routes, Route} from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Routes>
        {routes.map((info,index)=>(
          <Route path={info.path} element={<info.comp/>} key={index}></Route>
        ))}
      </Routes>
    </div>
  );
}

export default App;
