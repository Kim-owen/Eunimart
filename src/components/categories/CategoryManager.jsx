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
  Building2
} from 'lucide-react';

const CATEGORY_PRESETS = [
  { name: "Bakery & Fresh Pastries", hub: "Supermarket", icon: "Coffee", badge: "Daily Fresh", count: 45, subcategories: ["Artisanal Bread", "Cakes & Pies", "Croissants"] },
  { name: "Health, Beauty & Personal", hub: "Supermarket", icon: "ShoppingBag", badge: "Self Care", count: 85, subcategories: ["Skincare", "Soaps & Shampoos", "Oral Care"] },
  { name: "Baby & Toddler Essentials", hub: "Supermarket", icon: "Home", badge: "Pampers & Milk", count: 60, subcategories: ["Diapers", "Baby Formula", "Wipes"] },
  { name: "Home Appliances & Living", hub: "Mall", icon: "Tv", badge: "Mall Prime", count: 32, subcategories: ["Blenders", "Microwaves", "Iron & Fans"] }
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
    banner_img: ''
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
      subcategoriesStr: 'Rice & Grains, Cooking Oils, Spices',
      banner_img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
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
      banner_img: cat.banner_img || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    });
    setIsModalOpen(true);
  };

  const handleApplyPreset = async (preset) => {
    await saveCategoryApi({
      name: preset.name,
      hub: preset.hub,
      icon: preset.icon,
      count: preset.count,
      badge: preset.badge,
      subcategories: preset.subcategories,
      banner_img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
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
      banner_img: formData.banner_img
    };

    await saveCategoryApi(payload);
    await loadCategories();
    toast.success(`Category '${formData.name}' saved`);
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
                <Sparkles className="w-3 h-3" /> Storefront Taxonomy Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono">Hierarchy Bindings</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Category & Taxonomy Management
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Structure department hubs, category icons, subcategory tags, and dynamic product bindings across Supermarket Express and Online Shopping Mall.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Category
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
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Storefront Binding</span>
            <p className="text-lg font-black text-amber-400 mt-0.5">100% Synced</p>
          </div>
        </div>
      </div>

      {/* Quick 1-Click Preset Importer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Quick-Add Taxonomy Presets</span>
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map(cat => {
          const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
          return (
            <GlassCard key={cat.id} hover className="space-y-4 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    cat.hub === 'Mall'
                      ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {cat.hub}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    /{cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')}
                  </p>
                </div>

                {/* Subcategories Chips */}
                {subs.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
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

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">
                  {cat.count ?? cat.product_count ?? 0} Products Active
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Edit Category"
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
            </GlassCard>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCat ? 'Edit Category' : 'Create Department Category'}>
        <form onSubmit={handleSave} className="space-y-4 text-slate-100">
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
              placeholder="e.g. Fresh Groceries & Staples"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Department Hub</label>
              <select
                value={formData.hub}
                onChange={(e) => setFormData(prev => ({ ...prev, hub: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Supermarket">Supermarket Express</option>
                <option value="Mall">Online Shopping Mall</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Badge Tag</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                placeholder="e.g. Popular, Fresh"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Subcategories (Comma separated)</label>
            <textarea
              rows={2}
              value={formData.subcategoriesStr}
              onChange={(e) => setFormData(prev => ({ ...prev, subcategoriesStr: e.target.value }))}
              placeholder="e.g. Rice & Grains, Cooking Oils, Flours"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
