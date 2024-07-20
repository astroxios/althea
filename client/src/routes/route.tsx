import Home from "pages/Home"
import Login from "pages/Login"
import Register from "pages/Register"
import Config from "pages/Config"

export const ROUTES = [
  {
    path: "*",
    element: "404 Not Found",
  },
  {
    path: "/",
    element: <Home />,
    isPrivate: false,
  },
  {
    path: "/login",
    element: <Login />,
    isPrivate: false,
  },
  {
    path: "/register",
    element: <Register />,
    isPrivate: false,
  },
  {
    path: "/config",
    element: <Config />,
    isPrivate: true,
  },
]
