import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ProductModal } from './ProductModal';
import { fetchProductsApi, deleteProductApi } from '../../services/api';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List,
  Sparkles,
  Package,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Tag,
  Flame,
  Building2,
  ShoppingBag
} from 'lucide-react';

const sampleProducts = [
  {
    id: 'p1',
    sku: 'SKU-89240',
    title: 'Royal Aroma Premium Long Grain Fragrant Rice 5kg',
    category: 'Groceries & Food Staples',
    hub: 'Supermarket',
    price: 115.00,
    stock: 450,
    is_active: true,
    is_hot: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    tiers: [
      { id: 'unit', label: 'Single Unit', price: 115.00, unitCount: 1 },
      { id: 'carton', label: 'Carton (4 Bags)', price: 440.00, unitCount: 4 },
      { id: 'pallet', label: 'Distributor Pallet', price: 4200.00, unitCount: 40 }
    ]
  },
  {
    id: 'p2',
    sku: 'SKU-77142',
    title: 'SunGold Pure Refined Vegetable Cooking Oil 5L',
    category: 'Groceries & Food Staples',
    hub: 'Supermarket',
    price: 145.00,
    stock: 320,
    is_active: true,
    is_hot: true,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    tiers: [
      { id: 'unit', label: 'Single Unit', price: 145.00, unitCount: 1 },
      { id: 'carton', label: 'Carton (4 Cans)', price: 550.00, unitCount: 4 }
    ]
  },
  {
    id: 'p5',
    sku: 'SKU-61204',
    title: 'Milo Energy Cocoa Food Drink Powder 800g',
    category: 'Beverages & Cold Drinks',
    hub: 'Supermarket',
    price: 68.00,
    stock: 14,
    is_active: true,
    is_hot: false,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    tiers: [
      { id: 'unit', label: 'Single Unit', price: 68.00, unitCount: 1 }
    ]
  },
  {
    id: 'b1',
    sku: 'SKU-10492',
    title: 'Bel-Aqua Purified Natural Mineral Water 12-Pack',
    category: 'Beverages & Cold Drinks',
    hub: 'Supermarket',
    price: 24.00,
    stock: 1200,
    is_active: true,
    is_hot: true,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    tiers: [
      { id: 'unit', label: 'Single Unit', price: 24.00, unitCount: 1 },
      { id: 'pallet', label: 'Pallet (50 Packs)', price: 1100.00, unitCount: 50 }
    ]
  },
  {
    id: 'p7',
    sku: 'SKU-99401',
    title: 'Commercial 4K Ultra HD Display TV 55"',
    category: 'Electronics & Tech Mall',
    hub: 'Mall',
    price: 3850.00,
    stock: 6,
    is_active: true,
    is_hot: true,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    tiers: [
      { id: 'unit', label: 'Single Unit', price: 3850.00, unitCount: 1 }
    ]
  }
];

export function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'hot'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    const remote = await fetchProductsApi();
    if (Array.isArray(remote)) {
      setProducts(remote);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleActive = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextState = !p.is_active;
        toast.info(`Product "${p.title}" set to ${nextState ? 'Active' : 'Inactive'}`);
        return { ...p, is_active: nextState };
      }
      return p;
    }));
  };

  const handleDeleteProduct = async (productId) => {
    const prod = products.find(p => p.id === productId);
    const title = prod?.title || 'this product';
    if (window.confirm(`Are you sure you want to completely delete "${title}" from the catalog and SQLite database?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      await deleteProductApi(productId);
      toast.success(`Product "${title}" deleted completely from database.`);
    }
  };

  const handleSaveSuccess = async () => {
    await loadProducts();
  };

  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const inventoryWorth = products.reduce((acc, p) => acc + ((Number(p.price) || 50) * (Number(p.stock) || 0)), 0);
  const lowStockCount = products.filter(p => Number(p.stock) < 20).length;

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = 
      stockFilter === 'all' ? true :
      stockFilter === 'low' ? Number(p.stock) < 20 :
      stockFilter === 'hot' ? Boolean(p.is_hot) : true;
    return matchesCategory && matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* Top Banner with Inventory Health Metrics */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> SKU & Inventory Matrix
              </span>
              <span className="text-xs text-slate-400 font-mono">SQLite Tiers Connected</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Product Catalog & Stock Management
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Create product SKUs, assign wholesale tiered quantity discounts (Units, Cartons, Pallets), configure factory sources, and monitor stock depletion thresholds.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => { setModalProduct(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New SKU
            </button>
            <button
              onClick={loadProducts}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
              title="Refresh Products"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Inventory Valuation Header Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Inventory Value</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">
              GH₵ {inventoryWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Units in Depots</span>
            <p className="text-lg font-black text-white mt-0.5">
              {totalStockUnits.toLocaleString()} Units
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active SKUs</span>
            <p className="text-lg font-black text-indigo-400 mt-0.5">
              {products.length} Products
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Low Stock Threshold</span>
            <p className="text-lg font-black text-amber-400 mt-0.5">
              {lowStockCount} Reorder Alerts
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU code, title, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Chips & View Mode */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                stockFilter === 'all' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All SKUs
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                stockFilter === 'low' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setStockFilter('hot')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                stockFilter === 'hot' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hot Sellers</span>
            </button>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Categories</option>
            <option value="Groceries & Food Staples">Groceries & Food Staples</option>
            <option value="Beverages & Cold Drinks">Beverages & Cold Drinks</option>
            <option value="Electronics & Tech Mall">Electronics & Tech Mall</option>
          </select>

          {/* View Toggle (Grid / Table) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Dense Table View"
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            const tiers = product.tiers || [];
            return (
              <GlassCard key={product.id} className="flex flex-col justify-between group hover:border-slate-700/80 transition-all">
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3.5 bg-slate-950">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Package className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <span className="absolute top-2.5 left-2.5 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md bg-black/80 text-emerald-400 backdrop-blur-md border border-white/10">
                      {product.sku || 'SKU-00000'}
                    </span>
                    {product.is_hot && (
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-black px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3" /> HOT SELLER
                      </span>
                    )}

                    <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700 flex items-center gap-1">
                      {product.hub === 'Mall' ? <Building2 className="w-3 h-3 text-indigo-400" /> : <ShoppingBag className="w-3 h-3 text-emerald-400" />}
                      <span>{product.hub === 'Mall' ? 'Tech Mall' : 'Supermarket Express'}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                      {product.title}
                    </h3>
                  </div>

                  {/* Wholesale Tiers Strip */}
                  {tiers.length > 1 && (
                    <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {tiers.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                          {t.label}: GH₵ {t.price}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Unit Base Price</span>
                      <p className="text-lg font-black text-emerald-400">
                        GH₵ {Number(product.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold flex items-center justify-end gap-1 ${Number(product.stock) < 20 ? 'text-amber-400' : 'text-slate-200'}`}>
                        <span>{product.stock} Units</span>
                        {Number(product.stock) < 20 && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <AlertCircle className="w-2.5 h-2.5" /> Low
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => handleToggleActive(product.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
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
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">SKU / Image</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-slate-950 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center text-slate-500 flex-shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <span className="font-mono text-emerald-400 font-bold">{p.sku}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white max-w-xs truncate">{p.title}</td>
                    <td className="py-3 px-4 text-slate-400">{p.category}</td>
                    <td className="py-3 px-4 font-black text-emerald-400">GH₵ {Number(p.price || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${Number(p.stock) < 20 ? 'text-amber-400' : 'text-slate-200'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setModalProduct(p); setIsModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
        onSaveSuccess={handleSaveSuccess}
      />

    </div>
  );
}
