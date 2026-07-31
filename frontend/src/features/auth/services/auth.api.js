import axios from "axios";

const instance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
});

export const register = async ({ email, fullname, contact, password, isSeller }) => {
    const res = await instance.post("/register", { email, fullname, contact, password, isSeller });
    return res.data;
}

export const login = async ({ email, password }) => {
    const res = await instance.post("/login", { email, password });
    return res.data;
}