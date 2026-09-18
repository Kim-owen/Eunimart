import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { saveProductApi, deleteProductApi } from '../../services/api';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon, Save, Check, X, Link2, FileImage, Trash2 } from 'lucide-react';

export function ProductModal({ isOpen, onClose, product, onSaveSuccess }) {
  const fileInputRef = useRef(null);
  const [imageUploadMode, setImageUploadMode] = useState('file'); // 'file' | 'url'
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
  const [uploadFileName, setUploadFileName] = useState('');
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
      setUploadFileName(product.image ? 'Existing Product Asset' : '');
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
      setUploadFileName('Default Sample Image');
    }
  }, [product, isOpen]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  // Real File Upload Handler (FileReader Base64)
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type. Please upload a PNG, JPEG, or WEBP image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size exceeds 8MB. Please upload a smaller image.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      setFormData(prev => ({ ...prev, image: base64Url }));
      setUploadFileName(file.name);
      setIsUploading(false);
      toast.success(`Image "${file.name}" uploaded and optimized!`);
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
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

        {/* Product Image Asset Studio */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-200">
              Product Image Asset
            </label>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setImageUploadMode('file')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  imageUploadMode === 'file' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileImage className="w-3 h-3" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setImageUploadMode('url')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  imageUploadMode === 'url' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Link2 className="w-3 h-3" />
                <span>Image URL</span>
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
          />

          {imageUploadMode === 'file' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-2xl p-4 text-center bg-slate-950/60 transition-all cursor-pointer group"
            >
              {formData.image ? (
                <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Image Ready for Storefront</span>
                    </p>
                    <p className="text-[11px] text-slate-300 font-mono mt-0.5 truncate">
                      {uploadFileName || 'Custom Uploaded Asset'}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                      >
                        Choose Different File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: '' }));
                          setUploadFileName('');
                        }}
                        className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      Click to upload image or drag & drop here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supports PNG, JPEG, WEBP up to 8MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Browse Device
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/product-image.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              {formData.image && (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <img src={formData.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-700" onError={() => toast.error('Could not load image from URL')} />
                  <span className="text-[11px] text-emerald-400 font-bold">Image URL Live Preview</span>
                </div>
              )}
            </div>
          )}
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

        <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-800">
          {product?.id ? (
            <button
              type="button"
              onClick={async () => {
                if (window.confirm(`Are you sure you want to completely delete "${formData.title || 'this product'}" from the catalog and database?`)) {
                  setLoading(true);
                  await deleteProductApi(product.id);
                  toast.success(`Product "${formData.title}" deleted completely.`);
                  setLoading(false);
                  onClose();
                  if (onSaveSuccess) onSaveSuccess();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Delete Product
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
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
        </div>
      </form>
    </Modal>
  );
}
