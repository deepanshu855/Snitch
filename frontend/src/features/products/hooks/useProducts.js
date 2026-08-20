import { CloudCog } from "lucide-react";
import {
  addProductVariant,
  createProduct,
  deleteProduct,
  deleteVariant,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
  productRecommendation,
} from "../services/product.api.js";
import {
  setSellerProducts,
  setProducts,
  setProduct,
  setDeleteProduct,
} from "../state/product.slice.js";
import { useDispatch } from "react-redux";
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

export const useProducts = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = async (formData) => {
    try {
      const data = await createProduct(formData);
      showToast("Product created successfully", "success");
      return data.product;
    } catch (error) {
      showToast(error.message || "Failed to create product", "error");
      throw error;
    }
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
    try {
      const data = await addProductVariant(productId, formData);
      dispatch(setProduct(data.product));
      showToast("Variant added successfully", "success");
      return data.product;
    } catch (error) {
      showToast(error.message || "Failed to add variant", "error");
      throw error;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const data = await deleteProduct(productId);
      dispatch(setDeleteProduct(productId));
      showToast("Product deleted successfully", "success");
      return data;
    } catch (error) {
      showToast(error.message || "Failed to delete product", "error");
      throw error;
    }
  };

  const handleDeleteVariant= async (productId, variantId)=> {
    try {
      const data= await deleteVariant(productId, variantId);
      showToast("Variant deleted successfully", "success");
      return data
    } catch (error) {
      showToast(error.message || "Failed to delete variant", "error");
      throw error;
    }
  }

  const handleProductRecommendations=async (productId) => {
    const data=await productRecommendation(productId)
    return data.products
  }

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleGetProductDetails,
    handleAddVariant,
    handleDeleteProduct,
    handleDeleteVariant,
    handleProductRecommendations
  };
};
