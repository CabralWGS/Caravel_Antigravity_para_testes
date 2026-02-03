import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ToastData, UIContextType } from '../types.ts';

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
        try {
            const item = window.localStorage.getItem('theme');
            return item ? (item as 'light' | 'dark' | 'system') : 'system';
        } catch (error) {
            console.error(error);
            return 'system';
        }
    });
    const [toast, setToast] = useState<ToastData | null>(null);

    const setTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
        setThemeState(newTheme);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.error('Failed to save theme preference:', e);
        }

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const updateSystemTheme = () => {
                root.classList.toggle('dark', mediaQuery.matches);
            };
            updateSystemTheme();
            mediaQuery.addEventListener('change', updateSystemTheme);
            return () => mediaQuery.removeEventListener('change', updateSystemTheme);
        } else {
            root.classList.toggle('dark', theme === 'dark');
        }
    }, [theme]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ id: Date.now(), message, type });
    }, []);

    const dismissToast = useCallback(() => {
        setToast(null);
    }, []);

    const value: UIContextType = {
        theme,
        setTheme,
        toast,
        showToast,
        dismissToast
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = (): UIContextType => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};