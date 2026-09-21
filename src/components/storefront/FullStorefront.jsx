import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  MapPin,
  Truck,
  ShieldCheck,
  Phone,
  CreditCard,
  Layers,
  ChevronDown,
  X,
  Plus,
  Minus,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Store,
  Tag,
  Clock,
  Filter,
  FileText,
  AlertOctagon,
  Package,
  Building2,
  Zap,
  Apple,
  Coffee,
  Tv,
  Utensils,
  Heart,
  Snowflake,
  Shirt,
  Paperclip,
  LayoutGrid,
  Bell,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  RefreshCw,
  Flame,
  TruckIcon
} from 'lucide-react';
import { fetchProducts, fetchCategories, placeMoMoOrder, trackOrderApi, saveRFQQuoteApi } from '../../api';
import { useStoreSettings, defaultHeroSlides } from '../../context/StoreSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'sonner';

export function FullStorefront({ onOpenAdmin }) {
  const { ticker, heroMedia, policies } = useStoreSettings();
  const { activeTheme, borderRadius } = useTheme();

  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedHub, setSelectedHub] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Central Accra Metro');
  const [selectedTiers, setSelectedTiers] = useState({}); // { [productId]: tierId }
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Hero Media 60s Carousel Engine
  const heroSlides = (heroMedia?.slides && heroMedia.slides.length >= 3) ? heroMedia.slides : defaultHeroSlides;
  const [currentHeroSlideIndex, setCurrentHeroSlideIndex] = useState(0);
  const rotationSeconds = heroMedia?.rotationInterval || 60;
  const [heroCountdown, setHeroCountdown] = useState(rotationSeconds);

  useEffect(() => {
    if (heroMedia?.autoRotate === false) return;
    setHeroCountdown(rotationSeconds);

    const timer = setInterval(() => {
      setHeroCountdown((prev) => {
        if (prev <= 1) {
          setCurrentHeroSlideIndex((curr) => (curr + 1) % heroSlides.length);
          return rotationSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [heroMedia?.autoRotate, rotationSeconds, heroSlides.length, currentHeroSlideIndex]);

  const activeHeroSlide = heroSlides[currentHeroSlideIndex] || heroSlides[0];

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Tracking State
  const [trackingId, setTrackingId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Checkout Form State
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [momoProvider, setMomoProvider] = useState('MTN Mobile Money');
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Load products and all categories from API or localStorage fallback
  useEffect(() => {
    async function loadData() {
      const [prodsData, catsData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      if (prodsData && prodsData.length > 0) {
        setProducts(prodsData);
      } else {
        try {
          const stored = localStorage.getItem('akuamarket_products');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProducts(parsed);
            }
          }
        } catch (e) {}
      }
      if (catsData && catsData.length > 0) {
        setCategoriesList(catsData);
      }
    }
    loadData();
  }, []);

  // Professional SVG Icon Resolver for Storefront Taxonomy
  const renderCategoryIcon = (name, className = "w-4 h-4") => {
    const n = (name || '').toLowerCase();
    if (n.includes('staple') || n.includes('rice') || n.includes('grocer')) return <Package className={className} />;
    if (n.includes('produce') || n.includes('fresh') || n.includes('vegetable')) return <Apple className={className} />;
    if (n.includes('beverage') || n.includes('drink') || n.includes('water')) return <Coffee className={className} />;
    if (n.includes('clean') || n.includes('house') || n.includes('detergent')) return <Sparkles className={className} />;
    if (n.includes('baby') || n.includes('infant') || n.includes('diaper')) return <Heart className={className} />;
    if (n.includes('snack') || n.includes('biscuit') || n.includes('candy') || n.includes('cookie')) return <ShoppingBag className={className} />;
    if (n.includes('frozen') || n.includes('meat') || n.includes('fish') || n.includes('chilled')) return <Snowflake className={className} />;
    if (n.includes('stationery') || n.includes('office') || n.includes('paper')) return <Paperclip className={className} />;
    if (n.includes('electronic') || n.includes('tech') || n.includes('tv')) return <Tv className={className} />;
    if (n.includes('health') || n.includes('beauty') || n.includes('personal') || n.includes('care')) return <ShieldCheck className={className} />;
    if (n.includes('home') || n.includes('kitchen') || n.includes('living') || n.includes('appliance')) return <Utensils className={className} />;
    if (n.includes('fashion') || n.includes('lifestyle') || n.includes('apparel')) return <Shirt className={className} />;
    if (n.includes('bakery') || n.includes('pastr') || n.includes('bread')) return <Coffee className={className} />;
    return <Layers className={className} />;
  };

  const fallbackCategories = [
    { name: "Groceries & Food Staples", hub: "Supermarket", count: 420, badge: "Supermarket Essential", subcategories: ["Rice & Grains", "Cooking Oils & Fats", "Pasta & Noodles", "Spices & Seasoning"], banner_img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" },
    { name: "Fresh Produce & Bakery", hub: "Supermarket", count: 210, badge: "Daily Fresh", subcategories: ["Fresh Fruits", "Vegetables", "Artisanal Bread"], banner_img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80" },
    { name: "Beverages & Cold Drinks", hub: "Supermarket", count: 310, badge: "Chilled & Bulk", subcategories: ["Juices & Smoothies", "Mineral Water", "Energy & Soda Drinks"], banner_img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80" },
    { name: "Household & Cleaning", hub: "Supermarket", count: 240, badge: "Hygiene Pack", subcategories: ["Laundry Detergents", "Toilet Papers", "Surface Cleaners"], banner_img: "https://images.unsplash.com/photo-1584555613497-9ecf7e3d0a4a?auto=format&fit=crop&w=800&q=80" },
    { name: "Baby & Infant Essentials", hub: "Supermarket", count: 155, badge: "Gentle Care", subcategories: ["Diapers & Wipes", "Baby Food & Formula"], banner_img: "https://images.unsplash.com/photo-1604917019112-7d8f8d7c5c9f?auto=format&fit=crop&w=800&q=80" },
    { name: "Snacks & Confectionery", hub: "Supermarket", count: 195, badge: "Sweet Treats", subcategories: ["Biscuits & Crackers", "Chocolates & Candy", "Chips"], banner_img: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80" },
    { name: "Frozen & Chilled Foods", hub: "Supermarket", count: 120, badge: "Cold Chain Logistics", subcategories: ["Frozen Poultry & Meat", "Seafood & Fish"], banner_img: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?auto=format&fit=crop&w=800&q=80" },
    { name: "Stationery & Office Supplies", hub: "Mall", count: 280, badge: "Wholesale Superstore", subcategories: ["A4 Copy Paper", "Writing & Pens", "Notebooks"], banner_img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80" },
    { name: "Electronics & Tech Mall", hub: "Mall", count: 185, badge: "Mall Outlet", subcategories: ["Smart 4K TVs", "Commercial Audio", "Kitchen Appliances"], banner_img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80" },
    { name: "Health & Personal Care", hub: "Mall", count: 220, badge: "Self Care", subcategories: ["Body Wash & Soap", "Haircare", "Oral Care"], banner_img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80" },
    { name: "Home & Kitchen Living", hub: "Mall", count: 160, badge: "Home Style", subcategories: ["Cookware & Sets", "Food Storage", "Bedding"], banner_img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" }
  ];

  const activeCategoriesSource = categoriesList.length > 0 ? categoriesList : fallbackCategories;

  const filteredCategories = activeCategoriesSource.filter(c =>
    selectedHub === 'All' || c.hub === selectedHub
  );

  const categoryPills = [
    { name: 'All', label: 'All Catalog', count: products.length },
    ...filteredCategories.map(c => ({
      name: c.name,
      label: c.name,
      hub: c.hub,
      count: c.count || products.filter(p => p.category === c.name).length,
      badge: c.badge
    }))
  ];

  // Helper for tier price
  const getProductTier = (product) => {
    const tierId = selectedTiers[product.id] || (product.tiers && product.tiers[0]?.id) || 'unit';
    const tier = product.tiers?.find(t => t.id === tierId) || {
      id: 'unit',
      label: 'Single Unit',
      price: product.price || 100,
      retailPrice: (product.price || 100) * 1.25,
      savings: ''
    };
    return tier;
  };

  const handleSelectTier = (productId, tierId) => {
    setSelectedTiers(prev => ({ ...prev, [productId]: tierId }));
  };

  const addToCart = (product) => {
    const tier = getProductTier(product);
    const cartItemKey = `${product.id}_${tier.id}`;

    setCart(prev => {
      const existing = prev.find(item => item.key === cartItemKey);
      if (existing) {
        return prev.map(item =>
          item.key === cartItemKey ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          key: cartItemKey,
          productId: product.id,
          productTitle: product.title,
          image: product.image,
          tierId: tier.id,
          tierLabel: tier.label,
          price: tier.price,
          retailPrice: tier.retailPrice,
          qty: 1
        }
      ];
    });

    toast.success(`Added ${product.title} (${tier.label}) to cart!`);
    setIsCartOpen(true);
  };

  const updateCartQty = (key, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.key === key) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartRetailVal = cart.reduce((acc, item) => acc + (item.retailPrice || item.price * 1.2) * item.qty, 0);
  const totalSavings = Math.max(0, cartRetailVal - cartSubtotal);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      toast.error('Please enter name and Mobile Money phone number');
      return;
    }

    const orderPayload = {
      buyerName: customerName,
      location: `${selectedLocation} - ${deliveryAddress || 'Direct Delivery'}`,
      totalAmount: cartSubtotal,
      items: cart.map(item => ({
        title: `${item.productTitle} (${item.tierLabel})`,
        quantity: item.qty,
        unit_price: item.price
      })),
      momoNumber: customerPhone,
      momoProvider
    };

    const res = await placeMoMoOrder(orderPayload);
    const orderId = res.orderId || `GH-WH-${Math.floor(1000 + Math.random() * 9000)}`;
    setPlacedOrderId(orderId);
    setCheckoutStep('success');
    setCart([]);
    toast.success(`Order #${orderId} confirmed. Paystack MoMo prompt sent to ${customerPhone}`);
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackingId) return;
    const cleanId = trackingId.replace('#', '').trim();
    const result = await trackOrderApi(cleanId);
    if (result) {
      setTrackedOrder(result);
    } else {
      setTrackedOrder({
        order_number: cleanId,
        status: 'processing',
        total_amount: 2150,
        customer_name: customerName || 'Valued Customer',
        courier_name: 'Kofi Mensah (Express Motorbike)',
        created_at: 'Just now'
      });
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesHub = selectedHub === 'All' || p.hub === selectedHub;
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHub && matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 relative z-10 overflow-x-hidden">
      
      {/* Emergency Maintenance Alert Banner */}
      {policies?.maintenanceMode && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-center gap-2 shadow-lg border-b border-amber-600">
          <AlertOctagon className="w-4 h-4 text-slate-950 animate-bounce" />
          <span>SYSTEM NOTICE: {policies.maintenanceMessage || 'Palace Factory Superstore is currently undergoing inventory sync. Orders resume shortly.'}</span>
        </div>
      )}

      {/* Palace Top Gold Gradient Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500" />

      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-amber-400 px-4 py-2 text-xs font-bold border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase flex-shrink-0">
              {ticker?.badge || 'PALACE ONLINE'}
            </span>
            <span className="truncate text-slate-300">
              {(ticker?.text || 'FOR YOU, FOR YOURS, FOR GHANA | SAME-DAY EXPRESS FREIGHT DELIVERY ACROSS ACCRA & TEMA').replace(/⚡|📢|🎉|🏬|🛒|🏢|📦/g, '')}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-[11px] bg-slate-900 px-3 py-1 rounded-full text-amber-400 font-black border border-amber-500/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedLocation}</span>
            </div>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>D2C Admin Portal</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Palace Header */}
      <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-2xl border-b border-slate-800 px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setSelectedHub('All'); setSelectedCategory('All'); }}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-400 p-0.5 shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-all overflow-hidden">
              <img src="/factory_mall_logo.jpg" alt="Factory Mall Shopping Cart Logo" className="w-full h-full object-cover rounded-[14px]" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight leading-none flex items-center gap-1.5">
                PALACE <span className="text-amber-400">MALL</span>
              </h1>
              <p className="text-[10px] text-amber-400 uppercase font-extrabold tracking-widest mt-1">
                For you, for yours, for Ghana
              </p>
            </div>
          </div>

          {/* Search Bar with Barcode Scanner */}
          <div className="flex items-center flex-1 max-w-xl mx-2 sm:mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="w-full pl-10 pr-12 py-2.5 text-xs rounded-full bg-slate-900/90 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => toast.info('Barcode Scanner Active! Point camera at product barcode 📷')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                title="Scan Barcode"
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Auth & Cart Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => toast.info('Sign In Modal')}
              className="hidden sm:inline text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => toast.success('Welcome to Palace P-Club Rewards! 🎉')}
              className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 transition-all active:scale-95 cursor-pointer"
            >
              Sign Up
            </button>

            {/* Glowing Cart Button Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-white font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  {cart.reduce((a, c) => a + c.qty, 0)}
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-400 font-extrabold">GH₵ {cartSubtotal.toFixed(0)}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Top Circular Category Bubbles Carousel */}
      <section className="bg-black border-b border-slate-800/80 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-2">
            {[
              { name: "Grocery & Food", count: 420 },
              { name: "Home & Living", count: 160 },
              { name: "Sport & Gym", count: 130 },
              { name: "Electronics & Tech", count: 185 },
              { name: "Furniture", count: 140 },
              { name: "Luggage", count: 120 },
              { name: "Toys", count: 95 },
              { name: "Detergent & Care", count: 160 },
              { name: "Hardware & Tools", count: 110 }
            ].map((cat, idx) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(isSelected ? 'All' : cat.name);
                    const el = document.getElementById('products-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer min-w-[72px]"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 transition-all flex items-center justify-center p-2.5 shadow-xl group-hover:scale-110 ${
                    isSelected
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 ring-4 ring-amber-400/20'
                      : 'bg-slate-900 border-slate-800 text-slate-300 group-hover:border-amber-400 group-hover:text-amber-400'
                  }`}>
                    {renderCategoryIcon(cat.name, "w-7 h-7 sm:w-8 sm:h-8")}
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-300 group-hover:text-amber-400 transition-colors text-center line-clamp-1 max-w-[80px]">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Palace Hero Showcase Multi-Slide Promo Canvas */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-black group">
          <div className="relative h-64 sm:h-96 w-full overflow-hidden">
            <img
              src={activeHeroSlide.posterUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80'}
              alt={activeHeroSlide.headline || 'Palace Quality Promo'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex flex-col justify-center p-6 sm:p-12">
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider w-max mb-3 shadow-md">
                {activeHeroSlide.badge || 'QUALITY OILS • For a Healthier Tomorrow'}
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white max-w-lg leading-tight tracking-tight drop-shadow-md">
                {activeHeroSlide.headline || 'Pure & Natural • Healthy Living • Trusted Quality'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 line-clamp-2 drop-shadow">
                {activeHeroSlide.subheadline || 'Explore top-tier imported oils, fresh cuts, and daily grocery staples delivered across Accra.'}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="#doorbuster-section"
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xl active:scale-95 transition-all cursor-pointer"
                >
                  Shop Doorbuster Deals →
                </a>
              </div>
            </div>

            {/* Left/Right Carousel Arrows */}
            <button
              onClick={() => setCurrentHeroSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-950 border border-slate-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentHeroSlideIndex((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-950 border border-slate-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="adinkra-pattern-border" />
        </div>
      </section>

      {/* P-Club Doorbuster Section with Live Countdown Timers */}
      <section id="doorbuster-section" className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-3xl bg-slate-950/90 border border-amber-500/30 p-5 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider">
                  Palace Exclusive Flash Sale
                </span>
                <span className="text-xs text-slate-400 font-mono">18th - 21st September</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                P-Club Doorbuster
              </h3>
            </div>

            {/* Live Gold Countdown Timer Boxes */}
            <div className="flex items-center gap-2 font-mono">
              <div className="countdown-box">
                <span className="text-lg font-black text-amber-400 block">00</span>
                <span className="text-[9px] text-slate-400 uppercase font-extrabold">DAYS</span>
              </div>
              <span className="text-amber-400 font-black text-lg">:</span>
              <div className="countdown-box">
                <span className="text-lg font-black text-amber-400 block">03</span>
                <span className="text-[9px] text-slate-400 uppercase font-extrabold">HRS</span>
              </div>
              <span className="text-amber-400 font-black text-lg">:</span>
              <div className="countdown-box">
                <span className="text-lg font-black text-amber-400 block">07</span>
                <span className="text-[9px] text-slate-400 uppercase font-extrabold">MINS</span>
              </div>
              <span className="text-amber-400 font-black text-lg">:</span>
              <div className="countdown-box">
                <span className="text-lg font-black text-amber-400 block">42</span>
                <span className="text-[9px] text-slate-400 uppercase font-extrabold">SECS</span>
              </div>

              <a href="#products-section" className="ml-3 text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                View All →
              </a>
            </div>
          </div>

          {/* Doorbuster Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.slice(0, 6).map((product, idx) => {
              const activeTier = getProductTier(product);
              const ribbonPrices = ["GH₵ 34.99", "GH₵ 27.99", "GH₵ 17.99", "GH₵ 120.99", "GH₵ 99.99", "GH₵ 24.99"];
              const ribbonPrice = ribbonPrices[idx % ribbonPrices.length];

              return (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 p-2.5 transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden"
                >
                  <div className="space-y-2">
                    {/* Palace White Image Container with Diagonal Gold Ribbon */}
                    <div className="relative h-36 sm:h-40 rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center">
                      <div className="price-ribbon-gold">{ribbonPrice}</div>
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-slate-950/80 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer shadow-md"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites[product.id] ? 'text-rose-400 fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    <h4 className="text-xs font-black text-white uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h4>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-black text-amber-400">
                      GH₵ {activeTier.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categorized Showcase 1: Meat, Poultry & Fish */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <div className="relative h-44 sm:h-56 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80"
              alt="Meat, Poultry & Fish"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex flex-col justify-center p-6 sm:p-10">
              <span className="text-amber-400 font-mono font-bold text-xs uppercase tracking-widest mb-1">FRESH OFF THE FLIGHT</span>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Meat, Poultry & Fish</h3>
              <p className="text-xs text-slate-300 mt-1">Good Food, better life!!! Direct cold chain delivery.</p>
            </div>
          </div>
          <div className="adinkra-pattern-border" />

          <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.slice(0, 6).map((product, idx) => {
              const activeTier = getProductTier(product);
              return (
                <div key={product.id} className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 p-2.5 transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden">
                  <div className="space-y-2">
                    <div className="relative h-36 sm:h-40 rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center">
                      <div className="price-ribbon-gold">GH₵ {(activeTier.price * 1.15).toFixed(2)}</div>
                      <img src={product.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-slate-950/80 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer">
                        <Heart className={`w-3.5 h-3.5 ${favorites[product.id] ? 'text-rose-400 fill-rose-500' : ''}`} />
                      </button>
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h4>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-black text-amber-400">GH₵ {activeTier.price.toFixed(2)}</span>
                    <button onClick={() => addToCart(product)} className="w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center justify-center shadow-md cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main id="products-section" className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Category Filters Pill Strip */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categoryPills.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.name === 'All' ? (
                  <LayoutGrid className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />
                ) : (
                  <span className="flex-shrink-0">{renderCategoryIcon(cat.name, "w-3.5 h-3.5")}</span>
                )}
                <span>{cat.label}</span>
                {cat.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    selectedCategory === cat.name ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <b className="text-amber-400">{filteredProducts.length}</b> Superstore Items
          </span>
        </div>

        {/* Product Cards Grid with Palace Style Ribbons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((product, idx) => {
            const activeTier = getProductTier(product);
            const ribbonPrices = ["GH₵ 34.99", "GH₵ 27.99", "GH₵ 17.99", "GH₵ 120.99", "GH₵ 99.99", "GH₵ 24.99"];
            const ribbonPrice = ribbonPrices[idx % ribbonPrices.length];

            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 p-2.5 transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="relative h-36 sm:h-40 rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center">
                    <div className="price-ribbon-gold">{ribbonPrice}</div>
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-slate-950/80 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer shadow-md"
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorites[product.id] ? 'text-rose-400 fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  <h4 className="text-xs font-black text-white uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                    {product.title}
                  </h4>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-amber-400">
                    GH₵ {activeTier.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Slide-out Cart & MoMo Express Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between z-50 animate-fadeIn">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base text-white">Your Wholesale Cart</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold">
                  {cart.reduce((a, c) => a + c.qty, 0)} Items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {checkoutStep === 'cart' ? (
                cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
                    <p className="text-sm text-slate-400 font-bold">Your cart is currently empty</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.key} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                        <img src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'} alt={item.productTitle} className="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.productTitle}</p>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold block">{item.tierLabel}</span>
                          <span className="text-xs font-black text-amber-400">GH₵ {(item.price * item.qty).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                          <button
                            onClick={() => updateCartQty(item.key, -1)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono px-1">{item.qty}</span>
                          <button
                            onClick={() => updateCartQty(item.key, 1)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : checkoutStep === 'checkout' ? (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Order Summary</span>
                    <p className="font-bold text-white">Subtotal ({cart.length} SKUs): <span className="text-emerald-400">GH₵ {cartSubtotal.toFixed(2)}</span></p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Akosua Mensah"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Money Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="024XXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Money Provider</label>
                    <select
                      value={momoProvider}
                      onChange={(e) => setMomoProvider(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="MTN Mobile Money">MTN Mobile Money (MoMo)</option>
                      <option value="Telecel Cash">Telecel Cash</option>
                      <option value="AT Money">AT Money (AirtelTigo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Delivery Address / Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Osu Oxford Street near Shell"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    Authorize GH₵ {cartSubtotal.toFixed(2)} via Paystack MoMo
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">Order Confirmed!</h4>
                    <p className="text-xs text-slate-400 mt-1">Reference: <span className="font-mono text-emerald-400 font-bold">#{placedOrderId}</span></p>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    Paystack MoMo prompt sent to <b>{customerPhone}</b>. Please approve PIN prompt on your handset.
                  </p>
                  <button
                    onClick={() => { setCheckoutStep('cart'); setIsCartOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {checkoutStep === 'cart' && cart.length > 0 && (
              <div className="p-5 border-t border-slate-800 space-y-3 bg-slate-950">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Subtotal:</span>
                  <span className="font-black text-emerald-400 text-sm font-mono">GH₵ {cartSubtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  Proceed to MoMo Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTrackingOpen(false)} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white text-base">Freight Order Tracker</h3>
              </div>
              <button onClick={() => setIsTrackingOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. GH-WH-8831)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg cursor-pointer"
              >
                Track
              </button>
            </form>

            {trackedOrder && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Order Reference</span>
                    <p className="text-sm font-mono font-black text-emerald-400">#{trackedOrder.order_number || trackedOrder.id}</p>
                  </div>
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                    {trackedOrder.status?.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-300 pt-2 border-t border-slate-800">
                  <p><b>Courier Assigned:</b> {trackedOrder.courier_name || 'Kofi Mensah (Motorbike Express)'}</p>
                  <p><b>Order Total:</b> GH₵ {Number(trackedOrder.total_amount || 0).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Quick-Action Button (Desktop) */}
      <div className="hidden md:flex fixed bottom-6 left-6 z-40">
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 border border-emerald-500/40 text-slate-100 font-bold text-xs shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Switch to D2C Admin Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Cute Mobile Floating Dock Navigation Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 rounded-full bg-slate-900/95 border border-emerald-400/40 backdrop-blur-2xl shadow-2xl p-1.5 flex items-center justify-around text-slate-300">
        <button
          onClick={() => {
            setSelectedCategory('All');
            setSelectedHub('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            selectedCategory === 'All' && selectedHub === 'All'
              ? 'text-emerald-400 font-black bg-emerald-500/20 border border-emerald-500/40'
              : 'hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          <span className="text-[9px] font-bold">Shop</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('categories-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all hover:text-white cursor-pointer"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-[9px] font-bold">Categories</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black shadow-lg shadow-emerald-400/30 active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[9px] font-black">Cart ({cart.reduce((a, c) => a + c.qty, 0)})</span>
        </button>

        <button
          onClick={() => setIsTrackingOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all hover:text-white cursor-pointer"
        >
          <Truck className="w-4 h-4 text-amber-400" />
          <span className="text-[9px] font-bold">Track</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all text-slate-300 hover:text-emerald-400 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-bold">Admin</span>
        </button>
      </div>

    </div>
  );
}
