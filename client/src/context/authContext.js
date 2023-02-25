import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
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

    useEffect(() => {
        const unsubscribe = () => {
            if (currentUser?.id) {
                setIsLoading(false);
                navigate('/');
                return 
            }
            
            setIsLoading(false);
            setCurrentUser({})
            localStorage.removeItem('user');
            navigate('/login');
        }

        return ()=>{
            unsubscribe();
        }
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {isLoading ? <CircularProgress/> :children}
        </AuthContext.Provider>
    );
};
