import './App.css';
import Navbar from './Navbar';
import { Component } from 'react';
import Home from './pages/Home';
import Q1 from './pages/Q1';
import Q2 from './pages/Q2';
import Q3 from './pages/Q3';
import Q4 from './pages/Q4';
import Q5 from './pages/Q5';
import {Route, Routes} from 'react-router-dom';

function App() {
  
  return (
      <>

        <div className="App">
            <Navbar/>

            <Routes>
              <Route path="/Home" element={<Home/>}/>
              <Route path="/Q1" element={<Q1/>}/>
              <Route path="/Q2" element={<Q2/>}/>
              <Route path="/Q3" element={<Q3/>}/>
              <Route path="/Q4" element={<Q4/>}/>
              <Route path="/Q5" element={<Q5/>}/>
            </Routes>


        </div>
      </>
  );
}

export default App;
