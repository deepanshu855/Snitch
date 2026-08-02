import { CloudCog } from "lucide-react";
import { createProduct, getSellerProducts } from "../services/product.api.js";
import { setSellerProducts, setProducts } from "../state/product.slice.js";
import { useDispatch } from "react-redux";

export const useProducts = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);
    return data.product;
  };

  const handleGetSellerProducts = async () => {
    const data = await getSellerProducts();
    dispatch(setSellerProducts(data.products));
    return data.products;
  };

  return { handleCreateProduct, handleGetSellerProducts };
};
