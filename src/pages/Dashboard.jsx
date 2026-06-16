import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const topLeagues = [
  { name: 'Premier League', code: 'PL', country: 'England', teams: 20, color: 'from-purple-600/20 to-indigo-600/5' },
  { name: 'La Liga', code: 'PD', country: 'Spain', teams: 20, color: 'from-amber-600/20 to-orange-600/5' },
  { name: 'Serie A', code: 'SA', country: 'Italy', teams: 20, color: 'from-blue-600/20 to-cyan-600/5' },
  { name: 'Bundesliga', code: 'BL1', country: 'Germany', teams: 18, color: 'from-red-600/20 to-rose-600/5' },
  { name: 'Ligue 1', code: 'FL1', country: 'France', teams: 18, color: 'from-emerald-600/20 to-teal-600/5' },
  { name: 'Champions League', code: 'CL', country: 'Europe', teams: 36, color: 'from-indigo-600/20 to-blue-600/5' },
  { name: 'Euro Championship', code: 'EC', country: 'Europe', teams: 24, color: 'from-sky-600/20 to-emerald-600/5' }
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeagues = topLeagues.filter((league) =>
    league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-slate-100">Elite Competitions</h1>
          <p className="text-sm text-slate-400 mt-1 font-light">Select a competition to view live standings and real-time match fixtures.</p>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search tournament or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-900 rounded-xl px-4 py-2.5 text-xs font-light tracking-wide text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      {filteredLeagues.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-900 rounded-2xl">
          <p className="text-slate-500 text-xs font-light">No competitions match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeagues.map((league) => (
            <Link
              key={league.code}
              to={`/league/${league.code}`}
              className={`group block bg-gradient-to-br ${league.color} border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all duration-300 relative overflow-hidden backdrop-blur-sm cursor-pointer`}
            >
              <div className="absolute top-0 right-0 p-8 text-7xl font-bold text-slate-800/10 select-none group-hover:text-slate-800/20 transition-colors">
                {league.code}
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-medium text-emerald-400">
                    {league.country}
                  </span>
                  <h2 className="text-xl font-light tracking-wide text-slate-200 mt-1 group-hover:text-emerald-400 transition-colors">
                    {league.name}
                  </h2>
                </div>

                <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-900/50">
                  <span className="text-xs text-slate-500 font-light">{league.teams} Teams Included</span>
                  <span className="text-xs text-emerald-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}