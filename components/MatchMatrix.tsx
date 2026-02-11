import React from 'react';
import { MatchData } from '../types';
import { getMatchKey } from '../utils/leagueEngine';

interface MatchMatrixProps {
  teams: string[];
  matches: MatchData;
  onUpdateScore: (home: string, away: string, hVal: number | null, aVal: number | null) => void;
}

const MatchMatrix: React.FC<MatchMatrixProps> = ({ teams, matches, onUpdateScore }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-4 border border-slate-700 bg-slate-900 sticky left-0 z-20 min-w-[140px] text-xs uppercase tracking-widest text-slate-400">
              Home \ Away
            </th>
            {teams.map(team => (
              <th key={team} className="p-4 border border-slate-700 min-w-[120px] text-sm font-bold truncate">
                {team}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((home, i) => (
            <tr key={home} className="group">
              <th className="p-4 border border-slate-200 bg-slate-50 sticky left-0 z-10 font-bold text-slate-800 text-left truncate shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                {home}
              </th>
              {teams.map((away, j) => {
                if (i === j) {
                  return <td key={away} className="p-4 border border-slate-200 bg-slate-100/50"></td>;
                }

                const isLowerTriangle = i > j;
                const matchKey = isLowerTriangle ? getMatchKey(away, home) : getMatchKey(home, away);
                const score = matches[matchKey];

                return (
                  <td 
                    key={away} 
                    className={`p-2 border border-slate-200 transition-colors ${isLowerTriangle ? 'bg-slate-50/50' : 'bg-white hover:bg-emerald-50/30'}`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        readOnly={isLowerTriangle}
                        value={isLowerTriangle ? (score?.away ?? '') : (score?.home ?? '')}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value);
                          onUpdateScore(home, away, val, score?.away ?? null);
                        }}
                        className={`w-10 h-10 text-center rounded-lg border focus:ring-2 transition-all font-bold ${
                          isLowerTriangle 
                          ? 'bg-transparent border-transparent text-slate-400' 
                          : 'bg-emerald-50/30 border-slate-200 focus:ring-emerald-400 focus:border-emerald-400 text-slate-800'
                        }`}
                      />
                      <span className="text-slate-300 font-light">-</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        readOnly={isLowerTriangle}
                        value={isLowerTriangle ? (score?.home ?? '') : (score?.away ?? '')}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value);
                          onUpdateScore(home, away, score?.home ?? null, val);
                        }}
                        className={`w-10 h-10 text-center rounded-lg border focus:ring-2 transition-all font-bold ${
                          isLowerTriangle 
                          ? 'bg-transparent border-transparent text-slate-400' 
                          : 'bg-emerald-50/30 border-slate-200 focus:ring-emerald-400 focus:border-emerald-400 text-slate-800'
                        }`}
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchMatrix;