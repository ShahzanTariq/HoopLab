import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@mantine/core/styles.css';
import Header from './components/header';
import Workout from './pages/workout';
import Profile from './pages/profile';


function App() {

  return (
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/workout" element={<Workout />} />
            <Route path="/user/:username" element={<Profile />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </Router>
  );
}

export default App;
