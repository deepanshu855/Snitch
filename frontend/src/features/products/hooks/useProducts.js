import { CloudCog } from "lucide-react";
import {
  addProductVariant,
  createProduct,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
} from "../services/product.api.js";
import {
  setSellerProducts,
  setProducts,
  setProduct,
} from "../state/product.slice.js";
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

  const handleGetAllProducts = async () => {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
    return data.products;
  };

  const handleGetProductDetails = async (productId) => {
    const data = await getProductDetails(productId);
    dispatch(setProduct(data.product));
    return data.product;
  };

  const handleAddVariant = async (productId, formData) => {
    const data = await addProductVariant(productId, formData);
    dispatch(setProduct(data.product));
    return data.product;
  };

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleGetProductDetails,
    handleAddVariant,
  };
};
