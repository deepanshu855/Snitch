import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, User, Menu, X, LayoutDashboard, PlusSquare, LogOut } from 'lucide-react';
import { setUser } from '../../auth/auth.slice';

const tokens = {
  surface: "#fbf9f5",
  onSurface: "#1b1c1a",
  logo: "#C9A96E",
  primaryDark: "#745a27",
  primary: "#060607",
  muted: "#747878",
  border: "#e4e2de",
};

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setUser(null));
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300" style={{ backgroundColor: tokens.surface, borderBottom: `1px solid ${tokens.border}` }}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "'Playfair Display', serif", color: tokens.logo }}>
          Snitch.
        </Link>

        {/* Right side icons Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {/* Seller Links */}
          {user?.role === "seller" && (
            <div className="flex items-center gap-4 mr-4 border-r pr-4" style={{ borderColor: tokens.border }}>
              <Link to="/dashboard" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-opacity hover:opacity-70" style={{ color: tokens.onSurface }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link to="/create-product" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-opacity hover:opacity-70" style={{ color: tokens.onSurface }}>
                <PlusSquare size={14} /> Create Product
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
                  className="bg-transparent outline-none text-sm border-b pb-1 px-2 w-48 transition-all"
                  style={{ borderBottomColor: tokens.onSurface, color: tokens.onSurface, fontFamily: "'Inter', sans-serif" }}
                />
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="transition-opacity hover:opacity-70" style={{ color: tokens.onSurface }}>
                <Search size={20} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="transition-opacity hover:opacity-70 relative" style={{ color: tokens.onSurface }}>
            <ShoppingCart size={20} strokeWidth={1.5} />
          </Link>

          {/* Auth / Avatar */}
          {user ? (
            <div className="relative group">
              <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer uppercase text-[10px] tracking-widest font-semibold" style={{ backgroundColor: tokens.primary, color: "#fff", fontFamily: "'Inter', sans-serif" }}>
                {user.fullName ? user.fullName.charAt(0) : <User size={14} />}
              </div>
              
              {/* Dropdown Menu on Hover */}
              <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-40">
                <div className="rounded-sm shadow-sm py-2" style={{ backgroundColor: tokens.surface, border: `1px solid ${tokens.border}` }}>
                  <button onClick={handleLogout} className="w-full px-4 py-3 text-left flex items-center gap-3 text-[11px] uppercase tracking-wider transition-colors hover:bg-black/5" style={{ color: tokens.onSurface, fontFamily: "'Inter', sans-serif" }}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-[11px] uppercase tracking-[0.15em] font-medium transition-opacity hover:opacity-70" style={{ color: tokens.onSurface, fontFamily: "'Inter', sans-serif" }}>
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-5 md:hidden">
          <Link to="/cart" className="transition-opacity hover:opacity-70" style={{ color: tokens.onSurface }}>
            <ShoppingCart size={20} strokeWidth={1.5} />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="transition-opacity hover:opacity-70" style={{ color: tokens.onSurface }}>
            {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`} 
        style={{ backgroundColor: tokens.surface, borderBottom: isMobileMenuOpen ? `1px solid ${tokens.border}` : 'none' }}
      >
        <div className="px-5 py-6 flex flex-col gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          <form onSubmit={handleSearch} className="flex items-center border-b pb-2" style={{ borderColor: tokens.border }}>
            <Search size={18} strokeWidth={1.5} className="mr-3" style={{ color: tokens.muted }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full"
              style={{ color: tokens.onSurface }}
            />
          </form>

          {user?.role === "seller" && (
            <div className="flex flex-col gap-4 border-b pb-6" style={{ borderColor: tokens.border }}>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.15em] font-medium flex items-center gap-3" style={{ color: tokens.onSurface }}>
                <LayoutDashboard size={16} /> Seller Dashboard
              </Link>
              <Link to="/create-product" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.15em] font-medium flex items-center gap-3" style={{ color: tokens.onSurface }}>
                <PlusSquare size={16} /> Create Product
              </Link>
            </div>
          )}

          {user ? (
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-[11px] uppercase tracking-[0.15em] font-medium flex items-center gap-3 pt-2" style={{ color: tokens.onSurface }}>
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] uppercase tracking-[0.15em] font-medium pt-2" style={{ color: tokens.onSurface }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;