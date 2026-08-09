import React, { useState, useCallback } from "react";
import { Tag, FileText, ChevronDown, ArrowLeft, ArrowRight, CloudUpload, Plus, X, CloudCog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js"

function CreateProduct() {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priceAmount, setPriceAmount] = useState('');
    const [priceCurrency, setPriceCurrency] = useState('INR');
    const navigate = useNavigate();

    const onDrop = useCallback(acceptedFiles => {
        const newImages = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages].slice(0, 7));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        maxFiles: 7
    });

    const removeImage = (e, idx) => {
        e.stopPropagation();
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    // Helper to render 7 slots
    const renderSlots = () => {
        const slots = [];
        for (let i = 0; i < 7; i++) {
            if (i < images.length) {
                slots.push(
                    <motion.div
                        key={images[i].preview}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group rounded-[8px] overflow-hidden aspect-square border border-[#ECE7DE] bg-white flex-1 min-w-0"
                    >
                        <img
                            src={images[i].preview}
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
                );
            } else {
                slots.push(
                    <div key={`empty-${i}`} className="rounded-[8px] aspect-square border border-dashed border-[#E5E0D8] bg-[#FAFAFA] flex items-center justify-center text-[#CCCCCC] flex-1 min-w-0">
                        <Plus size={16} />
                    </div>
                );
            }
        }
        return slots;
    };

    const { handleCreateProduct } = useProducts();

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
            navigate("/seller/dashboard")
        }
    }

    return (
        <div className="bg-[#F9F8F5] text-[#1F1F1F] font-sans min-h-screen flex flex-col selection:bg-[#D8B03B] selection:text-white pb-12">

            <div className="px-8 lg:px-16 py-4 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-[#D8B03B] hover:bg-[#F0EFEB] rounded-full transition-colors inline-block"
                >
                    <ArrowLeft size={24} strokeWidth={1.5} />
                </button>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 max-w-[1200px] w-full mx-auto px-8 lg:px-16">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[36px] font-semibold text-[#1F1F1F] tracking-tight mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                        Create Product
                    </h1>
                    <p className="text-[14px] text-[#777777] font-medium">
                        Add a new product to your store.
                    </p>
                    {/* Very thin gold accent line under the header like in the screenshot */}
                    <div className="w-10 h-[2px] bg-[#D8B03B] mt-4 opacity-50"></div>
                </div>

                {/* Content Layout - Two Cards */}
                <div className="flex flex-col lg:flex-row gap-6 mb-10">

                    {/* Left Card - Form Details */}
                    <div className="flex-1 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8">
                        <form id="create-product-form" className="space-y-6" onSubmit={submitHandler}>

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#1F1F1F] block">Product Title</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777777] group-focus-within:text-[#D8B03B] transition-colors duration-300">
                                        <Tag size={18} strokeWidth={1.5} />
                                    </span>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter product title"
                                        className="w-full h-[52px] pl-12 pr-4 bg-white border border-[#E5E0D8] rounded-[10px] text-[14px] text-[#1F1F1F] placeholder:text-[#999999] focus:outline-none focus:border-[#D8B03B] focus:ring-1 focus:ring-[#D8B03B]/20 transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#1F1F1F] block">Description</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-4 text-[#777777] group-focus-within:text-[#D8B03B] transition-colors duration-300">
                                        <FileText size={18} strokeWidth={1.5} />
                                    </span>
                                    <textarea
                                        rows={5}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your product in detail..."
                                        className="w-full p-4 pl-12 bg-white border border-[#E5E0D8] rounded-[10px] text-[14px] text-[#1F1F1F] placeholder:text-[#999999] focus:outline-none focus:border-[#D8B03B] focus:ring-1 focus:ring-[#D8B03B]/20 transition-all duration-300 resize-none"
                                        required
                                    ></textarea>
                                    {/* Decorative resizer dots icon placeholder at bottom right */}
                                    <div className="absolute bottom-3 right-3 text-[#CCCCCC] pointer-events-none">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                            <path d="M10 0L12 2L2 12L0 10L10 0Z" />
                                            <path d="M10 6L12 8L8 12L6 10L10 6Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Price & Currency */}
                            <div className="flex gap-4">
                                <div className="space-y-2 flex-1">
                                    <label className="text-[13px] font-bold text-[#1F1F1F] block">Price Amount</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777777] group-focus-within:text-[#D8B03B] transition-colors duration-300 font-medium text-[16px]">
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            value={priceAmount}
                                            onChange={(e) => setPriceAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full h-[52px] pl-12 pr-4 bg-white border border-[#E5E0D8] rounded-[10px] text-[14px] text-[#1F1F1F] placeholder:text-[#999999] focus:outline-none focus:border-[#D8B03B] focus:ring-1 focus:ring-[#D8B03B]/20 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="text-[13px] font-bold text-[#1F1F1F] block">Currency</label>
                                    <div className="relative group">
                                        <select
                                            value={priceCurrency}
                                            onChange={(e) => setPriceCurrency(e.target.value)}
                                            className="w-full h-[52px] pl-4 pr-10 bg-white border border-[#E5E0D8] rounded-[10px] text-[14px] font-bold text-[#1F1F1F] focus:outline-none focus:border-[#D8B03B] focus:ring-1 focus:ring-[#D8B03B]/20 transition-all duration-300 appearance-none cursor-pointer"
                                        >
                                            <option value="INR">INR</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#999999] group-focus-within:text-[#D8B03B] transition-colors duration-300">
                                            <ChevronDown size={18} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Card - Image Upload */}
                    <div className="flex-1 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-[14px] font-bold text-[#1F1F1F] block">Product Images</label>
                            <span className="text-[12px] text-[#999999] font-medium">Maximum 7 images</span>
                        </div>

                        {/* Drag and Drop Zone */}
                        <div
                            {...getRootProps()}
                            className={`
                        flex-1 relative overflow-hidden rounded-[16px] border-[1.5px] border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[240px]
                        ${isDragActive ? 'border-[#D8B03B] bg-[#FDFBF7] scale-[1.01]' : 'border-[#E5E0D8] hover:border-[#D8B03B]/50 bg-[#FAFAFA]'}
                    `}
                        >
                            <input {...getInputProps()} />
                            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                                <CloudUpload size={28} strokeWidth={1.5} className="text-[#D8B03B]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#1F1F1F] mb-1">
                                Drag & Drop Images
                            </p>
                            <p className="text-[13px] text-[#1F1F1F] mb-3">
                                or <span className="text-[#D8B03B] font-bold">Browse Files</span>
                            </p>
                            <p className="text-[11px] font-medium text-[#999999]">
                                PNG, JPG, WEBP up to 5MB each
                            </p>
                        </div>

                        {/* Progress / Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-[1px] bg-[#F0EFEB]"></div>
                            <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wide">
                                {images.length} / 7 images
                            </span>
                            <div className="flex-1 h-[1px] bg-[#F0EFEB]"></div>
                        </div>

                        {/* 7 Thumbnails Row */}
                        <div className="flex gap-2.5">
                            {renderSlots()}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <motion.button
                        type="submit"
                        form="create-product-form"
                        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(216,176,59,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full max-w-[440px] h-[54px] bg-[#D8B03B] text-white text-[15px] font-bold rounded-[8px] transition-all flex items-center justify-center gap-2 group"
                    >
                        Publish Product
                        <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default CreateProduct;