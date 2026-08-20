import axios from "axios";

const instance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export const createProduct = async (formData) => {
  const response = await instance.post("/", formData);
  return response.data;
};

export const getSellerProducts = async () => {
  const response = await instance.get("/seller");
  return response.data;
};

export const getAllProducts = async (search, sort, page, limit) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (sort && sort !== "relevance") params.append("sort", sort);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  
  const queryString = params.toString();
  const response = await instance.get(queryString ? `/?${queryString}` : "/");
  return response.data;
};

export const getProductDetails = async (productId) => {
  const response = await instance.get(`/${productId}`);
  return response.data;
};

export const addProductVariant = async (productId, formData) => {
  const response = await instance.post(`/${productId}/variants`, formData);
  return response.data;
};

export const deleteProduct= async (productId)=> {
  const response=await instance.delete(`/delete/${productId}`);
  return response.data;
}

export const updateProductDetails= async(productId, {title, description, priceAmount, priceCurrency})=> {
  const response=await instance.patch(`/update/${productId}`, {title, description, priceAmount, priceCurrency});
  return response.data;
}

export const deleteVariant= async(productId, variantId)=> {
  const response=await instance.delete(`/delete/${productId}/${variantId}`);
  return response.data;
}

export const productRecommendation=async(productId)=>{
  const response= await instance.get(`/${productId}/recommendations`);
  return response.data;
}