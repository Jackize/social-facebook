import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import Theme from "./components/Theme/Theme";
import Layout from "./layout";
import { AuthContextProvider } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import SuspenseLoading from "./components/suspenseLoading/SuspenseLoading";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const LoginSuccess = lazy(() =>
  import("./components/loginSuccess/LoginSuccess")
);
const ImageGeneration = lazy(() =>
  import("./pages/imageGeneration/ImageGeneration")
);
const Inbox = lazy(() => import("./pages/inbox/Inbox"));
const Messages = lazy(() => import("./components/messages/Messages"));

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
              path: "/imageGeneration",
              element: (
                <Suspense fallback={<SuspenseLoading />}>
                  <ImageGeneration />
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
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
