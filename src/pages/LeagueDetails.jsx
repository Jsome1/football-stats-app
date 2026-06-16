import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLeagueStandings, getLeagueMatches } from '../services/footballApi';

export default function LeagueDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [standings, setStandings] = useState(null);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('table');
  const [loading, setLoading] = useState(true);
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('football_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      
      const [standingsData, matchesData] = await Promise.all([
        getLeagueStandings(code),
        getLeagueMatches(code)
      ]);

      if (standingsData && standingsData.standings && standingsData.standings[0]) {
        setStandings(standingsData);
      } else {
        setStandings(null);
      }

      if (matchesData && matchesData.matches) {
        setMatches(matchesData.matches.slice(-20).reverse());
      } else {
        setMatches([]);
      }

      setLoading(false);
    };

    fetchDetails();
  }, [code]);

  useEffect(() => {
    localStorage.setItem('football_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (teamId) => {
    if (favorites.includes(teamId)) {
      setFavorites(favorites.filter(id => id !== teamId));
    } else {
      setFavorites([...favorites, teamId]);
    }
  };

  const toggleMatchExpand = (matchId) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-slate-400 text-sm font-light tracking-wide">
        Loading league data...
      </div>
    );
  }

  if (!standings) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-sm font-light">Data temporarily unavailable for this league.</p>
        <button onClick={() => navigate('/')} className="text-xs text-emerald-400 hover:underline cursor-pointer">
          Go Back Home
        </button>
      </div>
    );
  }

  const leagueInfo = standings.competition;
  const table = standings.standings[0].table;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/')}
        className="text-xs text-slate-500 hover:text-slate-300 mb-8 transition-colors flex items-center gap-1 cursor-pointer"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {leagueInfo.emblem && (
            <img src={leagueInfo.emblem} alt={leagueInfo.name} className="w-12 h-12 object-contain" />
          )}
          <div>
            <h1 className="text-2xl font-light tracking-wide text-slate-100">{leagueInfo.name}</h1>
            <p className="text-xs text-slate-500 font-light mt-0.5">Season {standings.season?.currentMatchday || 1}</p>
          </div>
        </div>

        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-900">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
              activeTab === 'table'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Standings
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recent Matches
          </button>
        </div>
      </div>

      {activeTab === 'table' ? (
        /* სატურნირო ცხრილი */
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/40 text-slate-400 text-[11px] uppercase tracking-wider font-medium">
                  <th className="py-4 px-4 w-12 text-center">Pos</th>
                  <th className="py-4 px-4">Club</th>
                  <th className="py-4 px-4 text-center w-12">MP</th>
                  <th className="py-4 px-4 text-center w-12 text-emerald-400">W</th>
                  <th className="py-4 px-4 text-center w-12 text-amber-400">D</th>
                  <th className="py-4 px-4 text-center w-12 text-rose-400">L</th>
                  <th className="py-4 px-4 text-center w-14">GD</th>
                  <th className="py-4 px-4 text-center w-14">Pts</th>
                  <th className="py-4 px-4 w-12 text-center">Fav</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40">
                {table.map((row) => (
                  <tr key={row.team.id} className="hover:bg-slate-900/10 transition-colors group">
                    <td className="py-3.5 px-4 text-center font-medium text-xs text-slate-500 group-hover:text-slate-300">
                      {row.position}
                    </td>
                    <td className="py-3.5 px-4 font-light text-slate-200">
                      <Link to={`/team/${row.team.id}`} className="flex items-center gap-3 cursor-pointer group/name">
                        {row.team.crest && (
                          <img src={row.team.crest} alt="" className="w-5 h-5 object-contain" />
                        )}
                        <span className="truncate group-hover/name:text-emerald-400 transition-colors underline decoration-transparent group-hover/name:decoration-emerald-500/30">{row.team.name}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-center font-light text-slate-400">{row.playedGames}</td>
                    <td className="py-3.5 px-4 text-center font-light text-slate-300">{row.won}</td>
                    <td className="py-3.5 px-4 text-center font-light text-slate-300">{row.draw}</td>
                    <td className="py-3.5 px-4 text-center font-light text-slate-300">{row.lost}</td>
                    <td className="py-3.5 px-4 text-center font-light text-slate-400">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-emerald-400">{row.points}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleFavorite(row.team.id)}
                        className={`text-sm transition-transform active:scale-125 cursor-pointer ${
                          favorites.includes(row.team.id) ? 'text-amber-400' : 'text-slate-700 hover:text-slate-500'
                        }`}
                      >
                        ★
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* მატჩების კალენდარი */
        <div className="space-y-3">
          {matches.length === 0 ? (
            <p className="text-center py-12 text-slate-500 text-xs font-light">No recent match fixtures found.</p>
          ) : (
            matches.map((match) => (
              <div key={match.id} className="bg-slate-900/10 border border-slate-900/60 rounded-xl overflow-hidden hover:border-slate-800 transition-colors">
                <div
                  onClick={() => toggleMatchExpand(match.id)}
                  className="p-4 flex items-center justify-between gap-4 text-sm cursor-pointer select-none"
                >
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-3">
                      {match.homeTeam.crest && <img src={match.homeTeam.crest} alt="" className="w-4 h-4 object-contain" />}
                      <span className={`font-light ${match.score.winner === 'HOME_TEAM' ? 'text-emerald-400 font-normal' : 'text-slate-300'}`}>
                        {match.homeTeam.name}
                        {favorites.includes(match.homeTeam.id) && <span className="text-amber-400 text-xs ml-1.5">★</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {match.awayTeam.crest && <img src={match.awayTeam.crest} alt="" className="w-4 h-4 object-contain" />}
                      <span className={`font-light ${match.score.winner === 'AWAY_TEAM' ? 'text-emerald-400 font-normal' : 'text-slate-300'}`}>
                        {match.awayTeam.name}
                        {favorites.includes(match.awayTeam.id) && <span className="text-amber-400 text-xs ml-1.5">★</span>}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-l border-slate-900 pl-4 min-w-[85px] justify-end">
                    <div className="flex flex-col items-end justify-center">
                      {match.status === 'FINISHED' ? (
                        <div className="flex flex-col items-center">
                          <span className="text-slate-200 font-medium tracking-wider">
                            {match.score.fullTime.home} : {match.score.fullTime.away}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-slate-600 mt-0.5 font-medium">FT</span>
                        </div>
                      ) : match.status === 'LIVE' || match.status === 'IN_PLAY' ? (
                        <div className="flex flex-col items-center">
                          <span className="text-amber-400 font-medium tracking-wider animate-pulse">
                            {match.score.fullTime.home ?? 0} : {match.score.fullTime.away ?? 0}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-amber-500 mt-0.5 font-bold animate-pulse">LIVE</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-slate-400 text-xs font-light">
                            {new Date(match.utcDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs text-slate-600 transition-transform duration-200 ${expandedMatchId === match.id ? 'rotate-180 text-emerald-400' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {expandedMatchId === match.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-900/60 bg-slate-950/40 text-xs text-slate-400 grid grid-cols-2 gap-4 animate-fade-in">
                    <div className="space-y-1.5">
                      <p className="font-light"><span className="text-slate-600 font-normal">Competition:</span> {leagueInfo.name}</p>
                      <p className="font-light"><span className="text-slate-600 font-normal">Matchday:</span> Round {match.matchday}</p>
                      <p className="font-light">
                        <span className="text-slate-600 font-normal">Date:</span> {new Date(match.utcDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <div className="space-y-1.5 border-l border-slate-900/60 pl-4">
                      {match.score.halfTime && (
                        <p className="font-light">
                          <span className="text-slate-600 font-normal">Half-Time Score:</span> {match.score.halfTime.home} : {match.score.halfTime.away}
                        </p>
                      )}
                      <p className="font-light truncate">
                        <span className="text-slate-600 font-normal">Referees:</span> {match.referees?.map(r => r.name).join(', ') || 'N/A'}
                      </p>
                      <p className="font-light">
                        <span className="text-slate-600 font-normal">Status:</span> <span className="text-emerald-500/80 font-normal">{match.status}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}