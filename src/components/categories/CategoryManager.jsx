import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Modal } from '../ui/Modal';
import { fetchCategoriesApi, saveCategoryApi, deleteCategoryApi } from '../../services/api';
import { toast } from 'sonner';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  ShoppingBag,
  Coffee,
  Tv,
  Home,
  Package,
  Sparkles,
  Store,
  ChevronRight,
  ExternalLink,
  Tag,
  CheckCircle2,
  Building2,
  Image as ImageIcon,
  Upload,
  Eye
} from 'lucide-react';

const CATEGORY_PRESETS = [
  { name: "Meat, Poultry & Fish", hub: "Supermarket", icon: "Coffee", badge: "Chilled Express", count: 45, subcategories: ["Fresh Poultry", "Seafood & Fish", "Cold Cuts & Ribs"], banner_img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80", tagline: "FRESH OFF THE FLIGHT", subtitle: "Good Food, better life!!! Direct cold chain delivery." },
  { name: "Fresh Groceries & Food", hub: "Supermarket", icon: "ShoppingBag", badge: "Farm Fresh", count: 85, subcategories: ["Rice & Grains", "Cooking Oils", "Spices"], banner_img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80", tagline: "FARM FRESH DIRECT", subtitle: "Premium rice, cooking oils, grains & daily essentials." },
  { name: "Beverages & Cold Drinks", hub: "Supermarket", icon: "Coffee", badge: "Chilled", count: 60, subcategories: ["Juices", "Mineral Water", "Malt Drinks"], banner_img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80", tagline: "CHILLED & REFRESHING", subtitle: "Pure mineral water, fruit juices, malts & premium beverages." },
  { name: "Electronics & Tech Mall", hub: "Mall", icon: "Tv", badge: "Mall Prime", count: 32, subcategories: ["Smart TVs", "Audio", "Appliances"], banner_img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80", tagline: "MALL EXCLUSIVE TECH", subtitle: "Smart 4K TVs, home audio, appliances & genuine electronics." }
];

const BANNER_PRESETS = [
  { label: "Meat & Fish", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80", tagline: "FRESH OFF THE FLIGHT", subtitle: "Good Food, better life!!! Direct cold chain delivery." },
  { label: "Groceries", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80", tagline: "FARM FRESH DIRECT", subtitle: "Premium rice, cooking oils, grains & daily essentials." },
  { label: "Beverages", url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80", tagline: "CHILLED & REFRESHING", subtitle: "Pure mineral water, fruit juices, malts & beverages." },
  { label: "Electronics", url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80", tagline: "MALL EXCLUSIVE TECH", subtitle: "Smart 4K TVs, home audio, appliances & genuine tech." },
  { label: "Household", url: "https://images.unsplash.com/photo-1585559605152-32b04f323c68?auto=format&fit=crop&w=1200&q=80", tagline: "DAILY CARE & ESSENTIALS", subtitle: "Quality laundry detergents, tissue papers & surface care." },
  { label: "Stationery", url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1200&q=80", tagline: "OFFICE & SCHOOL SUPPLIES", subtitle: "A4 copy paper, notebooks, pens & bulk stationery." },
  { label: "Baby Care", url: "https://images.unsplash.com/photo-1604917019112-7d8f8d7c5c9f?auto=format&fit=crop&w=1200&q=80", tagline: "GENTLE CARE FOR BABIES", subtitle: "Diapers, formula milk, wipes & skincare." }
];

export function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [selectedHub, setSelectedHub] = useState('All');
  const [selectedCat, setSelectedCat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    hub: 'Supermarket',
    icon: 'ShoppingBag',
    badge: 'Popular',
    sort_order: 1,
    subcategoriesStr: '',
    banner_img: '',
    tagline: '',
    subtitle: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    const data = await fetchCategoriesApi();
    if (data) setCategories(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setSelectedCat(null);
    setFormData({
      name: '',
      slug: '',
      hub: 'Supermarket',
      icon: 'ShoppingBag',
      badge: 'Popular',
      sort_order: categories.length + 1,
      subcategoriesStr: 'Fresh Poultry, Seafood & Fish, Cold Cuts',
      banner_img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      tagline: 'FRESH OFF THE FLIGHT',
      subtitle: 'Good Food, better life!!! Direct cold chain delivery.'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setSelectedCat(cat);
    const subArr = Array.isArray(cat.subcategories) ? cat.subcategories : [];
    setFormData({
      name: cat.name,
      slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-'),
      hub: cat.hub || 'Supermarket',
      icon: cat.icon || 'ShoppingBag',
      badge: cat.badge || 'Popular',
      sort_order: cat.sort_order || 1,
      subcategoriesStr: subArr.join(', '),
      banner_img: cat.banner_img || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      tagline: cat.tagline || 'FRESH OFF THE FLIGHT',
      subtitle: cat.subtitle || 'Good Food, better life!!! Direct cold chain delivery.'
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, banner_img: reader.result }));
      toast.success("Category banner image uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = async (preset) => {
    await saveCategoryApi({
      name: preset.name,
      hub: preset.hub,
      icon: preset.icon,
      count: preset.count,
      badge: preset.badge,
      subcategories: preset.subcategories,
      banner_img: preset.banner_img,
      tagline: preset.tagline,
      subtitle: preset.subtitle
    });
    await loadCategories();
    toast.success(`Preset "${preset.name}" added to catalog!`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const subs = formData.subcategoriesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      id: selectedCat ? selectedCat.id : undefined,
      name: formData.name,
      hub: formData.hub,
      icon: formData.icon,
      count: selectedCat?.count || 0,
      badge: formData.badge,
      subcategories: subs,
      banner_img: formData.banner_img,
      tagline: formData.tagline,
      subtitle: formData.subtitle
    };

    await saveCategoryApi(payload);
    await loadCategories();
    toast.success(`Category '${formData.name}' saved with custom banner image`);
    setIsModalOpen(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Remove category "${name}" from taxonomy?`)) {
      await deleteCategoryApi(id);
      setCategories(prev => prev.filter(c => String(c.id) !== String(id)));
      toast.success("Category deleted");
    }
  };

  const filteredCategories = categories.filter(c => {
    if (selectedHub === 'All') return true;
    return c.hub === selectedHub;
  });

  const totalProductsCount = categories.reduce((sum, c) => sum + (Number(c.count) || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* Top Banner with Taxonomy Health */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Storefront Taxonomy & Banners
              </span>
              <span className="text-xs text-slate-400 font-mono">Dynamic Category Visuals</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Category Banners & Taxonomy Manager
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Upload custom category banner images, configure taglines, subheadlines, and department icons across Supermarket Express and Online Shopping Mall.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xl shadow-amber-400/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Category & Banner Image
            </button>
          </div>
        </div>

        {/* Taxonomy Statistics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Department Hubs</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">2 Main Hubs</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Categories</span>
            <p className="text-lg font-black text-white mt-0.5">{categories.length} Categories</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Products Categorized</span>
            <p className="text-lg font-black text-indigo-400 mt-0.5">{totalProductsCount.toLocaleString()} SKUs</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Category Banners</span>
            <p className="text-lg font-black text-amber-400 mt-0.5">Custom Banners Active</p>
          </div>
        </div>
      </div>

      {/* Quick 1-Click Preset Importer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Quick-Add Department Banners Presets</span>
          </h3>
          <span className="text-[11px] text-slate-400">Add standard department lines in 1 click</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORY_PRESETS.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{preset.hub}</span>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  {preset.name}
                </h4>
                <p className="text-[11px] text-slate-400">{preset.subcategories.length} Subcategories</p>
              </div>
              <span className="p-2 rounded-xl bg-slate-800 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <Plus className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hub Tabs Filter */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedHub('All')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedHub === 'All' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>All Department Hubs ({categories.length})</span>
          </button>
          <button
            onClick={() => setSelectedHub('Supermarket')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedHub === 'Supermarket' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Supermarket Express</span>
          </button>
          <button
            onClick={() => setSelectedHub('Mall')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedHub === 'Mall' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Online Shopping Mall</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {filteredCategories.length} categories shown
        </span>
      </div>

      {/* Categories Grid with Banner Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map(cat => {
          const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
          const bannerUrl = cat.banner_img || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';

          return (
            <div key={cat.id} className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 overflow-hidden flex flex-col justify-between group shadow-xl transition-all">
              {/* Category Card Header with Admin Banner Preview */}
              <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                <img src={bannerUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      cat.hub === 'Mall'
                        ? 'bg-indigo-500/80 text-white border-indigo-400'
                        : 'bg-emerald-500/80 text-slate-950 border-emerald-400'
                    }`}>
                      {cat.hub}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-full bg-black/80 hover:bg-amber-400 hover:text-slate-950 text-white transition-all shadow-md cursor-pointer flex items-center gap-1 text-[10px] font-bold px-2.5"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Change Image</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                      {cat.tagline || 'FRESH OFF THE FLIGHT'}
                    </span>
                    <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-400 line-clamp-1 italic">
                  {cat.subtitle || 'Good Food, better life!!! Direct cold chain delivery.'}
                </p>

                {/* Subcategories Chips */}
                {subs.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {subs.slice(0, 4).map((sub, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {sub}
                      </span>
                    ))}
                    {subs.length > 4 && (
                      <span className="text-[10px] text-slate-500">+{subs.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>

              <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">
                  {cat.count ?? cat.product_count ?? 0} Products Active
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Edit Category & Banner Image"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Category & Banner Image Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCat ? 'Edit Category Banner & Taxonomy' : 'Create Department Category & Banner'}>
        <form onSubmit={handleSave} className="space-y-4 text-slate-100 max-h-[80vh] overflow-y-auto pr-1">
          
          {/* Live Storefront Category Banner Preview */}
          <div className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl bg-black relative group">
            <div className="relative h-32 sm:h-36 w-full overflow-hidden">
              <img
                src={formData.banner_img || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'}
                alt="Banner Live Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent p-4 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  {formData.tagline || 'FRESH OFF THE FLIGHT'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {formData.name || 'Meat, Poultry & Fish'}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {formData.subtitle || 'Good Food, better life!!! Direct cold chain delivery.'}
                </p>
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1">
                <Eye className="w-3 h-3" /> Live Storefront Banner Preview
              </div>
            </div>
            <div className="adinkra-pattern-border" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/\s+/g, '-');
                setFormData(prev => ({ ...prev, name, slug }));
              }}
              placeholder="e.g. Meat, Poultry & Fish"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
            />
          </div>

          {/* Banner Image Selection & File Upload */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> Category Banner Image
              </label>
              <label className="px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black cursor-pointer flex items-center gap-1 transition-all shadow-md">
                <Upload className="w-3 h-3" /> Upload Local Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageFileUpload} />
              </label>
            </div>

            <input
              type="url"
              required
              value={formData.banner_img}
              onChange={(e) => setFormData(prev => ({ ...prev, banner_img: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 focus:outline-none focus:border-amber-400"
            />

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Click to Apply Curated Banner Image Presets:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {BANNER_PRESETS.map((preset, pIdx) => (
                  <button
                    type="button"
                    key={pIdx}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      banner_img: preset.url,
                      tagline: preset.tagline,
                      subtitle: preset.subtitle
                    }))}
                    className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-400 hover:text-slate-950 border border-slate-700 text-[10px] font-bold text-slate-300 transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Banner Tagline (Top-Left)</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                placeholder="e.g. FRESH OFF THE FLIGHT"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Department Hub</label>
              <select
                value={formData.hub}
                onChange={(e) => setFormData(prev => ({ ...prev, hub: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Supermarket">Supermarket Express</option>
                <option value="Mall">Online Shopping Mall</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Banner Subtitle / Description</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g. Good Food, better life!!! Direct cold chain delivery."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Badge Tag</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                placeholder="e.g. Popular, Fresh"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-emerald-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Subcategories (Comma separated)</label>
            <textarea
              rows={2}
              value={formData.subcategoriesStr}
              onChange={(e) => setFormData(prev => ({ ...prev, subcategoriesStr: e.target.value }))}
              placeholder="e.g. Fresh Poultry, Seafood & Fish, Cold Cuts"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
            >
              Save Category & Banner
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
