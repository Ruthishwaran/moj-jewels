import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Truck, ChevronLeft, ChevronRight, Share2, Check, AlertCircle, Sparkles } from 'lucide-react';

export default function ProductModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [variantError, setVariantError] = useState('');

  const handleShareProduct = async (e) => {
    e?.stopPropagation();
    if (!selectedProduct) return;
    const prodId = selectedProduct.id || '';
    const shareUrl = `${window.location.origin}/?product=${encodeURIComponent(prodId)}`;
    const shareTitle = `${selectedProduct.title || 'Fine Jewelry'} — MOJ Jewels`;
    const sharePrice = typeof selectedProduct.price === 'number' ? selectedProduct.price : parseFloat(selectedProduct.price) || 0;
    const shareText = `Discover ${selectedProduct.title} (₹${sharePrice.toLocaleString()}) at MOJ Jewels — Luxury Fine Jewelry!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Reset active image index & variant selection on product change
  React.useEffect(() => {
    setActiveImgIndex(0);
    setVariantError('');
    if (Array.isArray(selectedProduct?.colors) && selectedProduct.colors.length === 1) {
      setSelectedColor(selectedProduct.colors[0]);
    } else {
      setSelectedColor('');
    }

    if (Array.isArray(selectedProduct?.sizes) && selectedProduct.sizes.length === 1) {
      setSelectedSize(selectedProduct.sizes[0]);
    } else {
      setSelectedSize('');
    }
  }, [selectedProduct?.id]);

  // Auto 3-second slideshow for multi-image gallery
  React.useEffect(() => {
    if (!selectedProduct) return;
    const list = Array.isArray(selectedProduct?.images) && selectedProduct.images.length > 0
      ? selectedProduct.images
      : [selectedProduct?.image || '/images/moj_logo.jpg'];
    if (list.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveImgIndex(prev => (prev + 1) % list.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [selectedProduct, isPaused]);

  if (!selectedProduct) return null;

  const id = selectedProduct.id || `prod-${Math.random()}`;
  const title = selectedProduct.title || 'MOJ Fine Jewelry';
  const category = selectedProduct.category || 'Jewelry';
  const price = typeof selectedProduct.price === 'number' ? selectedProduct.price : (parseFloat(selectedProduct.price) || 0);
  const originalPrice = typeof selectedProduct.originalPrice === 'number' ? selectedProduct.originalPrice : (parseFloat(selectedProduct.originalPrice) || price);
  const rating = selectedProduct.rating || 5.0;
  const reviewsCount = selectedProduct.reviewsCount || 1;
  const karat = selectedProduct.karat || 'Premium Hallmarked';
  const weight = selectedProduct.weight || 'Standard Weight';
  const description = selectedProduct.description || 'Crafted luxury jewelry artifact.';
  
  // Image list (supports array of images or fallback)
  const imageList = Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [selectedProduct.image || '/images/moj_logo.jpg'];
  const activeImage = imageList[activeImgIndex] || imageList[0];

  const stockVal = selectedProduct.stock !== undefined && selectedProduct.stock !== null && selectedProduct.stock !== ''
    ? parseInt(selectedProduct.stock, 10)
    : 10;
  const stock = !isNaN(stockVal) ? stockVal : 10;
  const isOutOfStock = stock <= 0;

  const isWishlisted = isInWishlist(id);

  // Variant requirement checks
  const productColors = Array.isArray(selectedProduct.colors) ? selectedProduct.colors : [];
  const isBanglesCategory = (category || '').toLowerCase().includes('bangle');
  const productSizes = Array.isArray(selectedProduct.sizes) && selectedProduct.sizes.length > 0
    ? selectedProduct.sizes
    : isBanglesCategory
    ? ['2.4', '2.6', '2.8', '2.10']
    : [];

  const hasColorRequirement = productColors.length > 0;
  const hasSizeRequirement = productSizes.length > 0 || isBanglesCategory;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (hasColorRequirement && !selectedColor) {
      setVariantError('Please select your preferred Color / Stone Shade (Compulsory).');
      return;
    }

    if (hasSizeRequirement && !selectedSize) {
      setVariantError('Please select your Size (Compulsory).');
      return;
    }

    setVariantError('');
    addToCart(selectedProduct, quantity, { selectedColor, selectedSize });
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl glass-modal border border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-full backdrop-blur"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Multi-Image Gallery Container (5s Auto-slideshow with Pause on Hover) */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex flex-col bg-slate-950 p-4 space-y-3"
          >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group/viewer">
              <img
                src={activeImage}
                alt={title}
                className={`w-full h-full object-cover transition-all duration-300 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                onError={(e) => { e.target.src = '/images/moj_logo.jpg'; }}
              />
              <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gold-500/30">
                {karat}
              </span>
              {isOutOfStock && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase shadow-md animate-pulse">
                  OUT OF STOCK
                </span>
              )}

              {/* Manual Slide Controls for Multi-Images */}
              {imageList.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex(prev => (prev - 1 + imageList.length) % imageList.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-full border border-white/20 transition-all opacity-80 hover:opacity-100"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex(prev => (prev + 1) % imageList.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-full border border-white/20 transition-all opacity-80 hover:opacity-100"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row if multiple images exist */}
            {imageList.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      idx === activeImgIndex ? 'border-gold-400 scale-105 shadow-lg' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="text-gold-400 font-semibold uppercase">{category}</span>
                <span className="flex items-center text-amber-400 gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  {rating} ({reviewsCount} reviews)
                </span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {title}
              </h2>

              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-2xl font-bold text-white">
                  ₹{(Number(price) || 0).toLocaleString()}
                </span>
                {originalPrice > price && (
                  <span className="text-slate-500 line-through text-sm">
                    ₹{(Number(originalPrice) || 0).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="mb-4">
                {isOutOfStock ? (
                  <span className="text-xs text-rose-400 font-bold uppercase">Out of Stock (0 units remaining)</span>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold">Available Stock: {stock} units</span>
                )}
              </div>

              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                {description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs mb-6">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Karat / Quality</span>
                  <strong className="text-gold-300">{karat}</strong>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Weight Info</span>
                  <strong className="text-white">{weight}</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Quality Inspected & Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-gold-400" />
                  <span>Insured Express Pan-India Courier</span>
                </div>
              </div>

              {/* COMPULSORY COLOR SELECTION */}
              {hasColorRequirement && (
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gold-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      Select Color / Stone Shade <span className="text-rose-400 font-bold">* (Compulsory)</span>
                    </label>
                    {selectedColor && (
                      <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {selectedColor} ✓
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {productColors.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => { setSelectedColor(col); setVariantError(''); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedColor === col
                            ? 'bg-gold-500 text-black border-gold-400 font-bold shadow-md shadow-gold-500/20 scale-105'
                            : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-gold-500/50 hover:text-white'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COMPULSORY SIZE SELECTION (FOR BANGLES & SIZED ITEMS) */}
              {hasSizeRequirement && (
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gold-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      {isBanglesCategory ? 'Select Bangle Size' : 'Select Size / Style'} <span className="text-rose-400 font-bold">* (Compulsory)</span>
                    </label>
                    {selectedSize && (
                      <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {selectedSize} ✓
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {productSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => { setSelectedSize(sz); setVariantError(''); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedSize === sz
                            ? 'bg-gold-500 text-black border-gold-400 font-bold shadow-md shadow-gold-500/20 scale-105'
                            : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-gold-500/50 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Warning Alert */}
              {variantError && (
                <div className="p-2.5 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2 mt-3 animate-pulse">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-semibold">{variantError}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="text-slate-400 hover:text-white px-2 font-bold disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-white font-semibold px-3 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= stock}
                    className="text-slate-400 hover:text-white px-2 font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all ${
                    isOutOfStock
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'btn-gold-shimmer text-black cursor-pointer'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Currently Out of Stock' : `Add to Bag - ₹${((Number(price) || 0) * (Number(quantity) || 1)).toLocaleString()}`}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareProduct}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                    copiedShare
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-gold-300 hover:border-gold-400/60'
                  }`}
                  title="Share Product Link"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Link Copied! ✓</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-gold-400" />
                      <span>Share Product</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-colors active:scale-95 ${
                    isWishlisted
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── CUSTOMER REVIEWS & RATINGS SECTION ── */}
        <ProductReviewsSection productId={id} />
      </div>
    </div>
  );
}

// Subcomponent: Product Reviews Section
function ProductReviewsSection({ productId }) {
  const { reviews, addReview, canUserReviewProduct, user } = useStore();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productReviews = (reviews || []).filter(r => String(r.productId) === String(productId));
  const reviewEligibility = canUserReviewProduct(productId);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const res = await addReview({
      productId,
      userName: user?.name || 'Customer',
      userEmail: user?.email || '',
      rating: newRating,
      comment: newComment.trim(),
      isVerifiedBuyer: true
    });
    setIsSubmitting(false);

    setFeedback(res);
    if (res.success) {
      setNewComment('');
    }
  };

  return (
    <div className="bg-slate-950 p-6 md:p-8 border-t border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-current" /> Customer Reviews & Ratings
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {productReviews.length === 0
              ? 'No customer reviews yet. Be the first verified buyer to leave a review!'
              : `${productReviews.length} verified customer review${productReviews.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Review Submission Form / Notice */}
      <div className="glass-card p-4 rounded-xl border border-slate-800">
        {reviewEligibility.allowed ? (
          <form onSubmit={handleSubmitReview} className="space-y-3">
            <span className="text-xs font-bold text-gold-300 block">Write a Verified Customer Review</span>
            
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium">Your Rating:</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 text-amber-400 focus:outline-none"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              rows={2}
              placeholder="Share your feedback on quality, finish, and packaging..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold-shimmer px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Verified Review'}
            </button>

            {feedback && (
              <p className={`text-xs font-semibold ${feedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {feedback.message}
              </p>
            )}
          </form>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <span>{reviewEligibility.reason}</span>
          </div>
        )}
      </div>

      {/* List of Reviews */}
      {productReviews.length > 0 && (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {productReviews.map((rev) => (
            <div key={rev.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{rev.userName}</span>
                  {rev.isVerifiedBuyer && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">{rev.dateStr || 'Recently'}</span>
              </div>

              <div className="flex items-center space-x-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= (rev.rating || 5) ? 'fill-current' : 'text-slate-700'}`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
