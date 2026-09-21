import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    setCurrentPage
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d121f] border-l border-gold-500/30 text-slate-100 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              <h2 className="text-xl font-serif font-bold">Saved Wishlist ({wishlist.length})</h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-slate-300 font-serif font-semibold text-lg">Your Wishlist is empty</h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Click the heart icon on any jewelry item to save it for later.
                </p>
                <button
                  onClick={() => { setIsWishlistOpen(false); setCurrentPage('shop'); }}
                  className="btn-gold-shimmer text-xs px-6 py-2.5 rounded-xl font-semibold inline-block"
                >
                  Explore Jewels Catalog
                </button>
              </div>
            ) : (
              (wishlist || []).map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg bg-slate-950 border border-slate-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-white text-xs font-semibold line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-gold-400">{item.karat}</span>
                      <p className="text-white font-bold text-sm mt-1">₹{item.price.toLocaleString()}</p>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(item);
                        toggleWishlist(item);
                      }}
                      className="mt-2 bg-gold-500/20 hover:bg-gold-500 hover:text-black text-gold-300 border border-gold-500/30 text-xs py-1.5 px-3 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
