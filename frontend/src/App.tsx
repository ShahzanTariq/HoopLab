import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar';
import Workout from './pages/workout';
import './App.css';
import { useAuth } from "react-oidc-context";
import LogButton from './components/logbutton';

function App() {
  
  const items = ["Home", "Workout", "Contact"];
  
  const auth = useAuth();

  return (
      <Router>
        <div>
          <LogButton />
          <div>{auth.user?.profile.name || 'Guest'}</div>
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
