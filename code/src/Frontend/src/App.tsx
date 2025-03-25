import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  LandingPage from "./LandingPage";
import Results from './Results'; // Import the Results page

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;
