import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from "react-router-dom";
import Theme from "./components/Theme/Theme";
import Layout from "./layout";
import Home from "./pages/home/Home";
import Watch from "./pages/watch/Watch";
import Store from "./pages/store/Store";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { AuthContextProvider } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Inbox from "./pages/inbox/Inbox";

function App() {
    const queryClient = new QueryClient();

    const AuthLayout = () => {
        return (
            <AuthContextProvider>
                <Outlet />
            </AuthContextProvider>
        );
    };
    const ProtectedRoute = ({ children }) => {
        if (localStorage.getItem("user") === null) {
            return <Navigate to="/login" />;
        }

        return children;
    };
    const router = createBrowserRouter([
        {
            element: <AuthLayout />,
            children: [
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/register",
                    element: <Register />,
                },
                {
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
                            path: "/",
                            element: <Home />,
                        },
                        {
                            path: "/profile/:id",
                            element: <Profile />,
                        },
                        {
                            path: "/watch",
                            element: <Watch />,
                        },
                        {
                            path: "/store",
                            element: <Store />,
                        },
                        {
                            path: "/inbox",
                            element: <Inbox />,
                        },
                    ],
                },
            ],
        },
    ]);
    return <RouterProvider router={router} />;
}

export default App;
