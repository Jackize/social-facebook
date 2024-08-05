import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { NotificationProvider } from './context/notificationContext';
import SocketContextProider from './context/socketContext';
import store from './redux/store';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <Provider store={store}>
                <DarkModeContextProvider>
                    <NotificationProvider>
                        <SocketContextProider>
                            <App />
                        </SocketContextProider>
                    </NotificationProvider>
                </DarkModeContextProvider>
            </Provider>
        </HelmetProvider>
    </React.StrictMode>
);
