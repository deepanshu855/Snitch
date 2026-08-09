import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Menu, ChevronLeft, ChevronRight, ArrowLeft, Truck, RefreshCcw, CreditCard, CloudCog } from "lucide-react";
import { useCart } from "../../cart/hooks/useCart.js"

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails } = useProducts();
  const product = useSelector((state) => state.product.product);
  const { handleAddItemToCart } = useCart()

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedAttributes(product.variants[0].attributes || {});
    } else {
      setSelectedAttributes({});
    }
  }, [product]);

  // Get available attributes from variants
  const availableAttributes = useMemo(() => {
    const attrs = {};
    if (product?.variants) {
      product.variants.forEach(variant => {
        if (variant.attributes) {
          Object.entries(variant.attributes).forEach(([key, value]) => {
            if (!attrs[key]) attrs[key] = new Set();
            attrs[key].add(value);
          });
        }
      });
    }
    // Convert sets to arrays
    Object.keys(attrs).forEach(key => {
      attrs[key] = Array.from(attrs[key]);
    });
    return attrs;
  }, [product]);

  // Find the selected variant based on selected attributes
  const selectedVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;

    // IF NOTHING IS SELECTED, return null
    if (Object.keys(selectedAttributes).length === 0) return null;

    // Find exact match
    return product.variants.find(variant => {
      if (!variant.attributes) return false;
      return Object.keys(selectedAttributes).length > 0 && Object.entries(selectedAttributes).every(([key, val]) => variant.attributes[key] === val);
    }) || null;
  }, [product, selectedAttributes]);

  // Update images based on selected variant or fallback to product images
  const displayImages = useMemo(() => {
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    return product?.images || [];
  }, [selectedVariant, product]);

  // Reset image index when variant changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedVariant]);

  const handleAttributeSelect = (key, value) => {
    setSelectedAttributes(prev => {
      if (prev[key] === value) {
        // Do not deselect if clicked again
        return prev;
      }

      const newSelection = { ...prev, [key]: value };

      // Find an exact match for the combined selection
      let match = product?.variants?.find(v => {
        if (!v.attributes) return false;
        return Object.entries(newSelection).every(([k, vVal]) => v.attributes[k] === vVal);
      });

      if (match && match.attributes) {
        // Snap to this variant's full attribute set
        return match.attributes;
      }

      // If invalid combination, fallback to finding the first variant with the newly clicked attribute
      let fallbackMatch = product?.variants?.find(v => v.attributes?.[key] === value);
      if (fallbackMatch && fallbackMatch.attributes) {
        return fallbackMatch.attributes;
      }

      return newSelection;
    });
  };

  const nextImage = () => {
    if (displayImages.length > 0) {
      setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (displayImages.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    handleGetProductDetails(id);
  }, [id]);

  const displayPrice = selectedVariant?.price?.amount || product?.price?.amount || 0;
  const displayCurrency = selectedVariant?.price?.currency || product?.price?.currency || 'INR';

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D8B03B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleAddToCart = async (productId, variantId) => {
    await handleAddItemToCart({ productId, variantId })
  }


  return (
    <div className="bg-[#FBF9F5] min-h-screen md:h-screen text-[#1B1C1A] font-sans selection:bg-[#D8B03B] selection:text-white flex flex-col md:overflow-hidden">


      {/* Main Content Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row md:h-[calc(100vh-90px)]">
        {/* Left: Image Side */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative flex-shrink-0 flex p-4 md:p-8 lg:p-10 gap-4">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-2 left-4 md:top-6 md:left-8 flex items-center gap-2 text-[#1B1C1A] text-[12px] uppercase font-bold tracking-widest hover:text-[#555555] transition-colors z-20 bg-white/80 px-4 py-2 rounded-full backdrop-blur-md shadow-sm border border-[#ECE7DE]"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>

          {/* Vertical Thumbnails (Desktop) */}
          {displayImages.length > 1 && (
            <div className="hidden md:flex flex-col gap-3 overflow-y-auto h-full pt-14 pr-2 custom-scrollbar w-[80px] lg:w-[100px] shrink-0 z-10 relative">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-full aspect-square shrink-0 rounded-[12px] overflow-hidden border-[2px] transition-all bg-white shadow-sm ${idx === currentImageIndex
                    ? 'border-[#555555] shadow-md scale-[1.02]'
                    : 'border-transparent hover:border-[#1B1C1A]/20'
                    }`}
                >
                  <img src={img.url} className="w-full h-full object-cover mix-blend-multiply bg-[#ECE7DE]/30" />
                </button>
              ))}
            </div>
          )}

          {/* Main Image Container */}
          <div className="flex-1 relative h-full bg-[#ECE7DE] rounded-[24px] overflow-hidden group shadow-sm flex items-center justify-center">

            {displayImages.length > 0 ? (
              <>
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  src={displayImages[currentImageIndex].url}
                  alt={`${product.title} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain object-center mix-blend-multiply p-8 md:p-12"
                />

                {/* Carousel Controls */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#D8B03B] hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <ChevronLeft size={24} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#D8B03B] hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <ChevronRight size={24} strokeWidth={1.5} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {displayImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-[#1B1C1A] w-6' : 'bg-[#1B1C1A]/30'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#999999] text-[12px] uppercase font-bold tracking-widest">
                No Image Available
              </div>
            )}
          </div>
        </div>

        {/* Right: Info Side */}
        <div className="w-full md:w-1/2 md:h-full p-8 md:p-8 lg:p-10 lg:pl-16 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-md w-full mx-auto flex flex-col pb-10 md:pb-0"
          >
            {/* Breadcrumb / Label */}
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#D8B03B] mb-6">
              New Collection
            </div>

            {/* Title & Price */}
            <h1 className="text-[38px] lg:text-[46px] font-medium text-[#1B1C1A] leading-tight mb-4 capitalize" style={{ fontFamily: "Playfair Display, serif" }}>
              {product.title}
            </h1>
            <p className="text-[22px] font-medium text-[#1B1C1A] mb-8">
              {displayCurrency === 'INR' ? '₹' : displayCurrency} {displayPrice.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-[15px] font-light text-[#777777] leading-relaxed mb-10">
              {product.description || "A masterclass in understated elegance. This piece is designed to drape effortlessly, offering a timeless silhouette for the modern wardrobe. Experience pure luxury and minimal aesthetic tailored to perfection."}
            </p>

            {/* Variant Selectors */}
            {Object.entries(availableAttributes).map(([attrKey, values]) => (
              <div className="mb-10" key={attrKey}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] font-bold tracking-widest uppercase text-[#1B1C1A]">Select {attrKey}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {values.map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAttributeSelect(attrKey, val)}
                      className={`px-4 h-12 min-w-[3rem] flex items-center justify-center border text-[13px] font-bold transition-colors ${selectedAttributes[attrKey] === val
                        ? "border-[#D8B03B] bg-[#D8B03B] text-white"
                        : "border-[#ECE7DE] text-[#1B1C1A] hover:border-[#D8B03B]"
                        }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  handleAddToCart(product._id, selectedVariant._id)
                }}
                className="w-full bg-transparent border-2 border-[#1B1C1A] text-[#1B1C1A] h-14 flex items-center justify-center gap-3 text-[13px] font-bold uppercase tracking-widest hover:bg-[#1B1C1A] hover:text-white transition-colors group">
                <ShoppingBag size={18} strokeWidth={1.5} className="group-hover:animate-bounce" />
                Add to Cart
              </button>
              <button className="w-full bg-[#D8B03B] text-white h-14 flex items-center justify-center gap-3 text-[13px] font-bold uppercase tracking-widest hover:bg-[#1B1C1A] transition-colors border border-transparent">
                <CreditCard size={18} strokeWidth={1.5} />
                Buy Now
              </button>
            </div>

            {/* Extra info */}
            <div className="mt-10 pt-8 border-t border-[#ECE7DE]/50 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[12px]">
                <Truck size={18} strokeWidth={1.5} className="text-[#D8B03B]" />
                <span className="text-[#777777] flex-1">Shipping</span>
                <span className="font-medium text-[#1B1C1A]">Free standard shipping</span>
              </div>
              <div className="flex items-center gap-3 text-[12px]">
                <RefreshCcw size={18} strokeWidth={1.5} className="text-[#D8B03B]" />
                <span className="text-[#777777] flex-1">Returns</span>
                <span className="font-medium text-[#1B1C1A]">30-day return policy</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
