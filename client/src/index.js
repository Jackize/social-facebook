import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { HelmetProvider } from 'react-helmet-async';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <DarkModeContextProvider>
                <App />
            </DarkModeContextProvider>
        </HelmetProvider>
    </React.StrictMode>
);
