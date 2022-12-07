import {Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Components/Home';
import NavBar from './Components/Navbar';
import Login from './Components/Login';
import Upload from './Components/Upload';
import Download from './Components/Download';
import './App.css';


function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/Login' exact element={<Login />} />
          <Route path='/Upload' exact element={<Upload />} />
          <Route path='/Download' exact element={<Download />} />
      </Routes>
    </div>
);
}

export default App;
