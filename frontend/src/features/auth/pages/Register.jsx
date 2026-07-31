import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth.js";
import { NavLink, useNavigate } from "react-router-dom";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister({ ...formData, isSeller });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#0a0a0a] text-white flex overflow-y-auto lg:overflow-hidden font-sans">
      {/* Left Side - Hero Section */}
      <motion.div
        className="hidden lg:flex w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-left"
          style={{ backgroundImage: "url('/luxury_fashion_hero.png')" }}
        />

        {/* Decorative Gold Circle Outline matching the design */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-[15%] w-[800px] h-[800px] rounded-full border-[1.5px] border-[#E2B961]/30 pointer-events-none z-0" />

        {/* Dark Gradients for text visibility and blending */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-[#0a0a0a]" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute inset-0 z-0 bg-black/20" />

        <div className="relative z-10">
          <motion.h1
            className="text-[#E2B961] text-3xl font-bold tracking-[0.4em]"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            S N I T C H
          </motion.h1>
        </div>

        <div className="relative z-10 pb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-[#E2B961] text-lg tracking-[0.1em] leading-relaxed font-light">
              STYLE IS A CHOICE.
              <br />
              MAKE YOURS.
            </p>
            <div className="h-[1px] w-12 bg-[#E2B961] mt-5" />
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 relative z-10 bg-[#0a0a0a]">
        <motion.div
          className="w-full max-w-[440px] bg-[#111111] border border-[#222] rounded-2xl p-8 lg:p-10 shadow-2xl relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-[#E2B961] text-2xl font-bold tracking-[0.3em]">
              S N I T C H
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-white">
              Create Account
            </h2>
            <p className="text-[#888] text-sm">
              Join Snitch and elevate your style.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666]">
                <User size={18} strokeWidth={1.5} />
              </div>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full bg-transparent text-white border border-[#333] rounded-lg py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#E2B961] transition-colors placeholder:text-[#555] text-sm"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666]">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full bg-transparent text-white border border-[#333] rounded-lg py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#E2B961] transition-colors placeholder:text-[#555] text-sm"
              />
            </div>

            {/* Contact Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666]">
                <Phone size={18} strokeWidth={1.5} />
              </div>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Contact Number"
                className="w-full bg-transparent text-white border border-[#333] rounded-lg py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#E2B961] transition-colors placeholder:text-[#555] text-sm"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666]">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full bg-transparent text-white border border-[#333] rounded-lg py-3.5 pl-12 pr-12 focus:outline-none focus:border-[#E2B961] transition-colors placeholder:text-[#555] text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#666] hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Seller Checkbox */}
            <div className="flex items-center space-x-3 pt-1 pb-2">
              <div
                onClick={() => setIsSeller(!isSeller)}
                className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors ${
                  isSeller
                    ? "bg-[#E2B961] border-[#E2B961]"
                    : "border-[#555] bg-transparent hover:border-[#777]"
                }`}
              >
                {isSeller && (
                  <svg
                    className="w-3.5 h-3.5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className="text-sm text-[#888] cursor-pointer select-none font-medium hover:text-white transition-colors"
                onClick={() => setIsSeller(!isSeller)}
              >
                Register as Seller
              </span>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-[#E2B961] text-black font-semibold rounded-lg py-3.5 shadow-md hover:bg-[#d6aa52] transition-colors text-sm tracking-wide mt-2"
            >
              REGISTER
            </motion.button>
          </form>

          <div className="my-7 flex items-center">
            <div className="flex-1 border-t border-[#222]"></div>
            <span className="px-4 text-[11px] text-[#555] uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 border-t border-[#222]"></div>
          </div>

          <motion.a
            href="/api/auth/google"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-transparent border border-[#333] text-white font-medium rounded-lg py-3.5 flex items-center justify-center space-x-3 hover:bg-[#1a1a1a] transition-colors text-sm"
          >
            <ContinueWithGoogle />
          </motion.a>

          <p className="text-center text-[#777] mt-8 text-sm">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-[#E2B961] font-medium hover:underline transition-all"
            >
              Login
            </NavLink>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
