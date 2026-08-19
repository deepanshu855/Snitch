import { CloudCog } from "lucide-react";
import {
  addProductVariant,
  createProduct,
  deleteProduct,
  deleteVariant,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
} from "../services/product.api.js";
import {
  setSellerProducts,
  setProducts,
  setProduct,
  setDeleteProduct,
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

  const handleGetAllProducts = async (search, sort, page, limit) => {
    const data = await getAllProducts(search, sort, page, limit);
    const products = data.searchProducts || data.products || [];
    dispatch(setProducts(products));
    return data;
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

  const handleDeleteProduct = async (productId) => {
    const data = await deleteProduct(productId);
    dispatch(setDeleteProduct(productId));
    return data;
  };

  const handleDeleteVariant= async (productId, variantId)=> {
    const data= await deleteVariant(productId, variantId);
    return data
  }

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleGetProductDetails,
    handleAddVariant,
    handleDeleteProduct,
    handleDeleteVariant
  };
};
