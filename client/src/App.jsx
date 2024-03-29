import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import Theme from "./components/Theme/Theme";
import Layout from "./layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useEffect } from "react";
import SuspenseLoading from "./components/suspenseLoading/SuspenseLoading";
import { makeRequest } from "./axios";
import { useSocketContext } from "./context/socketContext";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const LoginSuccess = lazy(() => import("./components/loginSuccess/LoginSuccess"));
const Saving = lazy(() => import("./pages/saving/Saving"));
const Inbox = lazy(() => import("./pages/inbox/Inbox"));
const Messages = lazy(() => import("./pages/inbox/Messages"));

function App() {
  const queryClient = new QueryClient();
  const { socket } = useSocketContext()

  // clear token in localstorage whentoken is expired
  useEffect(() => {
    async function VerifyToken() {
      const res = await makeRequest.post('/auth/authenticateToken')
      if (res.data.status !== 200) {
        localStorage.removeItem('user')
      }
    }
    VerifyToken()
  }, [])

  const ProtectedRoute = ({ children }) => {
    // navigate page login when don't have token in localstorage
    const user = localStorage.getItem("user")
    if (user === null) {
      return <Navigate to="/login" />;
    }
    socket?.emit("userLogin", JSON.parse(user))
    return children;
  };

  const router = createBrowserRouter([
    {
      element: <Outlet />,
      children: [
        {
          path: "/login/success",
          element: (
            <Suspense fallback={<SuspenseLoading />}>
              <LoginSuccess />
            </Suspense>
          ),
        },
        {
          path: "/login",
          element: (
            <Suspense fallback={<SuspenseLoading />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "/register",
          element: (
            <Suspense fallback={<SuspenseLoading />}>
              <Register />
            </Suspense>
          ),
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
              element: (
                <Suspense fallback={<SuspenseLoading />}>
                  <Home />
                </Suspense>
              ),
            },
            {
              path: "/profile/:id",
              element: (
                <Suspense fallback={<SuspenseLoading />}>
                  <Profile />
                </Suspense>
              ),
            },
            {
              path: "/inbox",
              element: (
                <Suspense fallback={<SuspenseLoading />}>
                  <Inbox />
                </Suspense>
              ),
              children: [
                {
                  path: "/inbox/:id",
                  element: (
                    <Suspense fallback={<SuspenseLoading />}>
                      <Messages />
                    </Suspense>
                  ),
                },
                {
                  path: "/inbox/gpt",
                  element: (
                    <Suspense fallback={<SuspenseLoading />}>
                      <Messages />
                    </Suspense>
                  ),
                },
              ],
            },
            {
              path: "/saving",
              element: (
                <Suspense fallback={<SuspenseLoading />}>
                  <Saving />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
