import NameInputForm from "../components/NameInputForm"
import NamePool from "../components/NamePool"
import ActionSection from "../components/ActionSection"
import { useState, useEffect, useRef } from "react"

const RightContainer = () => {
    const [names, setNames] = useState([]);
  const [winner, setWinner] = useState(null); // null, '...', or a name
  const [isPicking, setIsPicking] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false); // --- NEW STATE ---
  const [errorMessage, setErrorMessage] = useState('');
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  
  // To prevent stale state in intervals
  const namesRef = useRef(names);
  useEffect(() => {
    namesRef.current = names;
  }, [names]);

  // --- EFFECTS ---

  // Effect 1: Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Effect 2: Apply theme to <html> tag and save to localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // --- LOGIC / EVENT HANDLERS ---

  /**
   * Toggles the color theme.
   */


  /**
   * Adds an array of new names from the form, filtering duplicates.
   * @param {string[]} namesToAdd - Array of names from the input component.
   */
  const handleAddNames = (namesToAdd) => {
    const nameSet = new Set(names);
    const uniqueNewNames = namesToAdd.filter(name => !nameSet.has(name));
    
    setNames(prevNames => [...prevNames, ...uniqueNewNames]);
    setErrorMessage('');
  };

  /**
   * Removes a name from the list by its index.
   */
  const removeName = (indexToRemove) => {
    if (isPicking || isSuggesting) return;
    
    const removedName = names[indexToRemove];
    const newNames = names.filter((_, index) => index !== indexToRemove);
    setNames(newNames);

    if (winner === removedName || newNames.length < 2) {
      setWinner(null);
    }
  };

  /**
   * Clears all names from the list and resets the winner.
   */
  const handleClearList = () => {
    if (isPicking || isSuggesting) return;
    setNames([]);
    setWinner(null);
    setErrorMessage('');
  };

  // --- NEW GEMINI FUNCTIONS ---

  /**
   * Calls the Gemini API to get name suggestions.
   * @param {string} prompt - The user's prompt (e.g., "superheroes").
   */
  const fetchGeminiSuggestions = async (prompt) => {
    // Set a more specific system instruction for the LLM
    const systemPrompt = "You are a creative assistant. Based on the user's prompt, generate a list of 10 relevant names. Return the names as a JSON object with a single key 'names' which holds an array of strings.";
    const userQuery = `Generate 10 names based on the theme: "${prompt}"`;
    
    const apiKey = "" // API key is handled by the environment
    const apiUrl = `https://generativela-6012e750-32b7-472d-883a-83b5f70f7f45.google-labs.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // Define the JSON schema for the expected response
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "names": {
              "type": "ARRAY",
              "items": { "type": "STRING" }
            }
          }
        }
      }
    };
    
    // Simple exponential backoff retry logic
    let response;
    let retries = 0;
    const maxRetries = 3;
    let delay = 1000; // 1 second

    while (retries < maxRetries) {
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          break; // Success, exit loop
        } else if (response.status === 429 || response.status >= 500) {
          // Throttling or server error, wait and retry
          retries++;
          if (retries >= maxRetries) {
            throw new Error(`API error after ${maxRetries} retries: ${response.statusText}`);
          }
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          // Other client-side error (e.g., 400 Bad Request)
          throw new Error(`API error: ${response.statusText}`);
        }
        
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          console.error("Error fetching Gemini suggestions:", error);
          setErrorMessage("Sorry, I couldn't get suggestions. Please try again.");
          return null; // Return null on failure
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }


    try {
      const result = await response.json();
      
      const candidate = result.candidates?.[0];
      if (candidate && candidate.content?.parts?.[0]?.text) {
        const jsonText = candidate.content.parts[0].text;
        const parsedJson = JSON.parse(jsonText);
        if (parsedJson.names && Array.isArray(parsedJson.names)) {
          return parsedJson.names; // Success! Return the array of names
        }
      }
      
      // If we get here, the response was not as expected
      throw new Error("Invalid JSON response from API.");

    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      setErrorMessage("Sorry, I couldn't understand the suggestions. Please try again.");
      return null; // Return null on failure
    }
  };

  /**
   * Handles the "Suggest Names" button click.
   * @param {string} prompt - The prompt from the text area.
   */
  const handleSuggestNames = async (prompt) => {
    if (isSuggesting) return;

    setIsSuggesting(true);
    setErrorMessage('');
    
    const suggestedNames = await fetchGeminiSuggestions(prompt);

    if (suggestedNames && suggestedNames.length > 0) {
      // Add the new names to our list
      handleAddNames(suggestedNames);
    }
    
    setIsSuggesting(false);
  };
  // --- END NEW GEMINI FUNCTIONS ---


  /**
   * Picks a random winner with a "slot machine" animation.
   */
  const handlePickWinner = () => {
    if (isPicking || isSuggesting || names.length < 2) {
      if (names.length < 2) {
        setErrorMessage('Please add at least two names to pick a winner.');

        
      }
      return;
    }

    setErrorMessage('');
    setIsPicking(true);
    setWinner('...'); // Show the result box with spinning placeholder

    const animationDuration = 2500;
    const spinInterval = 75;

    const spinAnimation = setInterval(() => {
      const currentNames = namesRef.current;
      if (currentNames.length > 0) {
        const randomName = currentNames[Math.floor(Math.random() * currentNames.length)];
        setWinner(randomName);
      }
    }, spinInterval);

    setTimeout(() => {
      clearInterval(spinAnimation);
      const currentNames = namesRef.current;
      const finalWinner = currentNames[Math.floor(Math.random() * currentNames.length)];
      setWinner(finalWinner);
      setIsPicking(false);
    }, animationDuration);
  };
    return <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl dark:shadow-gray-700/50 w-full max-w-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 relative">
  
<NameInputForm 
        isPicking={isPicking}
        isSuggesting={isSuggesting}
        onAddNames={handleAddNames} 
        onSuggestNames={handleSuggestNames}
      />
      <NamePool
        names={names}
        winner={winner}
        isPicking={isPicking}
        isSuggesting={isSuggesting}
        onClearList={handleClearList}
        onRemoveName={removeName}
      />
      <ActionSection
        errorMessage={errorMessage}
        isPicking={isPicking}
        isSuggesting={isSuggesting}
        canPick={names.length >= 2}
        onPickWinner={handlePickWinner}
      />
    
    </div>

}
export default RightContainer;