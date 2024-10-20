import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { Button } from "@mui/joy"
import { Corporation } from './components/Corporation'
import { Student } from './components/Student'
import { Government } from './components/Government'
import { Request } from './components/Request'
import { Consumer } from './components/Consumer'
import './App.css';

function App() {
  return (

    <BrowserRouter>

      <Button>
        <Link to="/corporation">Corporation</Link>
      </Button>      
      <Button>
        <Link to="/student">Student</Link>
      </Button>      
      <Button>
        <Link to="/government">Government</Link>
      </Button>      
      <Button>
        <Link to="/request">Request</Link>
      </Button>
      <Button>
        <Link to="/consumer">Consumer</Link>
      </Button>
      <Routes>
        <Route path="/corporation" element={<Corporation/>} />
        <Route path="/student" element={<Student/>} />
        <Route path="/government" element={<Government/>} />
        <Route path="/request" element={<Request/>} />
        <Route path="/consumer" element={<Consumer/>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
