import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import api from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && (
          <nav className="navbar">
            <h1>💰 Finance Tracker</h1>
            <div className="nav-links">
              <span>{user.email}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </nav>
        )}
        
        <Routes>
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/dashboard" /> : <AuthPage setUser={setUser} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/add" 
            element={user ? <AddExpense /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/auth"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
