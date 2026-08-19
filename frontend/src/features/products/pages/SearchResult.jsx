import React, { useEffect, useState, useRef } from "react";
import { useProducts } from "../hooks/useProducts";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

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

const SearchResult = () => {
  const { handleGetAllProducts } = useProducts();
  const allProducts = useSelector((state) => state.product.products) || [];
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [filter, setFilter] = useState("relevance");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Store the previous search and filter to trigger page reset correctly
  const prevSearchRef = useRef(search);
  const prevFilterRef = useRef(filter);

  useEffect(() => {
    if (prevSearchRef.current !== search || prevFilterRef.current !== filter) {
      setPage(1);
      prevSearchRef.current = search;
      prevFilterRef.current = filter;
    }
  }, [search, filter]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const limit = 10;
        const sort = filter === "relevance" ? undefined : filter;
        const data = await handleGetAllProducts(search, sort, page, limit);
        if (data) {
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
    window.scrollTo(0, 0);
  }, [search, filter, page]);

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

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

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
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-24 pb-32">
          
          {/* Header & Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-16 border-b pb-6" style={{ borderColor: tokens.surfaceHighest }}>
            <h2 className="text-[28px] md:text-[36px] font-light mb-6 sm:mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}>
              {search ? `Search Results for "${search}"` : "All Products"}
            </h2>
            
            <div className="flex items-center gap-4">
              <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: tokens.muted }}>Sort By:</span>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-[11px] uppercase tracking-[0.1em] outline-none cursor-pointer py-1"
                style={{ color: tokens.onSurface, borderBottom: `1px solid ${tokens.outlineVariant}` }}
              >
                <option value="relevance">Relevance</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-40 flex justify-center items-center">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${tokens.primary} transparent transparent transparent` }}></div>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              {allProducts.length > 0 ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
                >
                  {allProducts.map((product) => (
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
                          {formatCurrency(product.price?.amount, product.price?.currency)}
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
                    No products found
                  </p>
                  <p 
                    className="text-[11px] uppercase tracking-[0.15em]"
                    style={{ color: tokens.muted }}
                  >
                    Try adjusting your search or filters.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-24 flex items-center justify-center gap-4">
                  <button 
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`p-2 transition-colors ${page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-60 cursor-pointer'}`}
                    style={{ color: tokens.onSurface }}
                  >
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      // Simple logic to show current page and surrounding pages if there are many pages
                      if (totalPages > 5) {
                        if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - page) > 1) {
                          if (pageNum === 2 || pageNum === totalPages - 1) {
                            return <span key={pageNum} className="text-[11px] px-1" style={{ color: tokens.muted }}>...</span>;
                          }
                          return null;
                        }
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium transition-colors ${page === pageNum ? '' : 'hover:opacity-60'}`}
                          style={{ 
                            backgroundColor: page === pageNum ? tokens.onSurface : 'transparent',
                            color: page === pageNum ? tokens.surfaceLowest : tokens.onSurface,
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className={`p-2 transition-colors ${page === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-60 cursor-pointer'}`}
                    style={{ color: tokens.onSurface }}
                  >
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResult;
