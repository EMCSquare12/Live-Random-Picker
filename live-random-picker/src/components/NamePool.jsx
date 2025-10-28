import React from 'react';
import NameBadge from './NameBadge.jsx';

const NamePool = ({ names, winner, isPicking, isSuggesting, onClearList, onRemoveName }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Name Pool (<span>{names.length}</span>)
      </h2>
      <button
        className="text-sm text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 font-medium transition-colors disabled:text-gray-400 dark:disabled:text-gray-600"
        onClick={onClearList}
        disabled={names.length === 0 || isPicking || isSuggesting}
      >
        Clear List
      </button>
    </div>
    <div
      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg min-h-[120px] max-h-[200px] overflow-y-auto border border-gray-200 dark:border-gray-600 flex flex-wrap gap-2 items-start content-start transition-colors"
    >
      {names.length === 0 ? (
        <span className="text-gray-400 dark:text-gray-500 italic p-2">
          Add some names to get started...
        </span>
      ) : (
        names.map((name, index) => (
          <NameBadge
            key={index}
            name={name}
            isWinner={name === winner && !isPicking}
            isPicking={isPicking}
            onRemove={() => onRemoveName(index)}
          />
        ))
      )}
    </div>
  </div>
);
export default NamePool;