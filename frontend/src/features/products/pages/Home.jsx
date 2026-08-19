import React, { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
};

const Home = () => {
  const { handleGetAllProducts } = useProducts();
  const allProducts = useSelector((state) => state.product.products) || [];
  const products = allProducts.filter(product => product.variants && product.variants.length > 0).slice(0, 9);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  const formatCurrency = (amount, currency = "INR") =>
    `${currency} ${Number(amount).toLocaleString("en-IN")}`;

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div 
        className="min-h-screen selection:bg-[#C9A96E]/30"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
          color: tokens.onSurface,
        }}
      >

        {/* Hero Section */}
        <div 
          className="relative w-full h-[75vh] overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: tokens.surfaceHigh }}
        >
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
              alt="Hero Fashion" 
              className="absolute inset-0 w-full h-full object-cover object-top mix-blend-multiply opacity-90"
          />
          <div className="relative z-20 text-center px-4 flex flex-col items-center">
              <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-[50px] md:text-[70px] lg:text-[90px] font-light text-white leading-tight mb-6" 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                  The New Standard
              </motion.h1>
              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-white/90 text-[14px] md:text-[16px] max-w-lg font-light tracking-[0.05em] mb-12"
              >
                  Discover our curated collection of minimalist luxury pieces designed for the modern aesthetic.
              </motion.p>
              <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="px-10 py-4 text-[11px] font-medium uppercase tracking-[0.25em] transition-all duration-300"
                  style={{
                      backgroundColor: tokens.surface,
                      color: tokens.onSurface,
                  }}
                  onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = tokens.primary;
                      e.currentTarget.style.color = tokens.surfaceLowest;
                  }}
                  onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = tokens.surface;
                      e.currentTarget.style.color = tokens.onSurface;
                  }}
              >
                  Shop Collection
              </motion.button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-24 pb-32">
            
          {/* Section Header */}
          <div className="mb-24 flex flex-col items-center text-center">
              <span 
                className="text-[10px] font-medium tracking-[0.24em] uppercase mb-6"
                style={{ color: tokens.muted }}
              >
                Latest Arrivals
              </span>
              <h2 
                className="text-[36px] md:text-[44px] font-light" 
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  color: tokens.onSurface
                }}
              >
                  Curated Selection
              </h2>
              <div 
                className="w-8 h-[1px] mt-8"
                style={{ backgroundColor: tokens.outlineVariant }}
              ></div>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
              <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
              >
                  {products.map((product) => (
                      <motion.div 
                          key={product._id} 
                          variants={itemVariants}
                          className="group cursor-pointer flex flex-col"
                          onClick={() => navigate(`/product/${product._id}`)}
                      >
                          {/* Image Container */}
                          <div 
                            className="w-full aspect-[4/5] mb-8 overflow-hidden relative transition-all duration-500"
                            style={{ backgroundColor: tokens.surfaceHigh }}
                          >
                              {product.images && product.images.length > 0 ? (
                                  <img 
                                      src={product.images[0].url} 
                                      alt={product.title}
                                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[0.25,0.46,0.45,0.94]"
                                  />
                              ) : (
                                  <div 
                                    className="w-full h-full flex items-center justify-center text-[10px] uppercase font-medium tracking-[0.2em]"
                                    style={{ color: tokens.muted }}
                                  >
                                      No Image
                                  </div>
                              )}
                              
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                              
                              {/* Quick Add Button */}
                              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                  <button 
                                    className="w-full py-4 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors border border-transparent backdrop-blur-md"
                                    style={{
                                      backgroundColor: "rgba(251, 249, 246, 0.9)",
                                      color: tokens.onSurface,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = tokens.primary;
                                        e.currentTarget.style.color = tokens.surfaceLowest;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgba(251, 249, 246, 0.9)";
                                        e.currentTarget.style.color = tokens.onSurface;
                                    }}
                                  >
                                      Quick Add
                                  </button>
                              </div>
                          </div>

                          {/* Card Details */}
                          <div className="flex flex-col items-center text-center">
                              <h3 
                                className="text-[18px] font-light mb-3 transition-colors" 
                                style={{ 
                                  fontFamily: "'Cormorant Garamond', serif",
                                  color: tokens.onSurface 
                                }}
                              >
                                  {product.title}
                              </h3>
                              <p 
                                className="text-[11px] uppercase tracking-[0.2em] font-medium"
                                style={{ color: tokens.secondary }}
                              >
                                  {formatCurrency(product.price?.amount)}
                              </p>
                          </div>
                      </motion.div>
                  ))}
              </motion.div>
          ) : (
              <div className="py-40 flex flex-col items-center justify-center text-center">
                  <div 
                    className="w-20 h-20 border rounded-full flex items-center justify-center mb-8"
                    style={{ borderColor: tokens.outlineVariant }}
                  >
                      <ShoppingBag size={24} style={{ color: tokens.muted }} />
                  </div>
                  <p 
                    className="text-[20px] font-light mb-3"
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif",
                      color: tokens.onSurface 
                    }}
                  >
                    The collection is currently being updated.
                  </p>
                  <p 
                    className="text-[11px] uppercase tracking-[0.15em]"
                    style={{ color: tokens.muted }}
                  >
                    Please check back soon.
                  </p>
              </div>
          )}
          
          {/* View All Button */}
          {products.length > 0 && (
              <div className="mt-32 flex justify-center">
                  <button 
                    className="pb-2 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors border-b"
                    style={{
                      color: tokens.onSurface,
                      borderColor: tokens.outlineVariant
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = tokens.primary;
                        e.currentTarget.style.borderColor = tokens.primary;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = tokens.onSurface;
                        e.currentTarget.style.borderColor = tokens.outlineVariant;
                    }}
                    onClick={() => navigate('/products')}
                  >
                      View Entire Collection
                  </button>
              </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
