import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts.js";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ChevronDown, Filter, Edit, Trash2 } from "lucide-react";
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

const Dashboard = () => {
  const { handleGetSellerProducts, handleDeleteProduct } = useProducts();
  const products = useSelector((state) => state.product.sellerProducts) || [];
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const activeProducts = products.filter(p => p.variants && p.variants.length > 0);
  const draftProducts = products.filter(p => !p.variants || p.variants.length === 0);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderProductCard = (product, index) => (
    <motion.div
      key={product._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col cursor-pointer relative"
      onClick={() => navigate(`/seller/product/${product._id}`)}
    >
      {/* Image Container */}
      <div 
        className="w-full aspect-[4/5] relative overflow-hidden mb-4"
        style={{ backgroundColor: tokens.surfaceHigh }}
      >
        {(!product.variants || product.variants.length === 0) && (
          <div className="absolute top-3 left-3 px-3 py-1.5 backdrop-blur-md bg-black/50 text-white text-[8px] uppercase tracking-[0.2em] font-bold z-10 border border-white/10">
            Action Required: Add Variant
          </div>
        )}
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${(!product.variants || product.variants.length === 0) ? 'opacity-70 grayscale-[0.3]' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[9px] uppercase font-bold tracking-[0.2em]" style={{ color: tokens.muted }}>
            No Image
          </div>
        )}
        
        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-black hover:bg-white hover:scale-105 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/seller/product/${product._id}`);
            }}
          >
            <Edit size={14} strokeWidth={1.5} />
          </button>
          <button 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-red-500 hover:bg-white hover:scale-105 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setProductToDelete(product._id);
              setDeleteModalOpen(true);
            }}
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-col flex-1 px-1">
        <h3 
          className="text-[12px] uppercase tracking-[0.1em] font-medium truncate mb-1"
          style={{ color: tokens.onSurface }}
        >
          {product.title}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold tracking-[0.1em]" style={{ color: tokens.secondary }}>
            INR {product.price?.amount?.toLocaleString() || 0}
          </p>
        </div>
        <p className="text-[9px] uppercase tracking-[0.15em] mt-auto" style={{ color: tokens.muted }}>
          Listed {formatDate(product.createdAt)}
        </p>
      </div>
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div 
      className="min-h-screen pb-16 selection:bg-[#C9A96E]/30"
      style={{ backgroundColor: tokens.surface, color: tokens.onSurface, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 pt-12 lg:pt-20">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1
            className="font-light leading-[1.05] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: tokens.onSurface }}
          >
            My Archive
          </h1>
          <p 
            className="text-[10px] uppercase tracking-[0.24em] font-medium" 
            style={{ color: tokens.muted }}
          >
            Manage your listed pieces
          </p>
          <div className="w-12 h-[1px] mt-6 opacity-50" style={{ backgroundColor: tokens.primary }}></div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b" style={{ borderColor: tokens.surfaceHighest }}>
          <div className="flex items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: tokens.onSurface }}>
              Total Pieces
            </span>
            <span 
              className="px-2.5 py-1 text-[9px] font-bold rounded-sm flex items-center justify-center"
              style={{ backgroundColor: tokens.surfaceHigh, color: tokens.onSurfaceVariant }}
            >
              {products.length}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative group">
              <select 
                className="h-[36px] pl-4 pr-10 bg-transparent border rounded-none text-[9px] uppercase tracking-[0.15em] font-bold focus:outline-none transition-colors appearance-none cursor-pointer min-w-[150px]"
                style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                onMouseEnter={(e) => e.target.style.borderColor = tokens.primary}
                onMouseLeave={(e) => e.target.style.borderColor = tokens.outlineVariant}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" style={{ color: tokens.muted }}>
                <ChevronDown size={14} strokeWidth={1.5} />
              </div>
            </div>

            {/* Filter Button */}
            <button 
              className="h-[36px] w-[36px] bg-transparent border rounded-none flex items-center justify-center transition-colors group"
              style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = tokens.primary; e.currentTarget.style.color = tokens.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.outlineVariant; e.currentTarget.style.color = tokens.onSurface; }}
            >
              <Filter size={14} strokeWidth={1.5} className="group-hover:text-current" />
            </button>
          </div>
        </div>

        {/* Sections for Draft and Active Products */}
        {products.length > 0 ? (
          <div className="space-y-16">
            {draftProducts.length > 0 && (
              <div>
                <h2 
                  className="text-[18px] font-light mb-6 border-b pb-4 flex items-center gap-3" 
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface, borderColor: tokens.surfaceHighest }}
                >
                  Action Required <span className="text-[10px] uppercase tracking-[0.15em] font-bold px-2 py-1 bg-red-50 text-red-500 border border-red-100 rounded-sm font-sans" style={{fontFamily: "'Inter', sans-serif"}}>Not Listed</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                  {draftProducts.map((product, index) => renderProductCard(product, index))}
                </div>
              </div>
            )}
            
            {activeProducts.length > 0 && (
              <div>
                {draftProducts.length > 0 && (
                  <h2 
                    className="text-[18px] font-light mb-6 border-b pb-4" 
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface, borderColor: tokens.surfaceHighest }}
                  >
                    Active Listings
                  </h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                  {activeProducts.map((product, index) => renderProductCard(product, index))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center gap-6 py-32"
          >
            <p
              className="text-4xl md:text-5xl font-light leading-tight text-center"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: tokens.onSurface,
              }}
            >
              Your archive is empty.
            </p>
            <p
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: tokens.muted }}
            >
              List your first piece
            </p>
          </motion.div>
        )}

        {/* Footer Text */}
        {products.length > 0 && (
          <div className="mt-20 pt-10 flex flex-col items-center justify-center border-t" style={{ borderColor: tokens.surfaceHighest }}>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: tokens.muted }}>
              End of list
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="p-8 max-w-sm w-full shadow-2xl"
              style={{ backgroundColor: tokens.surface, border: `1px solid ${tokens.outlineVariant}` }}
            >
              <h3 
                className="text-2xl mb-3 leading-tight" 
                style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
              >
                Delete Piece
              </h3>
              <p 
                className="text-xs mb-8 leading-relaxed" 
                style={{ color: tokens.onSurfaceVariant }}
              >
                Are you sure you want to permanently remove this piece from your archive? This action cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="w-full py-3.5 text-[10px] uppercase tracking-[0.2em] font-bold border transition-colors flex items-center justify-center"
                  style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = tokens.primary; e.currentTarget.style.color = tokens.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.outlineVariant; e.currentTarget.style.color = tokens.onSurface; }}
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setProductToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w-full py-3.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors flex items-center justify-center text-white"
                  style={{ backgroundColor: "#ef4444" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#dc2626"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ef4444"; }}
                  onClick={() => {
                    handleDeleteProduct(productToDelete);
                    setDeleteModalOpen(false);
                    setProductToDelete(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
