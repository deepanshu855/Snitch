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

export const getAllProducts = async () => {
  const response = await instance.get("/");
  return response.data;
};

export const getProductDetails = async (productId) => {
  const response = await instance.get(`/${productId}`);
  return response.data;
};
