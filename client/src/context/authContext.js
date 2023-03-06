import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { makeRequest } from '../axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    // const navigate = useNavigate();
    const login = async (values) => {
        const res = await makeRequest.post('/auth/login', values)
        localStorage.setItem('user', JSON.stringify(res.data));
        setCurrentUser(res.data);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
