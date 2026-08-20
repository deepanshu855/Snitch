import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, User, Menu, X, LayoutDashboard, PlusSquare, LogOut } from 'lucide-react';
import { setUser } from '../../auth/auth.slice';
import { useAuth } from '../../auth/hooks/useAuth';

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

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {handleLogout}=useAuth();

  const logoutSubmit=()=>{
    handleLogout();
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <nav 
        className="sticky top-0 z-50 w-full transition-all duration-300" 
        style={{ 
          backgroundColor: tokens.surface, 
          borderBottom: `1px solid ${tokens.surfaceHighest}`,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 h-24 flex items-center justify-between">
          {/* Left: Logo */}
          <Link 
            to="/" 
            className="text-3xl font-light tracking-[0.25em] uppercase" 
            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.primaryDark }}
          >
            SNITCH
          </Link>

          {/* Right side icons Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {/* Seller Links */}
            {user?.role === "seller" && (
              <div className="flex items-center gap-6 mr-4 border-r pr-8" style={{ borderColor: tokens.surfaceHighest }}>
                <Link to="/seller/dashboard" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-medium transition-opacity hover:opacity-60" style={{ color: tokens.onSurface }}>
                  <LayoutDashboard size={14} strokeWidth={1.5} /> Dashboard
                </Link>
                <Link to="/seller/create" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-medium transition-opacity hover:opacity-60" style={{ color: tokens.onSurface }}>
                  <PlusSquare size={14} strokeWidth={1.5} /> Create
                </Link>
              </div>
            )}

            {/* Search */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                    className="bg-transparent outline-none text-[11px] uppercase tracking-widest pb-1 px-2 w-48 transition-all"
                    style={{ 
                      borderBottom: `1px solid ${tokens.outlineVariant}`, 
                      color: tokens.onSurface, 
                    }}
                  />
                  <button type="submit" className="transition-opacity hover:opacity-60 ml-3" style={{ color: tokens.onSurface }} onMouseDown={(e) => e.preventDefault()}>
                    <Search size={18} strokeWidth={1.5} />
                  </button>
                </form>
              ) : (
                <button onClick={() => setIsSearchOpen(true)} className="transition-opacity hover:opacity-60" style={{ color: tokens.onSurface }}>
                  <Search size={18} strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* Cart */}
            {user?.role !== "seller" && (
              <Link to="/cart" className="transition-opacity hover:opacity-60 relative" style={{ color: tokens.onSurface }}>
                <ShoppingCart size={18} strokeWidth={1.5} />
              </Link>
            )}

            {/* Auth / Avatar */}
            {user ? (
              <div className="relative group">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer uppercase text-[10px] tracking-[0.2em] font-medium transition-colors" 
                  style={{ backgroundColor: tokens.surfaceHigh, color: tokens.onSurface }}
                >
                  {user.fullName ? user.fullName.charAt(0) : <User size={14} strokeWidth={1.5} />}
                </div>
                
                {/* Dropdown Menu on Hover */}
                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-48 z-50">
                  <div className="rounded-sm shadow-sm py-4" style={{ backgroundColor: tokens.surfaceLowest, border: `1px solid ${tokens.surfaceHighest}` }}>
                    <button 
                      onClick={logoutSubmit} 
                      className="w-full px-6 py-2 text-left flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] transition-colors" 
                      style={{ color: tokens.onSurface }}
                      onMouseEnter={(e) => e.currentTarget.style.color = tokens.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = tokens.onSurface}
                    >
                      <LogOut size={14} strokeWidth={1.5} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-[10px] uppercase tracking-[0.2em] font-medium transition-opacity hover:opacity-60" style={{ color: tokens.onSurface }}>
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-6 md:hidden">
            {user?.role !== "seller" && (
              <Link to="/cart" className="transition-opacity hover:opacity-60" style={{ color: tokens.onSurface }}>
                <ShoppingCart size={18} strokeWidth={1.5} />
              </Link>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="transition-opacity hover:opacity-60" style={{ color: tokens.onSurface }}>
              {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden absolute top-full left-0 w-full shadow-lg transition-all duration-500 ease-[0.25,0.46,0.45,0.94] overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`} 
          style={{ backgroundColor: tokens.surface, borderBottom: isMobileMenuOpen ? `1px solid ${tokens.surfaceHighest}` : 'none' }}
        >
          <div className="px-8 py-8 flex flex-col gap-8">
            <form onSubmit={handleSearch} className="flex items-center pb-3" style={{ borderBottom: `1px solid ${tokens.surfaceHighest}` }}>
              <button type="submit" className="transition-opacity hover:opacity-60 mr-4">
                <Search size={16} strokeWidth={1.5} style={{ color: tokens.muted }} />
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-[11px] uppercase tracking-[0.2em] w-full"
                style={{ color: tokens.onSurface }}
              />
            </form>

            {user?.role === "seller" && (
              <div className="flex flex-col gap-6 pb-6" style={{ borderBottom: `1px solid ${tokens.surfaceHighest}` }}>
                <Link to="/seller/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-4" style={{ color: tokens.onSurface }}>
                  <LayoutDashboard size={16} strokeWidth={1.5} /> Seller Dashboard
                </Link>
                <Link to="/seller/create" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-4" style={{ color: tokens.onSurface }}>
                  <PlusSquare size={16} strokeWidth={1.5} /> Create Product
                </Link>
              </div>
            )}

            {user ? (
              <button onClick={() => { logoutSubmit(); setIsMobileMenuOpen(false); }} className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-4" style={{ color: tokens.onSurface }}>
                <LogOut size={16} strokeWidth={1.5} /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: tokens.onSurface }}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;