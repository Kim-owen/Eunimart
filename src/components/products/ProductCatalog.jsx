import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ProductModal } from './ProductModal';
import { fetchProductsApi, deleteProductApi } from '../../services/api';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const sampleProducts = [
  {
    id: 'p1',
    sku: 'SKU-89240',
    title: 'Royal Aroma Premium Long Grain Fragrant Rice',
    category: 'Groceries & Food Staples',
    price: 115.00,
    stock: 450,
    is_active: true,
    is_hot: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p2',
    sku: 'SKU-77142',
    title: 'SunGold Pure Refined Vegetable Cooking Oil 5L',
    category: 'Groceries & Food Staples',
    price: 145.00,
    stock: 320,
    is_active: true,
    is_hot: true,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p5',
    sku: 'SKU-61204',
    title: 'Milo Energy Cocoa Food Drink Powder 800g',
    category: 'Beverages & Cold Drinks',
    price: 68.00,
    stock: 12,
    is_active: true,
    is_hot: false,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'b1',
    sku: 'SKU-10492',
    title: 'Bel-Aqua Purified Natural Mineral Water 12-Pack',
    category: 'Beverages & Cold Drinks',
    price: 24.00,
    stock: 1200,
    is_active: true,
    is_hot: true,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p7',
    sku: 'SKU-99401',
    title: 'Smart 4K Ultra HD Commercial Display TV 55"',
    category: 'Electronics & Tech Mall',
    price: 3850.00,
    stock: 5,
    is_active: true,
    is_hot: true,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80'
  }
];

export function ProductCatalog() {
  const [products, setProducts] = useState(sampleProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const remote = await fetchProductsApi();
      if (remote && remote.length > 0) {
        setProducts(remote);
      }
    }
    loadProducts();
  }, []);

  const handleToggleActive = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextState = !p.is_active;
        toast.info(`Product ${p.title} set to ${nextState ? 'Active' : 'Inactive'}`);
        return { ...p, is_active: nextState };
      }
      return p;
    }));
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product from catalog?")) {
      await deleteProductApi(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Product removed from catalog");
    }
  };

  const handleSaveSuccess = (savedProduct) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === savedProduct.id);
      if (exists) {
        return prev.map(p => p.id === savedProduct.id ? savedProduct : p);
      }
      return [savedProduct, ...prev];
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Product Catalog & Inventory Control</h2>
          <p className="text-xs text-slate-400 mt-1">Manage SKUs, prices, stock counts, and object storage assets.</p>
        </div>
        <button
          onClick={() => { setModalProduct(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU or product title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Categories</option>
            <option value="Groceries & Food Staples">Groceries & Food Staples</option>
            <option value="Beverages & Cold Drinks">Beverages & Cold Drinks</option>
            <option value="Electronics & Tech Mall">Electronics & Tech Mall</option>
          </select>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map(product => (
          <GlassCard key={product.id} className="flex flex-col justify-between">
            <div>
              <div className="relative h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-950">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 font-mono text-[10px] font-bold px-2 py-1 rounded-md bg-black/70 text-emerald-400 backdrop-blur-md border border-white/10">
                  {product.sku || 'SKU-00000'}
                </span>
                {product.is_hot && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-1 rounded-md bg-amber-500 text-slate-950">
                    🔥 HOT SELLER
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{product.category}</span>
                <h3 className="text-sm font-bold text-white line-clamp-2">{product.title}</h3>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Unit Price</span>
                  <p className="text-lg font-black text-emerald-400">
                    GH₵ {Number(product.price || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Stock Count</span>
                  <p className={`text-xs font-bold ${Number(product.stock) < 20 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {product.stock} Units
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => handleToggleActive(product.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                    product.is_active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {product.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{product.is_active ? 'Active' : 'Inactive'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setModalProduct(product); setIsModalOpen(true); }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
