import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Workouts from './components/Workouts';
import Leaderboard from './components/Leaderboard';

const Home = () => (
  <div className="container my-4">
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Welcome to OctoFit Tracker</h2>
        <p className="card-text">
          This React frontend is connected to the Django REST API backend. Use the navigation menu to explore users, teams, activities,
          workouts, and leaderboard scores.
        </p>
        <p className="card-text text-muted">The app uses Bootstrap styling for a clean and consistent dashboard layout.</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {['Home', 'Users', 'Teams', 'Activities', 'Workouts', 'Leaderboard'].map((label) => {
                const path = label === 'Home' ? '/' : `/${label.toLowerCase()}`;
                return (
                  <li key={label} className="nav-item">
                    <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to={path}>
                      {label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}

export default App;
