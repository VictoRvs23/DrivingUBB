import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const DarkModeContext = createContext();
const getStorageKey = (userId) => (userId ? `dark_mode_${userId}` : 'dark_mode_guest');

export const DarkModeProvider = ({ children }) => {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const guardado = localStorage.getItem(getStorageKey(user?.id)) === 'true';
        setDarkMode(guardado);
    }, [user?.id]);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const toggleDarkMode = (value) => {
        const nuevo = typeof value === 'boolean' ? value : !darkMode;
        setDarkMode(nuevo);
        localStorage.setItem(getStorageKey(user?.id), String(nuevo));
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
