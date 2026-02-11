import React, { useState } from 'react';

interface TeamManagerProps {
  teams: string[];
  onAddTeam: (name: string) => void;
  onRemoveTeam: (name: string) => void;
  onUpdateTeamName: (oldName: string, newName: string) => void;
}

const TeamManager: React.FC<TeamManagerProps> = ({ teams, onAddTeam, onRemoveTeam, onUpdateTeamName }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTeamName.trim();
    if (trimmed) {
      onAddTeam(trimmed);
      setNewTeamName('');
    }
  };

  const startEditing = (index: number, name: string) => {
    setConfirmDeleteIndex(null); // Cancel delete confirmation if editing
    setEditingIndex(index);
    setEditingValue(name);
  };

  const saveEdit = (oldName: string) => {
    const trimmed = editingValue.trim();
    if (trimmed && trimmed !== oldName) {
      onUpdateTeamName(oldName, trimmed);
    }
    setEditingIndex(null);
  };

  const requestDelete = (index: number) => {
    setEditingIndex(null);
    setConfirmDeleteIndex(index);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        {teams.map((team, idx) => (
          <div 
            key={`${team}-${idx}`}
            className={`flex items-center gap-3 p-3 bg-white rounded-xl border transition-all shadow-sm ${confirmDeleteIndex === idx ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:shadow-md'}`}
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full text-xs font-bold border border-slate-200">
              {idx + 1}
            </span>
            
            <div className="flex-grow min-w-0">
              {editingIndex === idx ? (
                <input
                  autoFocus
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => saveEdit(team)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(team)}
                  className="w-full px-2 py-1 border-b-2 border-indigo-500 bg-transparent focus:outline-none font-bold text-slate-900"
                />
              ) : (
                <span 
                  onClick={() => startEditing(idx, team)}
                  className={`font-bold block truncate py-1 transition-colors ${confirmDeleteIndex === idx ? 'text-rose-600' : 'text-slate-900 cursor-pointer hover:text-indigo-600'}`}
                >
                  {team}
                  {confirmDeleteIndex === idx && <span className="ml-2 text-xs font-normal">を削除しますか？</span>}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {confirmDeleteIndex === idx ? (
                <>
                  <button 
                    type="button"
                    onClick={() => {
                      onRemoveTeam(team);
                      setConfirmDeleteIndex(null);
                    }}
                    className="h-10 px-3 flex items-center gap-1 text-white bg-rose-500 hover:bg-rose-600 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    <i className="fa-solid fa-check"></i> はい
                  </button>
                  <button 
                    type="button"
                    onClick={() => setConfirmDeleteIndex(null)}
                    className="h-10 px-3 flex items-center gap-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all"
                  >
                    <i className="fa-solid fa-xmark"></i> いいえ
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button"
                    onClick={() => startEditing(idx, team)}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="名前を変更"
                  >
                    <i className="fa-regular fa-pen-to-square text-lg"></i>
                  </button>
                  <button 
                    type="button"
                    onClick={() => requestDelete(idx)}
                    className="w-10 h-10 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="削除"
                  >
                    <i className="fa-solid fa-trash-can text-lg"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {teams.length < 9 ? (
        <form onSubmit={handleAddSubmit} className="pt-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="新しいチーム名を入力..."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="flex-grow h-12 px-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all shadow-sm text-slate-900 placeholder:text-slate-400 font-bold"
            />
            <button
              type="submit"
              disabled={!newTeamName.trim()}
              className="px-6 h-12 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-black rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 flex-shrink-0"
            >
              <i className="fa-solid fa-plus"></i>
              <span className="hidden sm:inline">追加</span>
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            <i className="fa-solid fa-circle-info mr-1 text-emerald-500"></i> あと {9 - teams.length} チーム追加可能です。
          </p>
        </form>
      ) : (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-700 text-sm font-bold flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation"></i>
          チーム数が上限（9）に達しました。
        </div>
      )}
    </div>
  );
};

export default TeamManager;