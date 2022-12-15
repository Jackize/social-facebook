import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from 'react-router-dom';
import Theme from './components/Theme/Theme';
import Layout from './layout';
import Home from './pages/home/Home';
import Watch from './pages/watch/Watch';
import Store from './pages/store/Store';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import Register from './pages/register/Register';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
    const currentUser = useContext(AuthContext);

    const queryClient = new QueryClient();

    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login"/>;
        }

        return children;
    };
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <Theme>
                        <QueryClientProvider client={queryClient}>
                            <Layout />
                        </QueryClientProvider>
                    </Theme>
                </ProtectedRoute>
            ),
            children: [
                {
                    path: '/',
                    element: <Home />,
                },
                {
                    path: '/profile/:id',
                    element: <Profile />,
                },
                {
                    path: '/watch',
                    element: <Watch />,
                },
                {
                    path: '/store',
                    element: <Store />,
                },
            ],
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Register />,
        },
    ]);
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
