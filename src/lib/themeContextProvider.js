'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('cupcake');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'cupcake';
        setTheme(savedTheme);
        document.documentElement.dataset.theme = savedTheme;
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'cupcake' ? 'dark' : 'cupcake';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.dataset.theme = newTheme;
    };



    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};