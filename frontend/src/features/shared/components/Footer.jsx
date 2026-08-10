import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

const Footer = () => {
  return (
    <footer 
      className="w-full pt-16 pb-8 px-8 lg:px-16 xl:px-24"
      style={{ backgroundColor: tokens.onSurface, color: tokens.surface, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* Brand & Newsletter */}
          <div className="flex flex-col gap-8 w-full md:w-1/3">
            <Link 
              to="/" 
              className="text-[32px] font-light tracking-[0.2em] uppercase" 
              style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.surface }}
            >
              SNITCH
            </Link>
            
            <div className="w-full">
              <label className="text-[9px] font-bold uppercase tracking-[0.15em] mb-3 block" style={{ color: tokens.muted }}>
                Subscribe to our newsletter
              </label>
              <div className="flex border-b pb-2 group transition-colors duration-300" style={{ borderColor: tokens.secondary }}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent border-none outline-none flex-1 text-[11px] placeholder:text-white/30 focus:ring-0"
                  style={{ color: tokens.surface }}
                />
                <button className="transition-transform group-hover:translate-x-1" style={{ color: tokens.surface }}>
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-16 sm:gap-24">
            <div className="flex flex-col gap-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: tokens.primary }}>Shop</h4>
              <ul className="flex flex-col gap-3 text-[10px] tracking-[0.1em] uppercase font-bold" style={{ color: tokens.surface }}>
                <li><Link to="/" className="hover:text-[#C9A96E] transition-colors">New Arrivals</Link></li>
                <li><Link to="/" className="hover:text-[#C9A96E] transition-colors">Clothing</Link></li>
                <li><Link to="/" className="hover:text-[#C9A96E] transition-colors">Accessories</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: tokens.primary }}>Help</h4>
              <ul className="flex flex-col gap-3 text-[10px] tracking-[0.1em] uppercase font-bold" style={{ color: tokens.surface }}>
                <li><Link to="/" className="hover:text-[#C9A96E] transition-colors">Contact</Link></li>
                <li><Link to="/" className="hover:text-[#C9A96E] transition-colors">Shipping</Link></li>
                <li><Link to="/" className="hover:text-[#C9A96E] transition-colors">Returns</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t" style={{ borderColor: `${tokens.secondary}40` }}>
          <div className="text-[9px] font-medium uppercase tracking-[0.15em]" style={{ color: tokens.muted }}>
            © 2026 SNITCH. All rights reserved.
          </div>
          
          <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: tokens.surface }}>
            <a href="#" className="hover:text-[#C9A96E] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#C9A96E] transition-colors">Twitter</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;