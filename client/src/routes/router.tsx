import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { ROUTES } from "./route";
import PrivateRoute from "src/routes/components/PrivateRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    ROUTES.map((route) => {
      const { path, element, isPrivate } = route;
      return (
        <Route
          key={path}
          path={path}
          element={isPrivate ? <PrivateRoute element={element} /> : element}
        />
      );
    })
  )
);
