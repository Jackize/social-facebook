import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { makeRequest } from "./axios";
import SuspenseLoading from "./components/suspenseLoading/SuspenseLoading";
import Theme from "./components/Theme/Theme";
import Layout from "./layout";
import { emitEvent, socket, updateUserList } from "./redux/socketSlice";
import queryClient from "./utils/query";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const LoginSuccess = lazy(() => import("./components/loginSuccess/LoginSuccess"));
const Saving = lazy(() => import("./pages/saving/Saving"));
const Inbox = lazy(() => import("./pages/inbox/Inbox"));
const Messages = lazy(() => import("./pages/inbox/Messages"));

function App() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function VerifyToken() {
      const res = await makeRequest.post('/auth/authenticateToken')
      if (res.data.status !== 200) {
        localStorage.removeItem('user')
      }
    }
    if (user !== null) {
      VerifyToken()
    }
    socket?.on('userStatus', (userList) => {
      dispatch(updateUserList(userList));
    });
    socket?.on('get-users', (data) => {
      console.log(data)
    });
  }, [user])

  const ProtectedRoute = ({ children }) => {
    // navigate page login when don't have token in localstorage
    if (user === null) {
      return <Navigate to="/login" />;
    }
    dispatch(emitEvent({ event: "userLogin", data: user }));
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
