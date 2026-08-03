import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Menu, ChevronLeft, ChevronRight, ArrowLeft, Truck, RefreshCcw, CreditCard } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails } = useProducts();
  const product = useSelector((state) => state.product.product);
  const [selectedSize, setSelectedSize] = useState("M");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    handleGetProductDetails(id);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D8B03B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF9F5] min-h-screen md:h-screen text-[#1B1C1A] font-sans selection:bg-[#D8B03B] selection:text-white flex flex-col md:overflow-hidden">
      {/* Navigation */}
      <nav className="h-[90px] flex-shrink-0 flex items-center justify-between px-6 lg:px-20 border-b border-[#D8B03B]/20 bg-[#FBF9F5]/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-6 flex-1">
            <button className="text-[#1B1C1A] hover:text-[#D8B03B] transition-colors md:hidden">
                <Menu size={24} strokeWidth={1.5} />
            </button>
            <div className="hidden md:flex gap-8 text-[12px] font-bold tracking-widest uppercase text-[#1B1C1A]">
                <span className="hover:text-[#D8B03B] cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
                <span className="hover:text-[#D8B03B] cursor-pointer transition-colors">Men</span>
                <span className="hover:text-[#D8B03B] cursor-pointer transition-colors">Women</span>
            </div>
        </div>
        
        <div 
            onClick={() => navigate('/')}
            className="text-[28px] font-bold text-[#D8B03B] tracking-[0.3em] uppercase cursor-pointer hover:opacity-80 transition-opacity flex-1 text-center"
            style={{ fontFamily: "Playfair Display, serif" }}
        >
            SNITCH
        </div>

        <div className="flex items-center justify-end gap-6 flex-1">
            <button className="text-[#1B1C1A] hover:text-[#D8B03B] transition-colors hidden md:block">
                <Search size={22} strokeWidth={1.5} />
            </button>
            <button className="text-[13px] font-semibold tracking-widest uppercase hidden md:block hover:text-[#D8B03B] transition-colors" onClick={()=> navigate("/login")}>
                Sign In
            </button>
            <button className="text-[#1B1C1A] hover:text-[#D8B03B] transition-colors relative">
                <ShoppingBag size={24} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#D8B03B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    0
                </span>
            </button>
        </div>
      </nav>

      {/* Main Content Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row md:h-[calc(100vh-90px)]">
        {/* Left: Image Side */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-[#ECE7DE] relative flex-shrink-0 group overflow-hidden">
            {product.images && product.images.length > 0 ? (
                <>
                    <motion.img 
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        src={product.images[currentImageIndex].url} 
                        alt={`${product.title} - ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain object-center mix-blend-multiply p-4 md:p-12"
                    />
                    
                    {/* Carousel Controls */}
                    {product.images.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage}
                                className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#D8B03B] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft size={24} strokeWidth={1.5} />
                            </button>
                            <button 
                                onClick={nextImage}
                                className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#D8B03B] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight size={24} strokeWidth={1.5} />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                {product.images.map((_, index) => (
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
            
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 flex items-center gap-2 text-[#1B1C1A] text-[12px] uppercase font-bold tracking-widest hover:text-[#D8B03B] transition-colors z-10 bg-white/60 px-5 py-2.5 rounded-full backdrop-blur-md"
            >
                <ArrowLeft size={16} strokeWidth={2} />
            </button>
        </div>

        {/* Right: Info Side */}
        <div className="w-full md:w-1/2 md:h-full p-8 py-12 md:p-16 lg:p-24 overflow-y-auto">
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
                    ₹ {product.price?.amount?.toLocaleString() || 0}
                </p>

                {/* Description */}
                <p className="text-[15px] font-light text-[#777777] leading-relaxed mb-10">
                    {product.description || "A masterclass in understated elegance. This piece is designed to drape effortlessly, offering a timeless silhouette for the modern wardrobe. Experience pure luxury and minimal aesthetic tailored to perfection."}
                </p>

                {/* Size Selector */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[12px] font-bold tracking-widest uppercase text-[#1B1C1A]">Select Size</span>
                        <span className="text-[11px] font-medium underline text-[#777777] cursor-pointer hover:text-[#D8B03B]">Size Guide</span>
                    </div>
                    <div className="flex gap-4">
                        {["S", "M", "L", "XL"].map((size) => (
                            <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 flex items-center justify-center border text-[13px] font-bold transition-colors ${
                                    selectedSize === size 
                                    ? "border-[#D8B03B] bg-[#D8B03B] text-white" 
                                    : "border-[#ECE7DE] text-[#1B1C1A] hover:border-[#D8B03B]"
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                    <button 
                    onClick={()=>navigate("/cart")}
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
