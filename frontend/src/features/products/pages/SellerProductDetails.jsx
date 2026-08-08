import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Trash2,
  CloudUpload,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";

const SellerProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails, handleAddVariant } = useProducts();
  const product = useSelector((state) => state.product.product);

  const [showAddVariant, setShowAddVariant] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Form state
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState("");
  const [priceAmount, setPriceAmount] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("INR");
  const [attributes, setAttributes] = useState([]);

  const addVariantRef = useRef(null);

  useEffect(() => {
    handleGetProductDetails(id);
  }, [id]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 7));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 7,
  });

  const removeImage = (e, idx) => {
    e.stopPropagation();
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // No empty slots rendered, only actual images

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleRemoveAttribute = (index) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
  };

  const handleSubmitVariant = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("At least one image is required.");
      return;
    }

    const data = new FormData();
    data.append("stock", stock);
    data.append("priceAmount", priceAmount);
    data.append("priceCurrency", priceCurrency);

    const attributesObj = {};
    attributes.forEach((attr) => {
      if (attr.key.trim() && attr.value.trim()) {
        attributesObj[attr.key.trim()] = attr.value.trim();
      }
    });
    data.append("attributes", JSON.stringify(attributesObj));

    images.forEach((img) => {
      data.append("images", img.file);
    });

    await handleAddVariant(id, data);

    setShowAddVariant(false);
    setImages([]);
    setStock("");
    setPriceAmount("");
    setPriceCurrency("INR");
    setAttributes([]);
  };

  const nextImage = () => {
    if (product?.images?.length) {
      setCurrentImageIdx((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length) {
      setCurrentImageIdx((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D8B03B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F6F2] min-h-screen text-[#1F1F1F] font-sans pb-24 selection:bg-[#D8B03B] selection:text-white">
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

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 mt-8 space-y-16">
        {/* --- Top Section: Product Details --- */}
        <section className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left: Image Swiper with Vertical Thumbnails */}
          <div className="w-full md:w-[480px] shrink-0 flex gap-4">
            {/* Vertical Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar w-[70px] shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`w-full aspect-[4/5] shrink-0 rounded-[12px] overflow-hidden border-[1.5px] transition-all ${idx === currentImageIdx ? "border-[#D8B03B] shadow-sm" : "border-transparent hover:border-[#ECE7DE]"}`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover mix-blend-multiply bg-white"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative aspect-[4/5] bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#ECE7DE]">
              {product.images && product.images.length > 0 ? (
                <>
                  <motion.img
                    key={currentImageIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={product.images[currentImageIdx].url}
                    alt={product.title}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-[#D8B03B] rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105"
                      >
                        <ChevronLeft size={20} strokeWidth={2} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-[#D8B03B] rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105"
                      >
                        <ChevronRight size={20} strokeWidth={2} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#999999] uppercase font-bold text-xs tracking-widest bg-[#FAFAFA]">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex-1">
            <h1
              className="text-[36px] font-semibold text-[#1F1F1F] tracking-tight mb-2 leading-tight"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {product.title}
            </h1>

            <p className="text-[20px] font-bold text-[#D8B03B] mb-8">
              {product.price?.currency}{" "}
              {product.price?.amount?.toLocaleString()}
            </p>

            <div className="w-10 h-[2px] bg-[#D8B03B] mb-8 opacity-50"></div>

            <h3 className="text-[12px] uppercase tracking-widest text-[#999999] font-bold mb-3">
              Description
            </h3>
            <p className="text-[14px] text-[#555555] leading-relaxed mb-10 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </section>

        {/* --- Middle Section: Saved Variants --- */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-[24px] font-semibold text-[#1F1F1F]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Variants
            </h2>
            {!showAddVariant && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAddVariant(true);
                  setTimeout(() => {
                    if (addVariantRef.current) {
                      addVariantRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }, 200);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#D8B03B] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#c29c31] hover:shadow-lg transition-all"
              >
                <Plus size={16} strokeWidth={2.5} />
                ADD VARIANT
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {product.variants?.map((variant, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#ECE7DE] flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 shrink-0 rounded-[8px] overflow-hidden bg-[#FAFAFA] border border-[#ECE7DE]">
                    {variant.images?.[0] ? (
                      <img
                        src={variant.images[0].url}
                        alt="Variant"
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#CCCCCC]">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[#1F1F1F] mb-1">
                      {variant.price?.amount
                        ? `${variant.price.currency} ${variant.price.amount.toLocaleString()}`
                        : "N/A"}
                    </p>
                    <p className="text-[12px] font-medium text-[#777777]">
                      Stock: {variant.stock}
                    </p>
                  </div>
                </div>

                {variant.attributes &&
                  Object.keys(variant.attributes).length > 0 && (
                    <div className="mt-auto pt-3 border-t border-[#ECE7DE] flex flex-wrap gap-2">
                      {Object.entries(variant.attributes).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="px-2 py-1 bg-[#F9F8F5] border border-[#E5E0D8] text-[#555555] rounded-[6px] text-[11px] font-bold uppercase tracking-wider"
                          >
                            {key}: {value}
                          </div>
                        ),
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {(!product.variants || product.variants.length === 0) && (
            <p className="text-[13px] text-[#999999] py-8">
              No variants added yet.
            </p>
          )}
        </section>

        {/* --- Bottom Section: Add Variant Form --- */}
        <AnimatePresence>
          {showAddVariant && (
            <motion.section
              id="add-variant-form-section"
              ref={addVariantRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, height: 0 }}
            >
              <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 border border-[#ECE7DE]">
                <div className="flex justify-between items-center mb-8">
                  <h3
                    className="text-[20px] font-semibold text-[#1F1F1F]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    New Variant Configuration
                  </h3>
                  <button
                    onClick={() => setShowAddVariant(false)}
                    className="p-2 text-[#999999] hover:bg-[#FDFBF7] hover:text-red-500 rounded-full transition-colors border border-transparent hover:border-[#ECE7DE]"
                  >
                    <X size={20} strokeWidth={2} />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmitVariant}
                  className="flex flex-col lg:flex-row gap-10"
                >
                  {/* Left Column: Details */}
                  <div className="flex-1 space-y-8">
                    {/* Financials & Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-[#1F1F1F] uppercase tracking-wider block">
                          Price Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={priceAmount}
                          onChange={(e) => setPriceAmount(e.target.value)}
                          className="w-full h-[48px] px-4 bg-white border border-[#E5E0D8] rounded-[10px] text-[14px] text-[#1F1F1F] placeholder:text-[#999999] focus:outline-none focus:border-[#D8B03B] focus:ring-1 focus:ring-[#D8B03B]/20 transition-all"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-[#1F1F1F] uppercase tracking-wider block">
                          Currency
                        </label>
                        <div className="relative">
                          <select
                            value={priceCurrency}
                            onChange={(e) => setPriceCurrency(e.target.value)}
                            className="w-full h-[48px] px-4 bg-white border border-[#E5E0D8] rounded-[10px] text-[14px] font-bold text-[#1F1F1F] focus:outline-none focus:border-[#D8B03B] focus:ring-1 focus:ring-[#D8B03B]/20 transition-all appearance-none cursor-pointer"
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#999999]">
                            <ChevronDown size={16} strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[12px] font-bold text-[#1F1F1F] uppercase tracking-wider block">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="w-full h-[48px] px-4 bg-white border border-[#E5E0D8] rounded-[10px] text-[14px] text-[#1F1F1F] placeholder:text-[#999999] focus:outline-none focus:border-[#D8B03B] focus:ring-1 focus:ring-[#D8B03B]/20 transition-all"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Attributes */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[13px] font-bold text-[#1F1F1F] block">
                          Variant Attributes
                        </label>
                        <button
                          type="button"
                          onClick={handleAddAttribute}
                          className="text-[12px] text-[#D8B03B] font-bold flex items-center gap-1 hover:underline"
                        >
                          <Plus size={14} strokeWidth={2.5} /> ADD ATTRIBUTE
                        </button>
                      </div>

                      {attributes.length === 0 ? (
                        <div className="p-4 bg-[#FAFAFA] border border-[#E5E0D8] border-dashed rounded-[8px] text-center text-[12px] text-[#999999] font-medium">
                          No custom attributes added.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {attributes.map((attr, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 bg-[#F9F8F5] p-3 rounded-[10px] border border-[#E5E0D8]"
                            >
                              <input
                                type="text"
                                placeholder="Key (e.g. Size)"
                                value={attr.key}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    idx,
                                    "key",
                                    e.target.value,
                                  )
                                }
                                className="w-1/2 bg-white border border-[#E5E0D8] rounded-[6px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#D8B03B]"
                                required
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g. Medium)"
                                value={attr.value}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    idx,
                                    "value",
                                    e.target.value,
                                  )
                                }
                                className="w-1/2 bg-white border border-[#E5E0D8] rounded-[6px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#D8B03B]"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveAttribute(idx)}
                                className="text-[#999999] hover:text-red-500 p-2 rounded-[6px] hover:bg-white transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Image Upload & Submit */}
                  <div className="w-full lg:w-[400px] shrink-0 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[13px] font-bold text-[#1F1F1F] block">
                        Variant Images
                      </label>
                      <span className="text-[11px] text-[#999999] font-medium uppercase tracking-wider">
                        {images.length} / 7
                      </span>
                    </div>

                    <div
                      {...getRootProps()}
                      className={`
                        relative overflow-hidden rounded-[16px] border-[1.5px] border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[160px] mb-4
                        ${isDragActive ? "border-[#D8B03B] bg-[#FDFBF7] scale-[1.01]" : "border-[#E5E0D8] hover:border-[#D8B03B]/50 bg-[#FAFAFA]"}
                    `}
                    >
                      <input {...getInputProps()} />
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                        <CloudUpload
                          size={20}
                          strokeWidth={1.5}
                          className="text-[#D8B03B]"
                        />
                      </div>
                      <p className="text-[13px] font-bold text-[#1F1F1F] mb-1">
                        Drag & Drop Images
                      </p>
                      <p className="text-[11px] font-medium text-[#999999]">
                        PNG, JPG, WEBP
                      </p>
                    </div>

                    {images.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-6">
                        {images.map((img, i) => (
                          <motion.div
                            key={img.preview}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group rounded-[8px] overflow-hidden w-16 h-20 border border-[#ECE7DE] bg-white shrink-0"
                          >
                            <img
                              src={img.preview}
                              alt={`Preview ${i}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-[#1F1F1F]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => removeImage(e, i)}
                                className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-[#1F1F1F] hover:text-red-500 shadow-md transform hover:scale-110 transition-all duration-300"
                              >
                                <X size={12} strokeWidth={2.5} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-6 border-t border-[#E5E0D8]">
                      <button
                        type="submit"
                        className="w-full h-[48px] bg-[#D8B03B] text-white text-[14px] font-bold rounded-[8px] hover:bg-[#c29c31] hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        SAVE VARIANT
                        <ArrowRight size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellerProductDetails;
