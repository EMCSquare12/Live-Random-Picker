import ThemeToggleButton from "./components/ThemeToggleButton"
import Header from "./components/Header"
import Main from "./main/Main"
import { useState } from "react"

function App() {
    const [theme, setTheme] = useState('light'); // 'light' or 'dark'

    const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
 
  return (
    
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl dark:shadow-gray-700/50 w-full max-w-screen  relative">
      <ThemeToggleButton theme={theme} onToggle={handleThemeToggle} />
      <Header/>
      <Main/>

    </div>
  )
}

export default App
