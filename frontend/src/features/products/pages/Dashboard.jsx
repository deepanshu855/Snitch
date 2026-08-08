import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts.js";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Filter, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { handleGetSellerProducts } = useProducts();
  const products = useSelector((state) => state.product.sellerProducts) || [];
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
    <div className="bg-[#F8F6F2] min-h-screen text-[#1F1F1F] font-sans pb-16 selection:bg-[#D8B03B] selection:text-white">
      {/* Navigation */}
      <nav className="h-[80px] flex items-center justify-between px-6 lg:px-12 xl:px-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-[#D8B03B] hover:bg-black/5 rounded-full transition-colors"
          >
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <span className="text-[20px] font-bold text-[#D8B03B] tracking-[0.3em] uppercase hidden sm:block">
            SNITCH
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-bold text-[#1F1F1F]">
            Deepanshu Sharma
          </span>
          <div className="w-9 h-9 rounded-full bg-[#F3EFE6] text-[#D8B03B] flex items-center justify-center font-bold text-[13px]">
            DS
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 mt-2">
        {/* Header Section */}
        <div className="mb-10">
          <h1
            className="text-[38px] font-semibold text-[#1F1F1F] tracking-tight mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            My Products
          </h1>
          <p className="text-[14px] text-[#777777] font-medium">
            View all the products you have listed.
          </p>
          <div className="w-12 h-[2px] bg-[#D8B03B] mt-5 opacity-70"></div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-[#1F1F1F]">
              Total Products
            </span>
            <span className="px-2.5 py-0.5 bg-[#F3EFE6] text-[#D8B03B] text-[12px] font-bold rounded-full">
              {products.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative group">
              <select className="h-[42px] pl-4 pr-10 bg-white border border-[#ECE7DE] rounded-[8px] text-[13px] font-semibold text-[#1F1F1F] focus:outline-none focus:border-[#D8B03B] transition-all appearance-none cursor-pointer min-w-[140px] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#777777]">
                <ChevronDown size={16} strokeWidth={2} />
              </div>
            </div>

            {/* Filter Button */}
            <button className="h-[42px] w-[42px] bg-white border border-[#ECE7DE] rounded-[8px] flex items-center justify-center text-[#777777] hover:text-[#1F1F1F] hover:border-[#D8B03B] transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <Filter size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5"
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                }}
                className="bg-white rounded-[16px] p-3 border border-transparent hover:border-[#ECE7DE] transition-all duration-300 flex flex-col"
                onClick={() => {
                  navigate(`/seller/product/${product._id}`);
                }}
              >
                {/* Image Container (Inset) */}
                <div className="w-full aspect-[4/4.5] bg-[#FDFBF7] rounded-[12px] overflow-hidden mb-4 border border-[#ECE7DE]/50">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#999999] text-[11px] uppercase font-bold tracking-widest">
                      No Image
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="px-1 pb-1 flex flex-col flex-1">
                  <h3 className="text-[13px] font-bold text-[#1F1F1F] truncate mb-1 capitalize">
                    {product.title}
                  </h3>
                  <p className="text-[13px] font-bold text-[#1F1F1F] mb-2">
                    ₹ {product.price?.amount?.toLocaleString() || 0}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-[11px] font-medium text-[#999999]">
                      Listed on {formatDate(product.createdAt)}
                    </p>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-7 h-7 rounded-full flex items-center justify-center text-[#999999] hover:bg-[#FDFBF7] hover:text-[#D8B03B] transition-colors">
                        <Edit size={13} strokeWidth={2} />
                      </button>
                      <button className="w-7 h-7 rounded-full flex items-center justify-center text-[#999999] hover:bg-[#FDFBF7] hover:text-red-500 transition-colors">
                        <Trash2 size={13} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-[#777777] text-[14px]">
              No products listed yet.
            </p>
          </div>
        )}

        {/* Footer Text */}
        {products.length > 0 && (
          <div className="mt-16 flex flex-col items-center justify-center opacity-70">
            <p className="text-[12px] font-medium text-[#777777] mb-3">
              You've reached the end of the list.
            </p>
            <div className="w-8 h-[2px] bg-[#D8B03B]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
