import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Apply from './pages/Apply';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <h1>Vitto</h1>
              <span className="nav-tagline">Loan Application Portal</span>
            </div>
            <ul className="nav-links">
              <li>
                <NavLink 
                  to="/apply" 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                  Apply
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/apply" replace />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
