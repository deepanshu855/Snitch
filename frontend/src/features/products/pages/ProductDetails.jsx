import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, ChevronLeft, ChevronRight, ArrowLeft, Truck, RefreshCcw, CreditCard, CloudCog } from "lucide-react";
import { useCart } from "../../cart/hooks/useCart.js"

const tokens = {
  surface: "#fbf9f6",
  surfaceLow: "#f5f3f0",
  surfaceLowest: "#ffffff",
  surfaceHigh: "#eae8e5",
  surfaceHighest: "#e4e2df",
  onSurface: "#1b1c1a",
  onSurfaceVariant: "#4d463a",
  secondary: "#7A6E63",
  muted: "#B5ADA3",
  primary: "#C9A96E",
  primaryDark: "#745a27",
  outlineVariant: "#d0c5b5",
  outline: "#7f7668",
  success: "#5a7a5a"
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails } = useProducts();
  const product = useSelector((state) => state.product.product);
  const user = useSelector((state) => state.auth.user);
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
        return prev;
      }
      const newSelection = { ...prev, [key]: value };
      let match = product?.variants?.find(v => {
        if (!v.attributes) return false;
        return Object.entries(newSelection).every(([k, vVal]) => v.attributes[k] === vVal);
      });
      if (match && match.attributes) {
        return match.attributes;
      }
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
  const stock = selectedVariant?.stock || 0;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: tokens.surface }}>
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: tokens.primary }}></div>
      </div>
    );
  }

  const handleAddToCart = async (productId, variantId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    await handleAddItemToCart({ productId, variantId })
  }

  const handleBuyNow = async (productId, variantId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    await handleAddItemToCart({ productId, variantId });
    navigate("/cart");
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <div 
        className="min-h-screen md:h-screen flex flex-col md:overflow-hidden selection:bg-[#C9A96E]/30"
        style={{ backgroundColor: tokens.surface, color: tokens.onSurface, fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex-1 flex flex-col md:flex-row md:h-[calc(100vh-90px)] max-w-7xl mx-auto w-full">
          {/* Left: Image Side */}
          <div className="w-full md:w-[55%] h-[60vh] md:h-full relative flex-shrink-0 flex p-6 md:p-12 gap-6">



            {/* Vertical Thumbnails */}
            {displayImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-4 overflow-y-auto h-full pr-2 custom-scrollbar w-[80px] shrink-0 z-10 relative">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-full aspect-[3/4] shrink-0 overflow-hidden transition-all duration-300 ${idx === currentImageIndex ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img.url} className="w-full h-full object-cover mix-blend-multiply" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Container */}
            <div className="flex-1 relative h-full overflow-hidden flex items-center justify-center group" style={{ backgroundColor: tokens.surfaceHigh }}>
              {displayImages.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={displayImages[currentImageIndex].url}
                      alt={`${product.title} - ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover object-center mix-blend-multiply"
                    />
                  </AnimatePresence>

                  {/* Carousel Controls */}
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-sm flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 hover:bg-white"
                        style={{ color: tokens.onSurface }}
                      >
                        <ChevronLeft size={20} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-sm flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 hover:bg-white"
                        style={{ color: tokens.onSurface }}
                      >
                        <ChevronRight size={20} strokeWidth={1.5} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] uppercase font-medium tracking-[0.2em]" style={{ color: tokens.muted }}>
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Right: Info Side */}
          <div className="w-full md:w-[45%] md:h-full p-8 md:p-12 lg:p-16 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-md w-full flex flex-col pb-10 md:pb-0"
            >
              {/* Title */}
              <h1 
                className="text-[32px] md:text-[40px] font-light leading-[1.1] mb-4" 
                style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
              >
                {product.title}
              </h1>
              
              {/* Price */}
              <p 
                className="text-[11px] font-bold uppercase tracking-[0.2em] mb-12"
                style={{ color: tokens.onSurface }}
              >
                {displayCurrency} {displayPrice.toLocaleString()}
              </p>

              {/* Variant Selectors */}
              <div className="flex flex-col gap-8 mb-8">
                {Object.entries(availableAttributes).map(([attrKey, values]) => (
                  <div key={attrKey}>
                    <div 
                      className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3"
                      style={{ color: tokens.primary }}
                    >
                      {attrKey}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {values.map((val) => {
                        const isSelected = selectedAttributes[attrKey] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleAttributeSelect(attrKey, val)}
                            className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-all"
                            style={{
                              backgroundColor: isSelected ? tokens.onSurface : "transparent",
                              color: isSelected ? tokens.surfaceLowest : tokens.onSurface,
                              border: `1px solid ${isSelected ? tokens.onSurface : tokens.outlineVariant}`
                            }}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stock Indicator */}
              <div 
                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-12"
                style={{ color: stock > 0 ? tokens.success : tokens.muted }}
              >
                {stock > 0 ? `${stock} IN STOCK` : 'OUT OF STOCK'}
              </div>

              {/* Description */}
              <div className="mb-12">
                <div 
                  className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
                  style={{ color: tokens.muted }}
                >
                  The Details
                </div>
                <p 
                  className="text-[13px] font-light leading-relaxed"
                  style={{ color: tokens.onSurfaceVariant }}
                >
                  {product.description || "A masterclass in understated elegance. This piece is designed to drape effortlessly, offering a timeless silhouette for the modern wardrobe."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    handleAddToCart(product._id, selectedVariant?._id)
                  }}
                  className="w-full h-12 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 group"
                  style={{ backgroundColor: tokens.onSurface, color: tokens.surfaceLowest }}
                  onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = tokens.primary;
                  }}
                  onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = tokens.onSurface;
                  }}
                >
                  <ShoppingBag size={14} strokeWidth={1.5} className="group-hover:-translate-y-1 transition-transform duration-300" />
                  Add to Cart
                </button>
                <button 
                  onClick={() => {
                    handleBuyNow(product._id, selectedVariant?._id)
                  }}
                  className="w-full h-12 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 group"
                  style={{ color: tokens.onSurface, backgroundColor: "transparent", border: `1px solid ${tokens.outlineVariant}` }}
                  onMouseEnter={(e) => {
                      e.currentTarget.style.color = tokens.primary;
                      e.currentTarget.style.borderColor = tokens.primary;
                  }}
                  onMouseLeave={(e) => {
                      e.currentTarget.style.color = tokens.onSurface;
                      e.currentTarget.style.borderColor = tokens.outlineVariant;
                  }}
                >
                  <CreditCard size={14} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                  Buy Now
                </button>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
