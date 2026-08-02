import axios from "axios";

const instance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export const createProduct = async (formData) => {
  const response = instance.post("/", formData);
  return response.data;
};

export const getSellerProducts = async () => {
  const response = await instance.get("/seller");
  return response.data;
};
