import React, { useState, useEffect } from 'react';
import { useStoreSettings, defaultHeroSlides } from '../../context/StoreSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { placeOrderApi, fetchProductsApi } from '../../services/api';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Zap,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Shield,
  Truck,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  X,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';

const defaultProducts = [
  {
    id: 'p1',
    title: 'Royal Aroma Premium Rice 5kg',
    price: 115.00,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    badge: 'GROCERIES',
    rating: 4.9
  },
  {
    id: 'p2',
    title: 'SunGold Pure Vegetable Oil 5L',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    badge: 'COOKING',
    rating: 4.8
  },
  {
    id: 'p5',
    title: 'Milo Energy Cocoa Powder 800g',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    badge: 'BEVERAGE',
    rating: 5.0
  },
  {
    id: 'b1',
    title: 'Bel-Aqua Purified Water 12-Pack',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    badge: 'CHILLED',
    rating: 4.9
  }
];

export function LiveStorefrontPreview() {
  const { homepageSections, heroMedia, ticker, policies } = useStoreSettings();
  const { activeTheme, activeWallpaper, wallpaperEnabled, wallpaperOpacity } = useTheme();
  const [deviceView, setDeviceView] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('Akosua Mensah');
  const [momoNumber, setMomoNumber] = useState('0244123456');
  const [momoProvider, setMomoProvider] = useState('MTN Mobile Money');
  const [products, setProducts] = useState(defaultProducts);

  // 60s Carousel Engine
  const previewSlides = (heroMedia?.slides && heroMedia.slides.length >= 3) ? heroMedia.slides : defaultHeroSlides;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const rotationSeconds = heroMedia?.rotationInterval || 60;
  const [slideCountdown, setSlideCountdown] = useState(rotationSeconds);

  useEffect(() => {
    if (heroMedia?.autoRotate === false) return;
    setSlideCountdown(rotationSeconds);

    const timer = setInterval(() => {
      setSlideCountdown((prev) => {
        if (prev <= 1) {
          setCurrentSlideIndex((curr) => (curr + 1) % previewSlides.length);
          return rotationSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [heroMedia?.autoRotate, rotationSeconds, previewSlides.length, currentSlideIndex]);

  const activeSlide = previewSlides[currentSlideIndex] || previewSlides[0];

  useEffect(() => {
    async function load() {
      const data = await fetchProductsApi();
      if (data && data.length > 0) {
        setProducts(data.map(p => ({
          id: p.id,
          title: p.title,
          price: p.tiers?.[0]?.price || p.price || 50,
          image: p.image,
          badge: p.category?.split(' ')?.[0]?.toUpperCase() || 'ESSENTIAL',
          rating: p.rating || 4.9
        })));
      } else {
        try {
          const stored = localStorage.getItem('akuamarket_products');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProducts(parsed.map(p => ({
                id: p.id,
                title: p.title,
                price: p.tiers?.[0]?.price || p.price || 50,
                image: p.image,
                badge: p.category?.split(' ')?.[0]?.toUpperCase() || 'ESSENTIAL',
                rating: p.rating || 4.9
              })));
            }
          }
        } catch (e) {}
      }
    }
    load();
  }, []);


  const addToCart = (p) => {
    setCart(prev => [...prev, p]);
    toast.success(`Added ${p.title} to cart`);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!buyerName || !momoNumber) {
      toast.error('Please enter buyer name and MoMo phone number');
      return;
    }
    const total = cart.reduce((acc, c) => acc + c.price, 0);
    const orderData = {
      buyerName,
      location: 'Accra Metro',
      totalAmount: total,
      items: cart,
      momoNumber,
      momoProvider
    };
    const res = await placeOrderApi(orderData);
    toast.success(`Order #${res.orderId} placed. Paystack MoMo prompt sent to ${momoNumber}`);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const deviceFrameClasses = {
    desktop: 'w-full',
    tablet: 'max-w-2xl mx-auto border-x border-slate-800 shadow-2xl',
    mobile: 'max-w-sm mx-auto border border-slate-800 rounded-3xl overflow-hidden shadow-2xl'
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      
      {/* Viewport & Device Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span>Live D2C Storefront Shopping Preview</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time interactive storefront engine displaying active hero media, products, & Paystack MoMo integration.
          </p>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-end sm:self-auto">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deviceView === 'desktop'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deviceView === 'tablet'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" /> Tablet
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deviceView === 'mobile'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className={`transition-all duration-300 ${deviceFrameClasses[deviceView]}`}>
        <div
          className="rounded-3xl border border-slate-800 bg-slate-950/50 overflow-hidden shadow-2xl relative"
          style={{
            backgroundImage: wallpaperEnabled && activeWallpaper?.url && activeWallpaper.url !== 'none'
              ? `linear-gradient(to bottom, rgba(2, 6, 23, 0.45), rgba(2, 6, 23, 0.75)), url(${activeWallpaper.url})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        >
          
          {/* Section: Announcement Ticker */}
          {homepageSections.find(s => s.id === 'announcement')?.visible && (
            <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2 truncate">
                <span className="px-2 py-0.5 rounded-full bg-slate-950 text-emerald-400 text-[10px] uppercase font-bold flex-shrink-0">
                  {ticker.badge}
                </span>
                <span className="truncate">{ticker.text}</span>
              </div>
              <span className="hidden md:inline-block text-[10px] font-extrabold flex-shrink-0">
                HOURS: {policies.businessHours}
              </span>
            </div>
          )}

          {/* Storefront Header Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-md overflow-hidden">
                <img src="/factory_mall_logo.jpg" alt="Factory Mall Logo" className="w-full h-full object-cover rounded-[7px]" />
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                FACTORY<span className="text-emerald-400">MALL</span>
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              Supermarket & Shopping Mall
            </span>
          </div>

          {/* Section: Hero Media Multi-Slide Carousel */}
          {homepageSections.find(s => s.id === 'hero')?.visible && (

            <div className="relative min-h-[380px] md:min-h-[420px] flex items-center justify-center p-6 md:p-10 overflow-hidden group">
              
              {/* 60s Animated Progress Line */}
              {heroMedia?.autoRotate !== false && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30 overflow-hidden pointer-events-none">
                  <div
                    className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${((rotationSeconds - slideCountdown) / rotationSeconds) * 100}%` }}
                  />
                </div>
              )}

              {/* Background Video / Photo Canvas */}
              {activeSlide.type === 'video' && activeSlide.videoUrl ? (
                <video
                  key={activeSlide.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={activeSlide.posterUrl || undefined}
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 filter brightness-90 transition-opacity duration-500"
                >
                  {activeSlide.videoUrl && <source src={activeSlide.videoUrl} type="video/mp4" />}
                </video>
              ) : (
                <img
                  key={activeSlide.posterUrl || 'hero-img'}
                  src={activeSlide.posterUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'}
                  alt={activeSlide.headline}
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 transition-opacity duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30 z-10" />

              {/* In-Preview Next/Prev Buttons */}
              <button
                type="button"
                onClick={() => {
                  setCurrentSlideIndex((prev) => (prev - 1 + previewSlides.length) % previewSlides.length);
                  setSlideCountdown(rotationSeconds);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentSlideIndex((prev) => (prev + 1) % previewSlides.length);
                  setSlideCountdown(rotationSeconds);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Overlay Hero Text */}
              <div className="relative z-20 text-center max-w-2xl space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                    activeSlide.badgeColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : activeSlide.badgeColor === 'indigo'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : activeSlide.badgeColor === 'rose'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    <Zap className="w-3.5 h-3.5" /> {activeSlide.badge || 'Ghana Direct'}
                  </span>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>SLIDE {currentSlideIndex + 1}/3</span>
                    <span className="text-emerald-400">({slideCountdown}s)</span>
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                  {activeSlide.headline}
                </h1>
                
                <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto">
                  {activeSlide.subheadline || 'Direct from Ghana manufacturers & local farms. Delivered to your doorstep across Greater Accra in under 2 hours.'}
                </p>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <a
                    href="#products-preview"
                    className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 transform hover:scale-105 cursor-pointer"
                  >
                    <span>{activeSlide.ctaText || 'Shop Direct Catalog'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* 3 Slide Indicator Dots */}
                <div className="pt-2 flex items-center justify-center gap-2">
                  {previewSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentSlideIndex(idx);
                        setSlideCountdown(rotationSeconds);
                      }}
                      className={`transition-all rounded-full cursor-pointer ${
                        currentSlideIndex === idx
                          ? 'w-6 h-2 bg-amber-400 shadow-sm'
                          : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                      }`}
                      title={`Go to Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Section: Featured Direct Products */}
          {homepageSections.find(s => s.id === 'featured')?.visible && (
            <div id="products-preview" className="p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Featured Direct Products
                  </h3>
                  <p className="text-xs text-slate-400">Curated factory-fresh items ready for instant Mobile Money dispatch</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Min Order: GH₵{policies.minOrderAmount}
                </span>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map(p => (
                  <div
                    key={p.id}
                    className="group rounded-2xl p-3.5 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="h-44 rounded-xl overflow-hidden bg-slate-950 relative border border-slate-800/60">
                        <img
                          src={p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                          {p.badge}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {p.title}
                      </h4>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Wholesale Price</span>
                        <span className="text-sm font-black text-emerald-400">GH₵ {p.price.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => addToCart(p)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/10 transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Trust Badges */}
          {homepageSections.find(s => s.id === 'trust')?.visible && (
            <div className="p-6 bg-slate-900/40 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/60 flex flex-col items-center">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mb-2">
                  <Truck className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-bold text-white">Express 2-Hour Freight</h5>
                <p className="text-[11px] text-slate-400 mt-1">Same-day direct delivery across Accra & Tema</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/60 flex flex-col items-center">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mb-2">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-bold text-white">Paystack Mobile Money</h5>
                <p className="text-[11px] text-slate-400 mt-1">Instant MTN, Telecel & AT Money verification</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/60 flex flex-col items-center">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
                  <Shield className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-bold text-white">100% Quality Guarantee</h5>
                <p className="text-[11px] text-slate-400 mt-1">Factory certified & direct farm produce guarantee</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Floating Checkout Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-6 z-50 animate-bounce">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs md:text-sm shadow-2xl shadow-emerald-500/40 transition-all transform hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Checkout ({cart.length} items)</span>
            <span className="bg-slate-950 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-black">
              GH₵ {cart.reduce((a, c) => a + c.price, 0).toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* MoMo Checkout Modal Drawer */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-white shadow-2xl animate-fadeIn relative">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" /> Paystack Mobile Money Checkout
              </h3>
              <p className="text-xs text-slate-400">Simulate direct D2C customer checkout via Ghana Mobile Money</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Mobile Money Provider</label>
                <select
                  value={momoProvider}
                  onChange={(e) => setMomoProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="MTN Mobile Money">MTN Mobile Money (*170#)</option>
                  <option value="Telecel Cash">Telecel Cash (*110#)</option>
                  <option value="AT Money">AT Money (*110#)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">MoMo Phone Number</label>
                <div className="relative">
                  <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">Total Order Amount:</span>
                <span className="text-emerald-400 text-sm font-black">
                  GH₵ {cart.reduce((a, c) => a + c.price, 0).toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20"
                >
                  Send MoMo Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
