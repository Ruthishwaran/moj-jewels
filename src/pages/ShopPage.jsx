import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function ShopPage() {
  const {
    products,
    categories: storeCategories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useStore();

  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'

  const categories = storeCategories || ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];

  const safeProducts = Array.isArray(products) ? products : [];

  let filtered = safeProducts.filter(p => {
    const titleMatch = p.title ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const catMatch = p.category ? p.category.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const karatMatch = p.karat ? p.karat.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesSearch = titleMatch || catMatch || karatMatch;
    const matchesCategory = selectedCategory === 'All' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>Royal Catalog</span>
        </div>
        <h1 className="text-4xl font-serif font-bold text-white">
          All Fine Jewels & Artifacts
        </h1>
        <p className="text-slate-400 text-xs">
          Handcrafted with 100% BIS Hallmarked gold, natural VVS diamonds & precious emerald gems.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gold rings, necklaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-black font-semibold shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-400"
          >
            <option value="featured">Featured Jewels</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-slate-400 text-sm">No jewelry matched your search "{searchQuery}"</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="text-gold-400 underline text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
