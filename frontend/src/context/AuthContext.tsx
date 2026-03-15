import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: any;
    login: (tokens: { access: string; refresh: string }) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ name: payload.username || 'User' });
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to decode token", e);
                setUser({ name: 'User' });
                setIsAuthenticated(true);
            }
        }
    }, []);

    const login = (tokens: { access: string; refresh: string }) => {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        try {
            const payload = JSON.parse(atob(tokens.access.split('.')[1]));
            setUser({ name: payload.username || 'User' });
        } catch (e) {
            console.error("Failed to decode token", e);
            setUser({ name: 'User' });
        }
        setIsAuthenticated(true);
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
