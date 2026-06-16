import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const leagues = [
  { name: 'Premier League', code: 'PL' },
  { name: 'La Liga', code: 'PD' },
  { name: 'Serie A', code: 'SA' },
  { name: 'Bundesliga', code: 'BL1' },
  { name: 'Ligue 1', code: 'FL1' },
  { name: 'Champions League', code: 'CL' },
  { name: 'Euro Championship', code: 'EC' }
];

export default function Navbar() {
  return (
    <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-md font-light tracking-widest text-emerald-400 hover:opacity-80 transition-opacity">
          FOOTBALL<span className="font-medium text-slate-200">HUB</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          {leagues.map((league) => (
            <NavLink
              key={league.code}
              to={`/league/${league.code}`}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-900/50'
                }`
              }
            >
              {league.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}