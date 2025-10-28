const ActionSection = ({ errorMessage, isPicking, isSuggesting, canPick, onPickWinner }) => (
  <div>
    {errorMessage && (
      <p className="text-red-600 dark:text-red-400 text-center text-sm font-medium mb-2">
        {errorMessage}
      </p>
    )}

    <button
      className="w-full text-lg bg-gradient-to-r from-green-500 to-green-600 dark:from-green-500 dark:to-green-700 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 dark:hover:from-green-600 dark:hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
      onClick={onPickWinner}
      disabled={!canPick || isPicking || isSuggesting}
    >
      {isPicking ? 'Picking...' : 'Pick a Winner!'}
    </button>
  </div>
);
export default ActionSection;   