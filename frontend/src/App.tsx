import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar'; // Corrected import path
import Workout from './components/workout';
import './App.css';

function App() {
  const items = ["Home", "Workout", "Contact"];

  return (
    <Router>
      <div>
        <NavBar 
          brandName="HoopLab" 
          imageSrcPath={''} 
          navItems={items}
        />
        <Routes>
          <Route path="/workout" element={<Workout />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
