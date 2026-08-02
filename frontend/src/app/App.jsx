import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";

function App() {
  const user = useSelector((state) => state.auth.user);
  const { handleGetMe } = useAuth();

  // Hyderate user.
  useEffect(() => {
    handleGetMe();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
