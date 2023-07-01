import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { HelmetProvider } from 'react-helmet-async';
import { NotificationProvider } from './context/notificationContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <DarkModeContextProvider>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </DarkModeContextProvider>
        </HelmetProvider>
    </React.StrictMode>
);
