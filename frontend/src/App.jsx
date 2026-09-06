import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import { io } from "socket.io-client";
import { BASE_URL } from "./constants/index.js";
import Profile from "./pages/Profile";
import Signup, { action as signupAction } from "./pages/Signup";
import Loader from "./components/Loader.jsx";
import Login, { action as loginAction } from "./pages/Login";
import ProtectedRoute, { loader as userLoader } from "./pages/ProtectedRoute";

export const socket = io(BASE_URL);

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    loader: userLoader,
    hydrateFallbackElement: <Loader fallback />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/user",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
    action: signupAction,
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
  },
]);

export default function App() {
  return <RouterProvider router={routes} />;
}
