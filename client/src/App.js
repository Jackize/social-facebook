import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Navigate,
} from 'react-router-dom';
import Theme from './components/Theme/Theme';
import Layout from './layout';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import Register from './pages/register/Register';

function App() {
    const currentUser = true;
    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login" />;
        }

        return children;
    };
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <Theme>
                        <Layout />
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
