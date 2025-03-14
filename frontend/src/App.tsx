import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar';
import Workout from './components/workout';
import './App.css';
import { useAuth } from "react-oidc-context";


function App() {
  
  const auth = useAuth();
  const items = ["Home", "Workout", "Contact"];

  useEffect(() => {
    if (!auth.isLoading) {
        console.log("User is authenticated:", auth.isAuthenticated);
        console.log("User info:", auth.user); // Log the entire user object for more details
    }
}, [auth.isLoading, auth.isAuthenticated, auth.user]);

  const signOutRedirect = () => {
    console.log("Signing out...");
    auth.removeUser()
    const clientId = "6ciq9qotdr1snk75j014hg6q49";
    const logoutUri = "http://localhost:3000/workout";
    const cognitoDomain = "https://ca-central-12ndsdd4r9.auth.ca-central-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };
  

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  // if (auth.isAuthenticated) {  // Check if the user is authenticated
  //   const userName = auth.user?.profile.name || auth.user?.profile.given_name || "User"; // Get name; provide default if not available
  //   // OR
  //   const userEmail = auth.user?.profile.email; //get email
  //   return (
  //     <div>
  //       <p>Hello, {userName}!</p>  {/* Display the user's name */}
  //       <p>Your email: {userEmail}</p> {/* Display user's email */}
  //       <button onClick={() => auth.signoutRedirect()}>Sign Out</button>
  //     </div>
  //   );
  // }

  return (
      <Router>
        <div>
          
          <button onClick={() => auth.signinRedirect()}>Sign in</button>
          <button onClick={() => signOutRedirect()}>Sign out</button>
          <p>{auth.user?.profile.name}</p>
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
