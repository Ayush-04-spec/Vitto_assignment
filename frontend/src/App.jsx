import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Apply from './pages/Apply';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import './App.css';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isFrosted = location.pathname === '/login' || location.pathname === '/apply' || location.pathname === '/dashboard';
  const navClass = isFrosted ? 'navbar nav-frosted' : 'navbar nav-solid';

  return (
    <nav className={navClass}>
      <div className="nav-container">
        <div className="nav-brand">
          <h1>Vitto</h1>
          <span className="nav-tagline">Loan Application Portal</span>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/apply" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Apply
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Dashboard
              </NavLink>
            </li>
          )}
          {!user && (
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Dashboard Login
              </NavLink>
            </li>
          )}
        </ul>
        {user && (
          <div className="nav-user">
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-button">Sign out</button>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/apply" replace />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
