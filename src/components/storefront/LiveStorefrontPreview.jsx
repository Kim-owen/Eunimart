import React, { useState } from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { placeOrderApi } from '../../services/api';
import { toast } from 'sonner';
import { ShoppingBag, Star, Zap, CheckCircle2, Phone, CreditCard, ArrowRight, Video, Play, Volume2, Shield, Truck } from 'lucide-react';

export function LiveStorefrontPreview() {
  const { homepageSections, heroMedia, ticker, policies } = useStoreSettings();
  const { activeTheme } = useTheme();
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('Akosua Mensah');
  const [momoNumber, setMomoNumber] = useState('0244123456');

  const products = [
    { id: 'p1', title: 'Royal Aroma Premium Rice 5kg', price: 115.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', badge: 'GROCERIES' },
    { id: 'p2', title: 'SunGold Pure Vegetable Oil 5L', price: 145.00, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80', badge: 'COOKING' },
    { id: 'p5', title: 'Milo Energy Cocoa Powder 800g', price: 68.00, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80', badge: 'BEVERAGE' },
    { id: 'b1', title: 'Bel-Aqua Purified Water 12-Pack', price: 24.00, image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80', badge: 'CHILLED' }
  ];

  const addToCart = (p) => {
    setCart(prev => [...prev, p]);
    toast.success(`Added ${p.title} to cart`);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const total = cart.reduce((acc, c) => acc + c.price, 0);
    const orderData = {
      buyerName,
      location: 'Accra Metro',
      totalAmount: total,
      items: cart,
      momoNumber,
      momoProvider: 'MTN Mobile Money'
    };
    const res = await placeOrderApi(orderData);
    toast.success(`🎉 Order Placed! Order ID: #${res.orderId}. Paystack MoMo prompt sent to ${momoNumber}`);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      {/* Live Store Banner Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Live Storefront Shopping Preview 🛍️
          </h2>
          <p className="text-xs text-slate-400">Interactive live preview reflecting active brand themes, hero video background, and layout.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400">Live D2C Store Engine</span>
        </div>
      </div>

      {/* Main Storefront Frame */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Section: Announcement Bar */}
        {homepageSections.find(s => s.id === 'announcement')?.visible && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-slate-950 text-emerald-400 text-[10px] uppercase">
                {ticker.badge}
              </span>
              <span>{ticker.text}</span>
            </div>
            <span className="hidden md:block text-[10px] font-bold">BUSINESS HOURS: {policies.businessHours}</span>
          </div>
        )}

        {/* Section: Hero Media Showcase */}
        {homepageSections.find(s => s.id === 'hero')?.visible && (
          <div className="relative min-h-[380px] md:min-h-[440px] flex items-center justify-center p-8 overflow-hidden">
            {/* Background Video or Image Poster */}
            {heroMedia.type === 'video' ? (
              <video
                autoPlay={heroMedia.autoplay}
                muted={heroMedia.muted}
                loop={heroMedia.loop}
                playsInline
                poster={heroMedia.posterUrl}
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 filter brightness-90"
              >
                <source src={heroMedia.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={heroMedia.posterUrl}
                alt="Poster"
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />

            {/* Overlay Content */}
            <div className="relative z-20 text-center max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" /> {heroMedia.badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                {heroMedia.headline}
              </h1>
              <p className="text-xs md:text-sm text-slate-300">
                Fresh supermarket groceries, food staples, cold beverages, & electronics delivered in under 2 hours.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <a
                  href="#products"
                  className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  Shop Direct Catalog <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Section: Featured Products Grid */}
        {homepageSections.find(s => s.id === 'featured')?.visible && (
          <div id="products" className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Featured Direct Products</h3>
                <p className="text-xs text-slate-400">Curated factory items ready for instant Mobile Money dispatch</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Min Order: GH₵{policies.minOrderAmount}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map(p => (
                <div key={p.id} className="rounded-2xl p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="h-40 rounded-xl overflow-hidden bg-slate-950 mb-3 relative">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded bg-black/70 text-emerald-400">
                        {p.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2">{p.title}</h4>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-400">GH₵ {p.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(p)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Trust Value Props */}
        {homepageSections.find(s => s.id === 'trust')?.visible && (
          <div className="p-6 bg-slate-900/60 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <Truck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-white">Express 2-Hour Freight</h5>
              <p className="text-[11px] text-slate-400 mt-1">Same day delivery across Greater Accra & Tema</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <CreditCard className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-white">Paystack Mobile Money</h5>
              <p className="text-[11px] text-slate-400 mt-1">Instant MTN, Telecel & AT Money verification</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <Shield className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-white">100% Quality Guarantee</h5>
              <p className="text-[11px] text-slate-400 mt-1">Direct from Ghana producers to your doorstep</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Checkout Drawer Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-2xl shadow-emerald-500/40 transition-all transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Checkout ({cart.length} items)</span>
            <span className="bg-slate-950 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
              GH₵ {cart.reduce((a, c) => a + c.price, 0).toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-white">
            <h3 className="text-lg font-bold">Instant Mobile Money Checkout</h3>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Customer Full Name</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">MoMo Phone Number (MTN / Telecel)</label>
              <input
                type="text"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400"
              />
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl text-xs flex justify-between font-bold">
              <span>Total Payable Amount:</span>
              <span className="text-emerald-400">GH₵ {cart.reduce((a, c) => a + c.price, 0).toFixed(2)}</span>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg"
              >
                Pay via MoMo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
