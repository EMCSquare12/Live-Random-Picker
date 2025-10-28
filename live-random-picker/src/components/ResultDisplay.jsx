const ResultDisplay = ({ winner, isPicking }) => (
  <div
    className="mt-6 text-center bg-gray-50 dark:bg-gray-700 border-4 border-dashed border-gray-200 dark:border-gray-600 p-6 rounded-lg transition-colors"
  >
    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
      And the winner is...
    </h3>
    <p
      className={`text-4xl font-extrabold text-green-600 dark:text-green-400 transition-all ${
        !isPicking && winner !== '...' ? 'animate-pulse-winner' : ''
      }`}
      style={{ minHeight: '50px' }}
    >
      {winner}
    </p>
  </div>
);
export default ResultDisplay;