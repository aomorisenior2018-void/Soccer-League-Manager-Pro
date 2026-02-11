import React from 'react';
import { TeamStats } from '../types';

interface LeagueTableProps {
  standings: TeamStats[];
}

const LeagueTable: React.FC<LeagueTableProps> = ({ standings }) => {
  const getRankBadgeClass = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-amber-100 text-amber-700 ring-1 ring-amber-300';
      case 2: return 'bg-slate-100 text-slate-600 ring-1 ring-slate-300';
      case 3: return 'bg-orange-100 text-orange-700 ring-1 ring-orange-300';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">順位</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">チーム名</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">試</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">勝</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">分</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">負</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">得</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">失</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">差</th>
            <th className="px-6 py-4 text-xs font-bold text-emerald-600 uppercase tracking-wider text-center bg-emerald-50/30">勝点</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {standings.map((team) => (
            <tr key={team.name} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankBadgeClass(team.rank || 0)}`}>
                  {team.rank}
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-slate-800">{team.name}</td>
              <td className="px-4 py-4 text-center text-slate-600 font-medium">{team.played}</td>
              <td className="px-4 py-4 text-center text-slate-600">{team.won}</td>
              <td className="px-4 py-4 text-center text-slate-600">{team.drawn}</td>
              <td className="px-4 py-4 text-center text-slate-600">{team.lost}</td>
              <td className="px-4 py-4 text-center text-slate-600">{team.gf}</td>
              <td className="px-4 py-4 text-center text-slate-600">{team.ga}</td>
              <td className="px-4 py-4 text-center font-bold text-slate-700">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
              <td className="px-6 py-4 text-center font-black text-emerald-600 text-lg bg-emerald-50/30">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;