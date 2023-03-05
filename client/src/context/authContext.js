import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    // const navigate = useNavigate();
    const login = async (values) => {
        const res = await axios.post(
            'http://localhost:8080/api/auth/login',
            values,
            {
                withCredentials: true,
            }
        );
        localStorage.setItem('user', JSON.stringify(res.data));
        setCurrentUser(res.data);
    };

    const logout = () => {
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
