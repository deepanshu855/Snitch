import { createProduct, getSellerProducts } from "../services/product.api";
import { setSellerProducts, setProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";

const useProduct = () => {
  const dispatch = useDispatch();

  export const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);
    return data.product;
  };

  export const handleGetSellerProducts = async () => {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
    return data.products;
  };

  return { handleCreateProduct, handleGetSellerProducts };
};
