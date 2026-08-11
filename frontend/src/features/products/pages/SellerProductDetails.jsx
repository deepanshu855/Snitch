import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";
import { useSelector } from "react-redux";
import {
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

const SellerProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails, handleAddVariant, handleDeleteVariant } = useProducts();
  const product = useSelector((state) => state.product.product);

  const [showAddVariant, setShowAddVariant] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const [deleteVariantModalOpen, setDeleteVariantModalOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: tokens.surface }}>
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: tokens.primary }}></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-24 selection:bg-[#C9A96E]/30"
      style={{ backgroundColor: tokens.surface, color: tokens.onSurface, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-16 space-y-16">
        {/* --- Top Section: Product Details --- */}
        <section className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start">
          {/* Left: Image Swiper with Vertical Thumbnails */}
          <div className="w-full md:w-[480px] shrink-0 flex gap-4">
            {/* Vertical Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar w-[70px] shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    className="w-full aspect-[4/5] shrink-0 overflow-hidden border transition-all rounded-none"
                    style={{ 
                      borderColor: idx === currentImageIdx ? tokens.primary : 'transparent',
                      opacity: idx === currentImageIdx ? 1 : 0.6
                    }}
                    onMouseEnter={(e) => { if (idx !== currentImageIdx) e.currentTarget.style.opacity = 1; }}
                    onMouseLeave={(e) => { if (idx !== currentImageIdx) e.currentTarget.style.opacity = 0.6; }}
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover bg-white mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div 
              className="flex-1 relative aspect-[4/5] overflow-hidden rounded-none"
              style={{ backgroundColor: tokens.surfaceHigh }}
            >
              {product.images && product.images.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      src={product.images[currentImageIdx].url}
                      alt={product.title}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </AnimatePresence>
                  
                  {product.images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={prevImage}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-black rounded-none flex items-center justify-center transition-transform hover:scale-105"
                      >
                        <ChevronLeft size={20} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-black rounded-none flex items-center justify-center transition-transform hover:scale-105"
                      >
                        <ChevronRight size={20} strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: tokens.muted }}>
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex-1">
            <h1
              className="font-light leading-tight mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: tokens.onSurface }}
            >
              {product.title}
            </h1>

            <p className="text-[14px] font-bold tracking-[0.1em] mb-8" style={{ color: tokens.secondary }}>
              {product.price?.currency}{" "}
              {product.price?.amount?.toLocaleString()}
            </p>

            <div className="w-12 h-[1px] mb-8 opacity-50" style={{ backgroundColor: tokens.primary }}></div>

            <h3 className="text-[9px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: tokens.onSurface }}>
              Description
            </h3>
            <p className="text-[13px] leading-[1.8] whitespace-pre-line" style={{ color: tokens.onSurfaceVariant }}>
              {product.description}
            </p>
          </div>
        </section>

        {/* --- Middle Section: Saved Variants --- */}
        <section>
          <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: tokens.surfaceHighest }}>
            <h2
              className="font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: tokens.onSurface }}
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
                className="flex items-center gap-2 px-6 py-3 text-[9px] uppercase tracking-[0.2em] font-bold transition-all"
                style={{ backgroundColor: tokens.onSurface, color: tokens.surfaceLowest }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.primary}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.onSurface}
              >
                <Plus size={14} strokeWidth={2} />
                Add Variant
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {product.variants?.map((variant, idx) => (
              <div
                key={idx}
                className="p-6 border flex flex-col rounded-none relative group"
                style={{ backgroundColor: tokens.surfaceLowest, borderColor: tokens.outlineVariant }}
              >
                {/* Delete Variant Button */}
                <button
                  onClick={() => {
                    setVariantToDelete(variant._id);
                    setDeleteVariantModalOpen(true);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
                <div className="flex items-center gap-5 mb-6">
                  <div 
                    className="w-20 h-24 shrink-0 overflow-hidden"
                    style={{ backgroundColor: tokens.surfaceHigh }}
                  >
                    {variant.images?.[0] ? (
                      <img
                        src={variant.images[0].url}
                        alt="Variant"
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: tokens.muted }}>
                        <ImageIcon size={18} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold tracking-[0.1em] mb-2" style={{ color: tokens.secondary }}>
                      {variant.price?.amount
                        ? `${variant.price.currency} ${variant.price.amount.toLocaleString()}`
                        : "N/A"}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.1em] font-medium" style={{ color: tokens.muted }}>
                      Stock: {variant.stock}
                    </p>
                  </div>
                </div>

                {variant.attributes && Object.keys(variant.attributes).length > 0 && (
                  <div className="mt-auto pt-4 border-t flex flex-wrap gap-2" style={{ borderColor: tokens.outlineVariant }}>
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <div
                        key={key}
                        className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em]"
                        style={{ backgroundColor: tokens.surfaceHigh, color: tokens.onSurface }}
                      >
                        {key}: {value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {(!product.variants || product.variants.length === 0) && (
            <p className="text-[10px] uppercase tracking-[0.15em] font-medium py-12 text-center" style={{ color: tokens.muted }}>
              No variants added to this piece yet.
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
              <div className="p-8 lg:p-10 shadow-sm border rounded-none" style={{ backgroundColor: tokens.surfaceLowest, borderColor: tokens.outlineVariant }}>
                <div className="flex justify-between items-center mb-10">
                  <h3
                    className="font-light text-[1.8rem]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
                  >
                    New Configuration
                  </h3>
                  <button
                    onClick={() => setShowAddVariant(false)}
                    className="p-2 transition-colors hover:opacity-50"
                    style={{ color: tokens.onSurface }}
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmitVariant}
                  className="flex flex-col lg:flex-row gap-12"
                >
                  {/* Left Column: Details */}
                  <div className="flex-1 space-y-10">
                    {/* Financials & Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] block" style={{ color: tokens.onSurface }}>
                          Price Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={priceAmount}
                          onChange={(e) => setPriceAmount(e.target.value)}
                          className="w-full h-[48px] px-4 bg-transparent border text-[12px] focus:outline-none transition-all rounded-none"
                          style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                          onFocus={(e) => e.target.style.borderColor = tokens.primary}
                          onBlur={(e) => e.target.style.borderColor = tokens.outlineVariant}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] block" style={{ color: tokens.onSurface }}>
                          Currency
                        </label>
                        <div className="relative group">
                          <select
                            value={priceCurrency}
                            onChange={(e) => setPriceCurrency(e.target.value)}
                            className="w-full h-[48px] pl-4 pr-10 bg-transparent border text-[11px] font-bold tracking-[0.1em] focus:outline-none transition-all appearance-none cursor-pointer rounded-none"
                            style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                            onFocus={(e) => e.target.style.borderColor = tokens.primary}
                            onBlur={(e) => e.target.style.borderColor = tokens.outlineVariant}
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none transition-colors" style={{ color: tokens.muted }}>
                            <ChevronDown size={14} strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] block" style={{ color: tokens.onSurface }}>
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="w-full h-[48px] px-4 bg-transparent border text-[12px] focus:outline-none transition-all rounded-none"
                          style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                          onFocus={(e) => e.target.style.borderColor = tokens.primary}
                          onBlur={(e) => e.target.style.borderColor = tokens.outlineVariant}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Attributes */}
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] block" style={{ color: tokens.onSurface }}>
                          Attributes
                        </label>
                        <button
                          type="button"
                          onClick={handleAddAttribute}
                          className="text-[9px] font-bold tracking-[0.2em] uppercase flex items-center gap-1 transition-colors hover:opacity-60"
                          style={{ color: tokens.primary }}
                        >
                          <Plus size={12} strokeWidth={2.5} /> Add
                        </button>
                      </div>

                      {attributes.length === 0 ? (
                        <div className="p-6 border border-dashed flex items-center justify-center text-[10px] uppercase tracking-[0.15em] font-medium rounded-none" style={{ borderColor: tokens.outlineVariant, color: tokens.muted }}>
                          No attributes added
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {attributes.map((attr, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 p-4 border rounded-none"
                              style={{ backgroundColor: tokens.surfaceHigh, borderColor: tokens.outlineVariant }}
                            >
                              <input
                                type="text"
                                placeholder="Key (e.g. Size)"
                                value={attr.key}
                                onChange={(e) =>
                                  handleAttributeChange(idx, "key", e.target.value)
                                }
                                className="w-1/2 bg-transparent border-b px-2 py-2 text-[12px] focus:outline-none transition-all"
                                style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                                onFocus={(e) => e.target.style.borderColor = tokens.primary}
                                onBlur={(e) => e.target.style.borderColor = tokens.outlineVariant}
                                required
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g. Medium)"
                                value={attr.value}
                                onChange={(e) =>
                                  handleAttributeChange(idx, "value", e.target.value)
                                }
                                className="w-1/2 bg-transparent border-b px-2 py-2 text-[12px] focus:outline-none transition-all"
                                style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                                onFocus={(e) => e.target.style.borderColor = tokens.primary}
                                onBlur={(e) => e.target.style.borderColor = tokens.outlineVariant}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveAttribute(idx)}
                                className="p-2 hover:opacity-60 transition-opacity"
                                style={{ color: tokens.onSurfaceVariant }}
                              >
                                <Trash2 size={16} strokeWidth={1.5} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Image Upload & Submit */}
                  <div className="w-full lg:w-[420px] shrink-0 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] block" style={{ color: tokens.onSurface }}>
                        Variant Images
                      </label>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: tokens.muted }}>
                        {images.length} / 7
                      </span>
                    </div>

                    <div
                      {...getRootProps()}
                      className="relative overflow-hidden border border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[180px] mb-6 rounded-none group"
                      style={{ 
                        borderColor: isDragActive ? tokens.primary : tokens.outlineVariant,
                        backgroundColor: isDragActive ? tokens.surfaceHigh : 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = tokens.primary}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = isDragActive ? tokens.primary : tokens.outlineVariant}
                    >
                      <input {...getInputProps()} />
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: tokens.surfaceHigh }}
                      >
                        <CloudUpload size={20} strokeWidth={1.5} style={{ color: tokens.onSurface }} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: tokens.onSurface }}>
                        Drag & Drop
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.1em]" style={{ color: tokens.muted }}>
                        PNG, JPG, WEBP
                      </p>
                    </div>

                    {images.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-8">
                        {images.map((img, i) => (
                          <motion.div
                            key={img.preview}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group overflow-hidden w-16 h-20 border shrink-0 rounded-none"
                            style={{ borderColor: tokens.outlineVariant, backgroundColor: tokens.surfaceHighest }}
                          >
                            <img
                              src={img.preview}
                              alt={`Preview ${i}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => removeImage(e, i)}
                                className="w-6 h-6 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full text-black hover:bg-white hover:text-red-500 transition-all duration-300"
                              >
                                <X size={12} strokeWidth={2} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-6 border-t" style={{ borderColor: tokens.outlineVariant }}>
                      <button
                        type="submit"
                        className="w-full h-[54px] flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 group"
                        style={{ backgroundColor: tokens.onSurface, color: tokens.surfaceLowest }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = tokens.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = tokens.onSurface;
                        }}
                      >
                        Save Configuration
                        <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Variant Confirmation Modal */}
      {deleteVariantModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setDeleteVariantModalOpen(false)}>
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
              Delete Variant
            </h3>
            <p 
              className="text-xs mb-8 leading-relaxed" 
              style={{ color: tokens.onSurfaceVariant }}
            >
              Are you sure you want to permanently remove this variant from this piece? This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="w-full py-3.5 text-[10px] uppercase tracking-[0.2em] font-bold border transition-colors flex items-center justify-center"
                style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = tokens.primary; e.currentTarget.style.color = tokens.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.outlineVariant; e.currentTarget.style.color = tokens.onSurface; }}
                onClick={() => {
                  setDeleteVariantModalOpen(false);
                  setVariantToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="w-full py-3.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors flex items-center justify-center text-white"
                style={{ backgroundColor: "#ef4444" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#dc2626"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ef4444"; }}
                onClick={async () => {
                  await handleDeleteVariant(product._id, variantToDelete);
                  await handleGetProductDetails(id);
                  setDeleteVariantModalOpen(false);
                  setVariantToDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SellerProductDetails;
