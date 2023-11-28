import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { HelmetProvider } from 'react-helmet-async';
import { NotificationProvider } from './context/notificationContext';
import { AuthContextProvider } from './context/authContext';
import SocketContextProider from './context/socketContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <DarkModeContextProvider>
                <NotificationProvider>
                    <SocketContextProider>
                        <AuthContextProvider>
                            <App />
                        </AuthContextProvider>
                    </SocketContextProider>
                </NotificationProvider>
            </DarkModeContextProvider>
        </HelmetProvider>
    </React.StrictMode>
);
