import React, { useState } from 'react';

interface ActionButtonsProps {
  onSortByRank: () => void;
  onResetOrder: () => void;
  onClearScores: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSortByRank, 
  onResetOrder, 
  onClearScores 
}) => {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const handleClearClick = () => {
    if (isConfirmingClear) {
      onClearScores();
      setIsConfirmingClear(false);
    } else {
      setIsConfirmingClear(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
      <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-sliders text-indigo-500"></i> 操作パネル
      </h3>
      
      <button 
        type="button"
        onClick={onSortByRank}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-between transition-all active:scale-[0.98] shadow-md shadow-indigo-200"
      >
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-arrow-down-wide-short"></i> 成績順に並べ替え
        </span>
        <i className="fa-solid fa-chevron-right text-indigo-300"></i>
      </button>

      <button 
        type="button"
        onClick={onResetOrder}
        className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-between transition-all active:scale-[0.98]"
      >
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-rotate-left"></i> 表示順をリセット
        </span>
        <i className="fa-solid fa-chevron-right text-slate-300"></i>
      </button>

      <div className="pt-2 border-t border-slate-100">
        {!isConfirmingClear ? (
          <button 
            type="button"
            onClick={() => setIsConfirmingClear(true)}
            className="w-full py-3 px-4 text-rose-600 hover:bg-rose-50 rounded-xl font-bold flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-trash-can"></i> 全スコアをクリア
            </span>
            <i className="fa-solid fa-triangle-exclamation text-rose-300"></i>
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-rose-600 font-bold text-center mb-1">
              本当に全てのスコアを消去しますか？
            </p>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => {
                  onClearScores();
                  setIsConfirmingClear(false);
                }}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-check"></i> はい
              </button>
              <button 
                type="button"
                onClick={() => setIsConfirmingClear(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-xmark"></i> いいえ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;