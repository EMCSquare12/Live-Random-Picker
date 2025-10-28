const NameBadge = ({ name, isWinner, isPicking, onRemove }) => (
  <span
    className={`name-badge flex items-center text-sm font-medium px-3 py-1 rounded-full transition-all duration-300
      ${isWinner
        ? 'bg-green-500 dark:bg-green-500 text-white dark:text-white scale-110 shadow-lg'
        : 'bg-blue-100 dark:bg-gray-600 text-blue-800 dark:text-gray-100'
      }
    `}
  >
    {name}
    <button
      className="ml-2 text-blue-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-bold transition-colors disabled:opacity-30"
      onClick={onRemove}
      disabled={isPicking}
      aria-label={`Remove ${name}`}
    >
      &times;
    </button>
  </span>
);
export default NameBadge;  