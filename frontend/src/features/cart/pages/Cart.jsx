import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart.js";
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    handleGetCart,
    handleIncrementItemQuantity,
    handleDecrementItemQuantity,
    handleDeleteItemInCart,
  } = useCart();
  
  const items = useSelector((state) => state.cart?.items || []);

  const fetchCart = async () => {
    const cart = await handleGetCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = items.reduce((acc, item) => {
    const price = item.price?.discounted || item.price?.original || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap font-body-md bg-surface text-on-surface">
      <header className="mb-stack-lg border-b border-outline-variant pb-stack-sm flex justify-between items-end">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Shopping Bag</h1>
        <span className="font-label-md text-label-md text-on-surface-variant">{items.length} ITEMS</span>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-section-gap">
          <h2 className="text-headline-md text-primary mb-stack-md">Your bag is empty</h2>
          <Link to="/" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary uppercase tracking-widest border-b border-transparent hover:border-primary transition-colors pb-1">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-gutter lg:gap-section-gap">
          {/* Cart Items List */}
          <div className="flex-grow space-y-stack-lg">
            {items.map((item, index) => {
              const productId = item.product?._id || item.product;
              const price = item.price?.discounted || item.price?.original || item.product?.price || 0;
              
              return (
                <div key={`${productId}-${item.variant || index}`} className="flex gap-gutter group border-b border-surface-variant pb-stack-md">
                  {/* Product Image */}
                  <div className="w-32 md:w-48 aspect-[4/5] bg-surface-container flex-shrink-0 relative overflow-hidden">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                      alt={item.product?.name || "Product image"} 
                      src={item.product?.images?.[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuDdNYPXFfsGdCJUpdtLH0ozlYjhYG0ESEKeKjABK7cPW994oKk1Gq3QIwHl5R8DREBwhSHrLgaOi9SoWpgQW0v1hICYMNW4ky9ty07Ju78uih8GmrFXiqDpJVfy5I7K41D1YiZIbMMAquaJ81LuCT1-079AZha34k3eP0hClUt5pKIex9kXPMDv4YQWArHVBrCH6FP0ZItgj_AyKLoP8FlAjeyGuQBcUHiBtLUyumvUsErpKGk-d2bgD_kFd8zjSylH8F9UWFYNs2Bx"}
                    />
                  </div>
                  {/* Product Details */}
                  <div className="flex flex-col justify-between flex-grow py-stack-sm">
                    <div className="flex justify-between items-start gap-stack-md">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-primary mb-stack-sm">{item.product?.name || "Product Name"}</h3>
                        {item.variantName && <p className="font-body-md text-body-md text-on-surface-variant mb-1">Variant: {item.variantName}</p>}
                      </div>
                      <span className="font-body-lg text-body-lg text-primary">${price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-outline-variant rounded-sm h-10 w-24">
                        <button 
                          onClick={() => handleDecrementItemQuantity({ productId, variantId: item.variant })}
                          aria-label="Decrease quantity" 
                          className="w-8 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <input 
                          aria-label="Quantity" 
                          className="w-full text-center font-body-md bg-transparent border-none focus:ring-0 p-0" 
                          min="1" 
                          type="number" 
                          value={item.quantity} 
                          readOnly
                        />
                        <button 
                          onClick={() => handleIncrementItemQuantity({ productId, variantId: item.variant })}
                          aria-label="Increase quantity" 
                          className="w-8 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => handleDeleteItemInCart({ productId, variantId: item.variant })}
                        className="font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors uppercase tracking-widest border-b border-transparent hover:border-error pb-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Section */}
          <aside className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-surface-container-low p-stack-lg rounded-none">
              <h2 className="font-headline-md text-headline-md text-primary mb-stack-lg border-b border-outline-variant pb-stack-sm">Order Summary</h2>
              <div className="space-y-stack-md mb-stack-lg font-body-md text-body-md">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="text-primary">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Estimated Shipping</span>
                  <span className="text-primary">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Estimated Tax</span>
                  <span className="text-primary">Calculated at checkout</span>
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-outline-variant pt-stack-md mb-stack-lg">
                <span className="font-headline-md text-headline-md text-primary">Total</span>
                <span className="font-headline-md text-headline-md text-primary">${subtotal.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="w-full bg-primary text-on-primary py-stack-md px-stack-lg font-label-md text-label-md uppercase tracking-widest hover:bg-secondary hover:text-on-secondary transition-colors duration-300 flex items-center justify-center gap-2 group">
                Proceed to Checkout
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <div className="mt-stack-md text-center">
                <Link to="/" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary uppercase tracking-widest border-b border-transparent hover:border-primary transition-colors pb-1">
                  Continue Shopping
                </Link>
              </div>
            </div>
            {/* Trust Badges */}
            <div className="mt-stack-lg flex justify-center gap-stack-lg text-on-surface-variant opacity-70">
              <span className="material-symbols-outlined text-[24px]" title="Secure Checkout">lock</span>
              <span className="material-symbols-outlined text-[24px]" title="Free Shipping on orders over $500">local_shipping</span>
              <span className="material-symbols-outlined text-[24px]" title="Easy Returns">autorenew</span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Cart;
