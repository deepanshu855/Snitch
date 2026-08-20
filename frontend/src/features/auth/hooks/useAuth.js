import { register, login, getMe, logout } from "../services/auth.api.js";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../auth.slice.js";
import { toast } from "react-toastify";

const showToast = (message, type = "success") => {
  toast[type](message, {
    style: {
      backgroundColor: "#fbf9f5",
      color: "#1b1c1a",
      fontFamily: "'Inter', sans-serif",
      fontSize: "13px",
      fontWeight: "500",
      border: `1px solid ${type === "error" ? "#ffdad6" : "#e4e2de"}`,
      borderRadius: "8px",
      boxShadow: "0 12px 24px -4px rgba(0,0,0,0.04)",
    },
    progressStyle: {
      background: type === "error" ? "#ba1a1a" : "#060607"
    }
  });
};

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({
    email,
    fullname,
    contact,
    password,
    isSeller = false,
  }) => {
    try {
      dispatch(setLoading(true));
      const response = await register({
        email,
        fullname,
        contact,
        password,
        isSeller,
      });
      dispatch(setUser(response.user));
      showToast("Registration successful!", "success");
      return response.user;
    } catch (error) {
      dispatch(setError(error.message));
      showToast(error.message || "Registration failed", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      dispatch(setLoading(true));
      const response = await login({ email, password });
      dispatch(setUser(response.user));
      showToast("Logged in successfully", "success");
      return response.user;
    } catch (error) {
      dispatch(setError(error.message));
      showToast(error.message || "Login failed", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getMe();
      dispatch(setUser(response.user));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      const data = await logout();
      dispatch(setUser(null));
      showToast("Logged out successfully", "success");
      return data;
    } catch (error) {
      showToast(error.message || "Logout failed", "error");
    }
  };

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout
  };
};
