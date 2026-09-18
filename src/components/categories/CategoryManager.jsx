import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Modal } from '../ui/Modal';
import { fetchCategoriesApi, saveCategoryApi, deleteCategoryApi } from '../../services/api';
import { toast } from 'sonner';
import { Layers, Plus, Edit, Trash2, ArrowUpDown, ShoppingBag, Coffee, Tv, Home, Package } from 'lucide-react';

export function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', icon: 'ShoppingBag', sort_order: 1 });

  const loadCategories = async () => {
    const data = await fetchCategoriesApi();
    if (data) setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setSelectedCat(null);
    setFormData({ name: '', slug: '', icon: 'ShoppingBag', sort_order: categories.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setSelectedCat(cat);
    setFormData({ name: cat.name, slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-'), icon: cat.icon || 'ShoppingBag', sort_order: cat.sort_order || 1 });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: selectedCat ? selectedCat.id : undefined,
      ...formData,
      is_active: true
    };
    await saveCategoryApi(payload);
    await loadCategories();
    toast.success(`Category '${formData.name}' saved`);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this category from taxonomy?")) {
      await deleteCategoryApi(id);
      setCategories(prev => prev.filter(c => String(c.id) !== String(id)));
      toast.success("Category deleted");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Category & Taxonomy Management</h2>
          <p className="text-xs text-slate-400 mt-1">Organize storefront hierarchy, dynamic icons, and product bindings.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map(cat => (
          <GlassCard key={cat.id} hover className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Sort #{cat.sort_order}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{cat.name}</h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">/{cat.slug}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                {cat.product_count} Active Products
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCat ? 'Edit Category' : 'Create Category'}>
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
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
            <label className="block text-xs font-bold text-slate-300 mb-1">Sort Priority Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
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
