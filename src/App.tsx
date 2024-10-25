// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Scheduler from './Scheduler';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<h2>Welcome to the App!</h2>} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/scheduler-editor" element={<Scheduler />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
