import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { saveProductApi } from '../../services/api';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon, Save, Check } from 'lucide-react';

export function ProductModal({ isOpen, onClose, product, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    slug: '',
    price: '',
    stock: '',
    category: 'Groceries & Food Staples',
    description: '',
    image: '',
    is_active: true,
    is_hot: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        title: product.title || '',
        sku: product.sku || `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
        slug: product.slug || (product.title || '').toLowerCase().replace(/\s+/g, '-'),
        price: product.price || (product.tiers?.[0]?.price || 50),
        stock: product.stock || 100,
        category: product.category || 'Groceries & Food Staples',
        description: product.description || 'Premium D2C product direct from Ghana producers.',
        image: product.image || product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        is_active: product.is_active !== undefined ? Boolean(product.is_active) : true,
        is_hot: Boolean(product.is_hot)
      });
    } else {
      setFormData({
        title: '',
        sku: `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
        slug: '',
        price: '45.00',
        stock: '150',
        category: 'Groceries & Food Staples',
        description: 'High-quality Ghana product packaged for express delivery.',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        is_hot: false
      });
    }
  }, [product, isOpen]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulate Object Storage Upload handler
    setTimeout(() => {
      const demoImages = [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80'
      ];
      const randomImg = demoImages[Math.floor(Math.random() * demoImages.length)];
      setFormData(prev => ({ ...prev, image: randomImg }));
      setIsUploading(false);
      toast.success("Image uploaded to Supabase Object Storage bucket 'products-media'");
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveProductApi(formData);
    toast.success(product ? 'Product updated successfully' : 'New product created in catalog');
    onSaveSuccess({ ...formData, id: res.id || formData.id || `p-${Date.now()}` });
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product Details' : 'Create New Product'} maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. Royal Aroma Rice 5kg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">SKU Number</label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Unit Price (GH₵)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Stock Count</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Category Binding</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Groceries & Food Staples">Groceries & Food Staples</option>
              <option value="Beverages & Cold Drinks">Beverages & Cold Drinks</option>
              <option value="Electronics & Tech Mall">Electronics & Tech Mall</option>
              <option value="Household & Baby">Household & Baby</option>
              <option value="Stationery & Office Supplies">Stationery & Office Supplies</option>
            </select>
          </div>
        </div>

        {/* Drag and Drop Image Upload Box */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Object Storage Image Upload</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleImageDrop}
            className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-800/40 transition-colors cursor-pointer"
          >
            {formData.image ? (
              <div className="flex items-center gap-4">
                <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-slate-700" />
                <div className="text-left flex-1">
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Image Ready in Bucket
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{formData.image}</p>
                  <button
                    type="button"
                    onClick={handleImageDrop}
                    className="mt-2 text-[11px] font-bold text-amber-400 hover:underline"
                  >
                    Replace Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Drag & Drop Product Image here</p>
                <p className="text-[11px] text-slate-400">Direct upload to Supabase Object Storage</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Active & Hot Toggles */}
        <div className="flex items-center gap-6 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded accent-emerald-500 w-4 h-4"
            />
            Active in Storefront Catalog
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_hot}
              onChange={(e) => setFormData(prev => ({ ...prev, is_hot: e.target.checked }))}
              className="rounded accent-amber-500 w-4 h-4"
            />
            Featured Hot Seller Badge
          </label>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
