import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeamSquad } from '../services/footballApi';

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      const data = await getTeamSquad(id);
      setTeam(data);
      setLoading(false);
    };
    fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-slate-400 text-sm font-light tracking-wide">
        Loading squad data...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-sm font-light">Squad details temporarily unavailable.</p>
        <button onClick={() => navigate(-1)} className="text-xs text-emerald-400 hover:underline cursor-pointer">
          Go Back
        </button>
      </div>
    );
  }

  const coach = team.coach;
  const goalkeepers = team.squad?.filter(p => p.position === 'Goalkeeper') || [];
  const defenders = team.squad?.filter(p => p.position === 'Defence') || [];
  const midfielders = team.squad?.filter(p => p.position === 'Midfield') || [];
  const forwards = team.squad?.filter(p => p.position === 'Offence') || [];

  const renderPositionGroup = (title, players) => {
    if (players.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-xs uppercase tracking-widest font-medium text-emerald-400 mb-3 border-b border-slate-900 pb-1.5">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {players.map(player => (
            <div key={player.id} className="bg-slate-900/10 border border-slate-900/60 rounded-xl p-3 flex justify-between items-center text-sm">
              <span className="text-slate-200 font-light">{player.name}</span>
              <span className="text-xs text-slate-500 font-light">{player.nationality}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-slate-500 hover:text-slate-300 mb-8 transition-colors flex items-center gap-1 cursor-pointer"
      >
        ← Back
      </button>

      <div className="mb-12 flex items-center gap-6 flex-wrap">
        {team.crest && <img src={team.crest} alt="" className="w-20 h-20 object-contain" />}
        <div>
          <h1 className="text-3xl font-light tracking-wide text-slate-100">{team.name}</h1>
          <div className="flex gap-x-4 gap-y-1 flex-wrap text-xs text-slate-500 font-light mt-1.5">
            <p><span className="text-slate-600">Venue:</span> {team.venue || 'N/A'}</p>
            <p><span className="text-slate-600">Founded:</span> {team.founded || 'N/A'}</p>
            <p><span className="text-slate-600">Colors:</span> {team.clubColors || 'N/A'}</p>
          </div>
        </div>
      </div>

      {coach && (
        <div className="mb-10 bg-gradient-to-r from-emerald-500/5 to-transparent border border-slate-900 rounded-xl p-4 flex justify-between items-center text-sm">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-medium text-emerald-400 block mb-0.5">Manager</span>
            <span className="text-slate-200 font-normal text-base">{coach.name}</span>
          </div>
          <span className="text-xs text-slate-500 font-light">{coach.nationality}</span>
        </div>
      )}

      {renderPositionGroup('Goalkeepers', goalkeepers)}
      {renderPositionGroup('Defenders', defenders)}
      {renderPositionGroup('Midfielders', midfielders)}
      {renderPositionGroup('Forwards', forwards)}
    </div>
  );
}