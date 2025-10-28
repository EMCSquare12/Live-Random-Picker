import React, { useState } from 'react';


const NameInputForm = ({ isPicking, isSuggesting, onAddNames, onSuggestNames }) => {
  const [nameInput, setNameInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNames = nameInput
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (newNames.length > 0) {
      onAddNames(newNames); // Pass the array of names up
      setNameInput(''); // Clear local input state
    }
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggest = (e) => {
    e.preventDefault();
    if (nameInput.trim().length > 0) {
      onSuggestNames(nameInput);
      // Don't clear input, user might want to refine it
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
        Enter names or an items
      </label>
      <textarea
        id="name-input"
        rows="4"
        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400"
        placeholder="Names, Themes, Colors..."
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        onKeyDown={handleKeydown}
        disabled={isPicking || isSuggesting}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 w-full bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors disabled:opacity-50"
        disabled={isPicking || isSuggesting}
      >
        Add Names
      </button>
      {/* --- NEW GEMINI BUTTON --- */}
      {/* <button
        onClick={handleSuggest}
        className="mt-2 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        disabled={isPicking || isSuggesting || nameInput.trim() === ''}
      >
        {isSuggesting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          '✨ Suggest Names from Input'
        )}
      </button> */}
      {/* --- END NEW BUTTON --- */}
    </div>
  );
};
export default NameInputForm;