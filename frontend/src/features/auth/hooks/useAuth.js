import { register, login, getMe, logout } from "../services/auth.api.js";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../auth.slice.js";

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
      return response.user;
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      dispatch(setLoading(true));
      const response = await login({ email, password });
      dispatch(setUser(response.user));
      return response.user;
    } catch (error) {
      dispatch(setError(error.message));
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
    const data = await logout();
    dispatch(setUser(null));
    return data;
  };

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout
  };
};
