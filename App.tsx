import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MatchData } from './types';
import { calculateStandings, getMatchKey } from './utils/leagueEngine';
import LeagueTable from './components/LeagueTable';
import MatchMatrix from './components/MatchMatrix';
import ActionButtons from './components/ActionButtons';
import TeamManager from './components/TeamManager';

const INITIAL_TEAMS = [
  "青森A60",
  "青森B60",
  "八戸A60",
  "八戸B60",
  "七戸60",
  "BonSagesse"
];

const App: React.FC = () => {
  const [teams, setTeams] = useState<string[]>(INITIAL_TEAMS);
  const [matches, setMatches] = useState<MatchData>({});
  const [view, setView] = useState<'matrix' | 'table' | 'settings'>('matrix');

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('league_manager_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.matches) setMatches(parsed.matches);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('league_manager_data', JSON.stringify({ teams, matches }));
  }, [teams, matches]);

  const standings = useMemo(() => calculateStandings(teams, matches), [teams, matches]);

  const updateScore = useCallback((home: string, away: string, hVal: number | null, aVal: number | null) => {
    setMatches(prev => {
      const key = getMatchKey(home, away);
      return {
        ...prev,
        [key]: { home: hVal, away: aVal }
      };
    });
  }, []);

  const handleSortByRank = useCallback(() => {
    const sortedNames = standings.map(s => s.name);
    setTeams(sortedNames);
    setView('table');
  }, [standings]);

  const handleResetOrder = useCallback(() => {
    setTeams(INITIAL_TEAMS);
    setView('matrix');
  }, []);

  const handleClearScores = useCallback(() => {
    // Confirmation is handled by the UI component now
    setMatches({});
  }, []);

  // Team Management Logic
  const handleAddTeam = useCallback((name: string) => {
    setTeams(prev => {
      if (prev.length >= 9) return prev;
      if (prev.includes(name)) {
        alert("同じチーム名が既に存在します。");
        return prev;
      }
      return [...prev, name];
    });
  }, []);

  const handleRemoveTeam = useCallback((name: string) => {
    if (teams.length <= 2) {
      alert("チームは最低2つ必要です。");
      return;
    }

    setTeams(prev => prev.filter(t => t !== name));
    setMatches(prev => {
      const newMatches: MatchData = {};
      Object.keys(prev).forEach(key => {
        const [h, a] = key.split('||');
        if (h !== name && a !== name) {
          newMatches[key] = prev[key];
        }
      });
      return newMatches;
    });
  }, [teams.length]);

  const handleUpdateTeamName = useCallback((oldName: string, newName: string) => {
    if (oldName === newName) return;
    setTeams(prev => {
      if (prev.includes(newName)) {
        alert("そのチーム名は既に使用されています。");
        return prev;
      }
      return prev.map(t => t === oldName ? newName : t);
    });
    setMatches(prev => {
      const newMatches: MatchData = {};
      Object.keys(prev).forEach(key => {
        const [h, a] = key.split('||');
        const newH = h === oldName ? newName : h;
        const newA = a === oldName ? newName : a;
        newMatches[getMatchKey(newH, newA)] = prev[key];
      });
      return newMatches;
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <i className="fa-solid fa-futbol text-2xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">League Manager Pro</h1>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">⚽ リーグ戦管理システム</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-800 p-1 rounded-full border border-slate-700 overflow-x-auto max-w-full">
            <button 
              type="button"
              onClick={() => setView('matrix')}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${view === 'matrix' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-table-cells mr-2"></i>対戦表
            </button>
            <button 
              type="button"
              onClick={() => setView('table')}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${view === 'table' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-list-ol mr-2"></i>順位表
            </button>
            <button 
              type="button"
              onClick={() => setView('settings')}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${view === 'settings' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-users-gear mr-2"></i>チーム設定
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {view === 'matrix' && <><i className="fa-solid fa-pen-to-square text-emerald-500"></i> スコア入力</>}
                  {view === 'table' && <><i className="fa-solid fa-ranking-star text-amber-500"></i> 最新の順位</>}
                  {view === 'settings' && <><i className="fa-solid fa-users text-indigo-500"></i> チーム管理 (最大9チーム)</>}
                </h2>
                <div className="text-xs font-bold px-2.5 py-1 bg-slate-200 text-slate-600 rounded-full uppercase">
                  {teams.length} Teams
                </div>
              </div>
              
              <div className="p-0">
                {view === 'matrix' && (
                  <MatchMatrix 
                    teams={teams} 
                    matches={matches} 
                    onUpdateScore={updateScore} 
                  />
                )}
                {view === 'table' && (
                  <LeagueTable standings={standings} />
                )}
                {view === 'settings' && (
                  <TeamManager 
                    teams={teams} 
                    onAddTeam={handleAddTeam} 
                    onRemoveTeam={handleRemoveTeam}
                    onUpdateTeamName={handleUpdateTeamName}
                  />
                )}
              </div>
            </section>
          </div>

          {/* Sidebar / Controls */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              <ActionButtons 
                onSortByRank={handleSortByRank}
                onResetOrder={handleResetOrder}
                onClearScores={handleClearScores}
              />
              
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h3 className="text-emerald-800 font-bold mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-circle-info"></i> 順位決定ルール
                </h3>
                <ul className="text-sm space-y-2 text-emerald-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span> 勝点（勝3 / 分1 / 負0）
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span> 得失点差
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span> 総得点
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span> 直接対決の成績
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Floating Action for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button 
          type="button"
          onClick={handleSortByRank}
          className="w-14 h-14 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-rotate"></i>
        </button>
      </div>
    </div>
  );
};

export default App;