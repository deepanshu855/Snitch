import React, { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { handleGetAllProducts } = useProducts();
  const products = useSelector((state) => state.product.products) || [];
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

  return (
    <div className="bg-[#FBF9F5] min-h-screen text-[#1B1C1A] font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* Navigation */}
      <nav className="h-[90px] flex items-center justify-between px-6 lg:px-20 border-b border-[#D8B03B]/20 sticky top-0 z-50 bg-[#FBF9F5]/90 backdrop-blur-md">
        <div className="flex items-center gap-6 flex-1">
            <button className="text-[#1B1C1A] hover:text-[#D8B03B] transition-colors md:hidden">
                <Menu size={24} strokeWidth={1.5} />
            </button>
            <div className="hidden md:flex gap-8 text-[12px] font-bold tracking-widest uppercase text-[#1B1C1A]">
                <span className="hover:text-[#D8B03B] cursor-pointer transition-colors">Men</span>
                <span className="hover:text-[#D8B03B] cursor-pointer transition-colors">Women</span>
                <span className="hover:text-[#D8B03B] cursor-pointer transition-colors">New Arrivals</span>
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

      {/* Hero Section */}
      <div className="relative w-full h-[70vh] bg-[#ECE7DE] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10 z-10"></div>
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
                className="text-[50px] md:text-[70px] lg:text-[90px] font-medium text-white leading-tight tracking-tight mb-6" 
                style={{ fontFamily: "Playfair Display, serif" }}
            >
                The New Standard
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-white/90 text-[16px] md:text-[18px] max-w-lg font-light tracking-wide mb-10"
            >
                Discover our curated collection of minimalist luxury pieces designed for the modern aesthetic.
            </motion.p>
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="bg-[#D8B03B] text-white px-10 py-4 text-[13px] font-bold uppercase tracking-widest hover:bg-[#1B1C1A] transition-all duration-300"
            >
                Shop Collection
            </motion.button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24">
          
        {/* Section Header */}
        <div className="mb-20 flex flex-col items-center text-center">
            <span className="text-[12px] font-bold text-[#D8B03B] tracking-[0.2em] uppercase mb-4">Latest Arrivals</span>
            <h2 className="text-[36px] md:text-[44px] font-medium text-[#1B1C1A]" style={{ fontFamily: "Playfair Display, serif" }}>
                Curated Selection
            </h2>
            <div className="w-12 h-[2px] bg-[#D8B03B] mt-8 opacity-70"></div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20"
            >
                {products.map((product) => (
                    <motion.div 
                        key={product._id} 
                        variants={itemVariants}
                        className="group cursor-pointer flex flex-col"
                        onClick={() => navigate(`/${product._id}`)}
                    >
                        {/* Image Container */}
                        <div className="w-full aspect-[3/4] bg-[#F5F3EF] mb-6 overflow-hidden relative border border-transparent group-hover:border-[#D8B03B]/40 transition-all duration-500">
                            {product.images && product.images.length > 0 ? (
                                <img 
                                    src={product.images[0].url} 
                                    alt={product.title}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[0.25,0.46,0.45,0.94]"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#999999] text-[12px] uppercase font-bold tracking-widest">
                                    No Image
                                </div>
                            )}
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            
                            {/* Quick Add Button */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                <button className="w-full bg-[#FBF9F5]/95 backdrop-blur-sm text-[#1B1C1A] py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-[#D8B03B] hover:text-white transition-colors border border-transparent">
                                    Quick Add
                                </button>
                            </div>
                        </div>

                        {/* Card Details */}
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-[15px] font-medium text-[#1B1C1A] mb-2 group-hover:text-[#D8B03B] transition-colors" style={{ fontFamily: "Playfair Display, serif" }}>
                                {product.title}
                            </h3>
                            <p className="text-[14px] font-medium text-[#777777]">
                                ₹ {product.price?.amount?.toLocaleString() || 0}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border border-[#ECE7DE] rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={24} className="text-[#ECE7DE]" />
                </div>
                <p className="text-[#777777] text-[16px] font-light tracking-wide">The collection is currently being updated.</p>
                <p className="text-[#999999] text-[14px] mt-2">Please check back soon.</p>
            </div>
        )}
        
        {/* View All Button */}
        {products.length > 0 && (
            <div className="mt-24 flex justify-center">
                <button className="border-b-2 border-[#D8B03B] text-[#1B1C1A] pb-1 text-[13px] font-bold uppercase tracking-widest hover:text-[#D8B03B] transition-colors">
                    View Entire Collection
                </button>
            </div>
        )}
      </div>

      {/* Minimal Footer */}
      <footer className="w-full bg-[#1B1C1A] text-white py-20 px-6 lg:px-20 mt-20">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="text-[24px] font-bold tracking-[0.3em] uppercase opacity-90" style={{ fontFamily: "Playfair Display, serif" }}>
                  SNITCH
              </div>
              <div className="flex gap-8 text-[12px] font-semibold uppercase tracking-widest text-[#999999]">
                  <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Pinterest</span>
              </div>
              <div className="text-[12px] font-medium text-[#777777]">
                  © 2026 SNITCH. All rights reserved.
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Home;
