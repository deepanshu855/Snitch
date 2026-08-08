import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth.js";
import { NavLink, useNavigate } from "react-router-dom";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await handleLogin(formData);
      if (user.role === "seller") navigate("/seller/dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="bg-[#F8F6F2] text-[#1F1F1F] font-sans antialiased min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row relative selection:bg-[#D4AF37] selection:text-white">
      {/* Desktop Background Curve Image */}
      <div className="hidden lg:block absolute top-[-15vh] left-[-20vw] w-[70vw] h-[130vh] rounded-[50%] overflow-hidden z-0 shadow-[inset_0_0_80px_#F8F6F2]">
        <motion.div
          className="absolute inset-0 bg-cover bg-[80%_25%]"
          style={{ backgroundImage: "url('/luxury_editorial_bg.png')" }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Soft edge masking and blending */}
        <div className="absolute inset-0 shadow-[inset_0_0_120px_#F8F6F2] mix-blend-overlay"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_80px_#F8F6F2]"></div>

        {/* Subtle metallic gold outline */}
        <div className="absolute inset-0 rounded-[50%] border-[1.5px] border-[#D4AF37]/40 pointer-events-none"></div>
      </div>

      {/* Decorative Golden Lines Desktop */}
      <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
        <path
          d="M-10vw,20vh Q 35vw,50vh 25vw,120vh"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
        />
        <path
          d="M-5vw,10vh Q 45vw,60vh 30vw,110vh"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.5"
        />
      </svg>

      {/* Mobile Stacked Image Header */}
      <div className="lg:hidden w-full h-[40vh] relative z-0 overflow-hidden rounded-b-[40px] shadow-sm">
        <motion.div
          className="absolute inset-0 bg-cover bg-[80%_25%]"
          style={{ backgroundImage: "url('/luxury_editorial_bg.png')" }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(248,246,242,0.8)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F2] via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Left Side: Editorial Typography (Desktop 58%) */}
      <div className="relative z-10 w-full lg:w-[58%] h-auto lg:h-full flex flex-col justify-between p-6 lg:p-16 pt-6 lg:pt-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-20 hidden lg:block"
        >
          <div className="text-[32px] font-bold text-[#D4AF37] tracking-[0.4em] uppercase">
            SNITCH
          </div>
        </motion.div>

        {/* Mobile Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 lg:hidden text-center mb-6 mt-4"
        >
          <div className="text-[32px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">
            SNITCH
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          className="relative z-20 mb-4 lg:mb-[20vh] max-w-[420px] mx-auto lg:mx-0 text-center lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <h1
            className="text-[40px] lg:text-[54px] font-semibold text-[#1F1F1F] leading-[1.05] tracking-tight mb-4"
            style={{ fontFamily: "Geist, Inter, sans-serif" }}
          >
            Welcome <span className="text-[#D4AF37]">Back.</span>
          </h1>
          <p className="text-[15px] lg:text-[17px] text-[#555555] mb-8 font-medium leading-relaxed">
            Log in to your Snitch account and continue your journey.
          </p>
          <a
            className="group inline-flex items-center text-[14px] font-bold tracking-[0.1em] text-[#D4AF37] uppercase relative pb-1"
            href="#"
          >
            <span>Explore Collection</span>
            <ArrowRight
              size={18}
              strokeWidth={2.5}
              className="ml-3 group-hover:translate-x-2 transition-transform duration-500 ease-out"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF37] group-hover:w-full transition-all duration-500 ease-out"></div>
          </a>
        </motion.div>
      </div>

      {/* Right Side: Login Form (Desktop 42%) */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-4 md:p-8 lg:p-12 z-20 relative bg-[#F8F6F2] lg:bg-transparent">
        <motion.div
          className="w-full max-w-[440px] bg-[#FFFFFF] rounded-[24px] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-[#ECE7DE]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-[28px] font-semibold text-[#1F1F1F] mb-1 tracking-tight">
              Sign In
            </h2>
            <p className="text-[14px] text-[#777777] font-medium">
              Access your style portfolio.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[#ba1a1a] text-[13px] bg-[#ffdad6] px-4 py-2.5 rounded-[10px] mb-3 font-medium overflow-hidden"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999] group-focus-within:text-[#D4AF37] transition-colors duration-300">
                <Mail size={18} strokeWidth={2} />
              </span>
              <input
                className="w-full h-[50px] pl-11 pr-4 bg-[#FFFFFF] border border-[#ECE7DE] rounded-[12px] text-[14px] text-[#1F1F1F] placeholder:text-[#999999] font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                placeholder="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999] group-focus-within:text-[#D4AF37] transition-colors duration-300">
                <Lock size={18} strokeWidth={2} />
              </span>
              <input
                className="w-full h-[50px] pl-11 pr-11 bg-[#FFFFFF] border border-[#ECE7DE] rounded-[12px] text-[14px] text-[#1F1F1F] placeholder:text-[#999999] font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#D4AF37] transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <a
                href="#"
                className="text-[12px] text-[#D4AF37] font-semibold hover:text-[#B88A18] transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{
                y: -1,
                boxShadow: "0 6px 20px rgba(212,175,55,0.25)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-[50px] mt-2 bg-[#D4AF37] hover:bg-[#B88A18] text-[#1F1F1F] text-[14px] font-bold rounded-[12px] transition-all flex items-center justify-center tracking-wide"
              type="submit"
            >
              LOGIN
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5 opacity-70">
            <div className="flex-grow border-t border-[#ECE7DE]"></div>
            <span className="px-3 text-[10px] font-bold tracking-[0.15em] text-[#999999] uppercase">
              OR
            </span>
            <div className="flex-grow border-t border-[#ECE7DE]"></div>
          </div>

          {/* Social Button */}
          <motion.a
            href="/api/auth/google"
            whileHover={{
              y: -1,
              backgroundColor: "#FAFAFA",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[50px] bg-[#FFFFFF] border border-[#ECE7DE] rounded-[12px] transition-all flex items-center justify-center hover:border-[#D4AF37]/50 text-[#1F1F1F] text-[13px] font-bold space-x-3 cursor-pointer"
          >
            <ContinueWithGoogle />
          </motion.a>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-[14px] text-[#777777] font-medium">
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="text-[#D4AF37] font-bold hover:text-[#B88A18] transition-colors relative group inline-block"
              >
                Register
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
