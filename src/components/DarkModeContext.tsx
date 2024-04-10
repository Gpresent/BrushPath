// DarkModeContext.tsx
import React, { createContext, useState, useEffect, useContext} from 'react';

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const defaultState = {
  isDarkMode: false,
  toggleDarkMode: () => {}
};

const DarkModeContext = createContext<DarkModeContextProps>(defaultState);

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    if(isDarkMode){
      document.body.style.setProperty("--background",  "#333");
      document.body.style.setProperty("--text",  "#E0E0E0");
      document.body.style.setProperty("--border",  "#7C7C7C");
      document.body.style.setProperty("--deemphasized-1",  "#aaa");
      document.body.style.setProperty("--deemphasized-2",  "#ccc");

    }else{
      document.body.style.setProperty("--background",  "white");
      document.body.style.setProperty("--border",  "black");
      document.body.style.setProperty("--text",  "black");
      document.body.style.setProperty("--deemphasized-1",  "#3a3a3ad7");
      document.body.style.setProperty("--deemphasized-2",  "#333");
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
