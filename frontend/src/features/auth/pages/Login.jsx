import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

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
    <div 
      className="antialiased min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row relative selection:bg-[#C9A96E]/30 selection:text-white"
      style={{ backgroundColor: tokens.surface, color: tokens.onSurface, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Desktop Background Curve Image */}
      <div 
        className="hidden lg:block absolute top-[-15vh] left-[-20vw] w-[70vw] h-[130vh] rounded-[50%] overflow-hidden z-0"
        style={{ boxShadow: `inset 0 0 80px ${tokens.surface}` }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-[80%_25%]"
          style={{ backgroundImage: "url('/luxury_editorial_bg.png')" }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Soft edge masking and blending */}
        <div className="absolute inset-0 mix-blend-overlay" style={{ boxShadow: `inset 0 0 120px ${tokens.surface}` }}></div>
        <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 80px ${tokens.surface}` }}></div>

        {/* Subtle metallic gold outline */}
        <div className="absolute inset-0 rounded-[50%] border-[1.5px] pointer-events-none opacity-40" style={{ borderColor: tokens.primary }}></div>
      </div>

      {/* Decorative Golden Lines Desktop */}
      <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
        <path
          d="M-10vw,20vh Q 35vw,50vh 25vw,120vh"
          fill="none"
          stroke={tokens.primary}
          strokeWidth="1"
        />
        <path
          d="M-5vw,10vh Q 45vw,60vh 30vw,110vh"
          fill="none"
          stroke={tokens.primary}
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
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 40px ${tokens.surface}` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent pointer-events-none" style={{ backgroundImage: `linear-gradient(to top, ${tokens.surface}, transparent)` }}></div>
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
          <div className="text-[32px] font-bold tracking-[0.4em] uppercase" style={{ color: tokens.primary }}>
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
          <div className="text-[32px] font-bold tracking-[0.3em] uppercase" style={{ color: tokens.primary }}>
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
            className="text-[40px] lg:text-[54px] font-semibold leading-[1.05] tracking-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
          >
            Welcome <span style={{ color: tokens.primary }}>Back.</span>
          </h1>
          <p className="text-[15px] lg:text-[17px] mb-8 font-medium leading-relaxed" style={{ color: tokens.onSurfaceVariant }}>
            Log in to your Snitch account and continue your journey.
          </p>
          <Link
            className="group inline-flex items-center text-[14px] font-bold tracking-[0.1em] uppercase relative pb-1"
            style={{ color: tokens.primary }}
            to="/"
          >
            <span>Explore Collection</span>
            <ArrowRight
              size={18}
              strokeWidth={2.5}
              className="ml-3 group-hover:translate-x-2 transition-transform duration-500 ease-out"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-500 ease-out" style={{ backgroundColor: tokens.primary }}></div>
          </Link>
        </motion.div>
      </div>

      {/* Right Side: Login Form (Desktop 42%) */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-4 md:p-8 lg:p-12 z-20 relative lg:bg-transparent" style={{ backgroundColor: 'transparent' }}>
        <motion.div
          className="w-full max-w-[440px] rounded-[24px] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border"
          style={{ backgroundColor: tokens.surfaceLowest, borderColor: tokens.outlineVariant }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="mb-6 text-center lg:text-left">
            <h2 
              className="text-[28px] font-semibold mb-1 tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
            >
              Sign In
            </h2>
            <p className="text-[14px] font-medium" style={{ color: tokens.muted }}>
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
                  className="text-[#ba1a1a] text-[13px] px-4 py-2.5 rounded-[10px] mb-3 font-medium overflow-hidden"
                  style={{ backgroundColor: "#ffdad6" }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: tokens.muted }}>
                <Mail size={18} strokeWidth={2} />
              </span>
              <input
                className="w-full h-[50px] pl-11 pr-4 border rounded-[12px] text-[14px] font-medium focus:outline-none focus:ring-1 transition-all duration-300"
                style={{ backgroundColor: tokens.surfaceLowest, borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                onFocus={(e) => { e.target.style.borderColor = tokens.primary; e.target.style.boxShadow = `0 0 0 1px ${tokens.primary}`; e.target.previousElementSibling.style.color = tokens.primary; }}
                onBlur={(e) => { e.target.style.borderColor = tokens.outlineVariant; e.target.style.boxShadow = 'none'; e.target.previousElementSibling.style.color = tokens.muted; }}
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: tokens.muted }}>
                <Lock size={18} strokeWidth={2} />
              </span>
              <input
                className="w-full h-[50px] pl-11 pr-11 border rounded-[12px] text-[14px] font-medium focus:outline-none focus:ring-1 transition-all duration-300"
                style={{ backgroundColor: tokens.surfaceLowest, borderColor: tokens.outlineVariant, color: tokens.onSurface }}
                onFocus={(e) => { e.target.style.borderColor = tokens.primary; e.target.style.boxShadow = `0 0 0 1px ${tokens.primary}`; e.target.previousElementSibling.style.color = tokens.primary; }}
                onBlur={(e) => { e.target.style.borderColor = tokens.outlineVariant; e.target.style.boxShadow = 'none'; e.target.previousElementSibling.style.color = tokens.muted; }}
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
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 hover:opacity-70"
                style={{ color: tokens.muted }}
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
                className="text-[12px] font-semibold transition-colors"
                style={{ color: tokens.primary }}
                onMouseEnter={(e) => e.target.style.color = tokens.primaryDark}
                onMouseLeave={(e) => e.target.style.color = tokens.primary}
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
              className="w-full h-[50px] mt-2 text-[14px] font-bold rounded-[12px] transition-all flex items-center justify-center tracking-wide"
              style={{ backgroundColor: tokens.primary, color: tokens.surfaceLowest }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tokens.primary}
              type="submit"
            >
              LOGIN
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5 opacity-70">
            <div className="flex-grow border-t" style={{ borderColor: tokens.outlineVariant }}></div>
            <span className="px-3 text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: tokens.muted }}>
              OR
            </span>
            <div className="flex-grow border-t" style={{ borderColor: tokens.outlineVariant }}></div>
          </div>

          {/* Social Button */}
          <motion.a
            href="/api/auth/google"
            whileHover={{
              y: -1,
              backgroundColor: tokens.surfaceHigh,
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[50px] border rounded-[12px] transition-all flex items-center justify-center text-[13px] font-bold space-x-3 cursor-pointer"
            style={{ backgroundColor: tokens.surfaceLowest, borderColor: tokens.outlineVariant, color: tokens.onSurface }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = tokens.primary}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = tokens.outlineVariant}
          >
            <ContinueWithGoogle />
          </motion.a>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-[14px] font-medium" style={{ color: tokens.muted }}>
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="font-bold relative group inline-block"
                style={{ color: tokens.primary }}
                onMouseEnter={(e) => e.target.style.color = tokens.primaryDark}
                onMouseLeave={(e) => e.target.style.color = tokens.primary}
              >
                Register
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-300" style={{ backgroundColor: tokens.primary }}></span>
              </NavLink>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
