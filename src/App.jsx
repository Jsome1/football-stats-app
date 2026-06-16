import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LeagueDetails from './pages/LeagueDetails';
import TeamDetails from './pages/TeamDetails';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-400">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/league/:code" element={<LeagueDetails />} />
          <Route path="/team/:id" element={<TeamDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}