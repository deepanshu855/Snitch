import React, { useState, useCallback } from "react";
import { Tag, FileText, ChevronDown, ArrowLeft, ArrowRight, CloudUpload, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";

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

function CreateProduct() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceAmount, setPriceAmount] = useState('');
  const [priceCurrency, setPriceCurrency] = useState('INR');
  const navigate = useNavigate();
  const { handleCreateProduct } = useProducts();

  const onDrop = useCallback(acceptedFiles => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 2));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 2
  });

  const removeImage = (e, idx) => {
    e.stopPropagation();
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < 2; i++) {
      if (i < images.length) {
        slots.push(
          <motion.div
            key={images[i].preview}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative group overflow-hidden aspect-square border bg-white rounded-sm"
            style={{ borderColor: tokens.outlineVariant }}
          >
            <img
              src={images[i].preview}
              alt={`Preview ${i}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => removeImage(e, i)}
                className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full text-black hover:bg-white hover:text-red-500 transition-all duration-300"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        );
      } else {
        slots.push(
          <div 
            key={`empty-${i}`} 
            className="aspect-square border border-dashed flex items-center justify-center rounded-sm"
            style={{ borderColor: tokens.outlineVariant, backgroundColor: tokens.surfaceLow, color: tokens.muted }}
          >
            <Plus size={14} strokeWidth={1.5} />
          </div>
        );
      }
    }
    return slots;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('priceAmount', priceAmount);
    data.append('priceCurrency', priceCurrency);
    images.forEach(img => {
      data.append('images', img.file);
    });

    const res = await handleCreateProduct(data);
    if (res) {
      navigate("/seller/dashboard");
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col selection:bg-[#C9A96E]/30 pb-20"
      style={{ backgroundColor: tokens.surface, color: tokens.onSurface, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto w-full px-6 lg:px-16 pt-12 lg:pt-20">
        
        {/* Header */}
        <div className="mb-12">
          <h1 
            className="font-light leading-[1.05] mb-2" 
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
          >
            Create Piece
          </h1>
          <p 
            className="text-[10px] uppercase tracking-[0.24em] font-medium"
            style={{ color: tokens.muted }}
          >
            Add a new item to your archive
          </p>
          <div className="w-12 h-[1px] mt-6 opacity-50" style={{ backgroundColor: tokens.primary }}></div>
        </div>

        {/* Content Layout - Two Cards */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">

          {/* Left Card - Form Details */}
          <div className="flex-1 p-8 lg:p-10 shadow-sm" style={{ backgroundColor: tokens.surfaceLowest }}>
            <form id="create-product-form" className="space-y-8" onSubmit={submitHandler}>
              
              {/* Title */}
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] font-bold block" style={{ color: tokens.onSurface }}>
                  Title
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: tokens.muted }}>
                    <Tag size={16} strokeWidth={1.5} />
                  </span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter piece title"
                    className="w-full h-[48px] pl-12 pr-4 bg-transparent border text-[12px] focus:outline-none transition-all duration-300 rounded-none"
                    style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                    onFocus={(e) => {
                      e.target.style.borderColor = tokens.primary;
                      e.target.previousSibling.style.color = tokens.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = tokens.outlineVariant;
                      e.target.previousSibling.style.color = tokens.muted;
                    }}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] font-bold block" style={{ color: tokens.onSurface }}>
                  Description
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-4 transition-colors duration-300" style={{ color: tokens.muted }}>
                    <FileText size={16} strokeWidth={1.5} />
                  </span>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the piece..."
                    className="w-full p-4 pl-12 bg-transparent border text-[12px] focus:outline-none transition-all duration-300 resize-none rounded-none"
                    style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                    onFocus={(e) => {
                      e.target.style.borderColor = tokens.primary;
                      e.target.previousSibling.style.color = tokens.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = tokens.outlineVariant;
                      e.target.previousSibling.style.color = tokens.muted;
                    }}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Price & Currency */}
              <div className="flex gap-6">
                <div className="space-y-3 flex-1">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-bold block" style={{ color: tokens.onSurface }}>
                    Price
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 font-medium text-[14px]" style={{ color: tokens.muted }}>
                      ₹
                    </span>
                    <input
                      type="number"
                      value={priceAmount}
                      onChange={(e) => setPriceAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-[48px] pl-10 pr-4 bg-transparent border text-[12px] focus:outline-none transition-all duration-300 rounded-none"
                      style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                      onFocus={(e) => {
                        e.target.style.borderColor = tokens.primary;
                        e.target.previousSibling.style.color = tokens.primary;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = tokens.outlineVariant;
                        e.target.previousSibling.style.color = tokens.muted;
                      }}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3 flex-[0.7]">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-bold block" style={{ color: tokens.onSurface }}>
                    Currency
                  </label>
                  <div className="relative group">
                    <select
                      value={priceCurrency}
                      onChange={(e) => setPriceCurrency(e.target.value)}
                      className="w-full h-[48px] pl-4 pr-10 bg-transparent border text-[11px] font-bold tracking-[0.1em] focus:outline-none transition-all duration-300 appearance-none cursor-pointer rounded-none"
                      style={{ borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                      onFocus={(e) => e.target.style.borderColor = tokens.primary}
                      onBlur={(e) => e.target.style.borderColor = tokens.outlineVariant}
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-colors duration-300" style={{ color: tokens.muted }}>
                      <ChevronDown size={14} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Card - Image Upload */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col shadow-sm" style={{ backgroundColor: tokens.surfaceLowest }}>
            <div className="flex flex-col mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[9px] uppercase tracking-[0.2em] font-bold block" style={{ color: tokens.onSurface }}>
                  Images
                </label>
                <span className="text-[9px] uppercase tracking-[0.1em]" style={{ color: tokens.muted }}>
                  Max 2
                </span>
              </div>
              <span className="text-[10px]" style={{ color: tokens.muted }}>
                These details will be displayed as thumbnail.
              </span>
            </div>

            {/* Drag and Drop Zone */}
            <div
              {...getRootProps()}
              className="flex-1 relative overflow-hidden border border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[280px] group rounded-none"
              style={{ 
                borderColor: isDragActive ? tokens.primary : tokens.outlineVariant,
                backgroundColor: isDragActive ? tokens.surfaceHigh : 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = tokens.primary}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = isDragActive ? tokens.primary : tokens.outlineVariant}
            >
              <input {...getInputProps()} />
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                style={{ backgroundColor: tokens.surfaceHigh }}
              >
                <CloudUpload size={24} strokeWidth={1.5} style={{ color: tokens.onSurface }} />
              </div>
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold mb-2" style={{ color: tokens.onSurface }}>
                Drag & Drop Images
              </p>
              <p className="text-[10px] uppercase tracking-[0.1em] mb-4" style={{ color: tokens.muted }}>
                or click to browse
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em]" style={{ color: tokens.secondary }}>
                PNG, JPG, WEBP (Max 5MB)
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-[1px]" style={{ backgroundColor: tokens.outlineVariant }}></div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: tokens.muted }}>
                {images.length} / 2
              </span>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: tokens.outlineVariant }}></div>
            </div>

            {/* 2 Thumbnails (sized to 7-col grid) */}
            <div className="grid grid-cols-7 gap-3">
              {renderSlots()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t" style={{ borderColor: tokens.surfaceHighest }}>
          <button
            type="submit"
            form="create-product-form"
            className="w-full md:w-auto px-12 py-4 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 group"
            style={{ backgroundColor: tokens.onSurface, color: tokens.surfaceLowest }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = tokens.onSurface;
            }}
          >
            Publish Piece
            <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;