import Home from "pages/Home"
import Login from "pages/Login"
import Register from "pages/Register"

export const ROUTES = [
  {
    path: "*",
    element: "404 Not Found",
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]
