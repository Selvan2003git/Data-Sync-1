import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Queries from './pages/Queries';
import Servers from './pages/Servers';
import Settings from './pages/Settings';
import HelpPage from './pages/HelpPage';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/queries" element={<Queries />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}