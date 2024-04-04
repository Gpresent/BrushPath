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
