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
  ChevronRight
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

  // Load products and all categories from API
  useEffect(() => {
    async function loadData() {
      const [prodsData, catsData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      if (prodsData && prodsData.length > 0) {
        setProducts(prodsData);
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

  // Safe backward-compatibility fallback ensuring zero unhandled ReferenceErrors during hot-reloads
  const getCategoryEmoji = () => null;

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
    { name: "Home & Kitchen Living", hub: "Mall", count: 160, badge: "Home Style", subcategories: ["Cookware & Sets", "Food Storage", "Bedding"], banner_img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    { name: "Fashion & Lifestyle Mall", hub: "Mall", count: 140, badge: "Mall Fashion", subcategories: ["African Print Apparel", "Footwear", "Bags"], banner_img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80" }
  ];

  const activeCategoriesSource = categoriesList.length > 0 ? categoriesList : fallbackCategories;

  // Filter categories according to selected Department Hub
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
      badge: c.badge,
      subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
      banner_img: c.banner_img
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

  // Submit Order to API
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

  // Track Order Handler
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackingId) return;
    const cleanId = trackingId.replace('#', '').trim();
    const result = await trackOrderApi(cleanId);
    if (result) {
      setTrackedOrder(result);
    } else {
      // Fallback display
      setTrackedOrder({
        order_number: cleanId,
        status: 'processing',
        total_amount: 2150,
        customer_name: 'Akua Customer',
        courier_name: 'Kofi Mensah (Dispatch Rider)',
        created_at: 'Just now'
      });
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesHub = selectedHub === 'All' || p.hub === selectedHub;
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHub && matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950/35 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 relative z-10">
      
      {/* Maintenance Mode Emergency Alert Banner if Active */}
      {policies?.maintenanceMode && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-center gap-2 shadow-lg border-b border-amber-600">
          <AlertOctagon className="w-4 h-4 text-slate-950 animate-bounce" />
          <span>SYSTEM NOTICE: {policies.maintenanceMessage || 'AkuaMarket is currently undergoing scheduled inventory audit. Orders resume shortly.'}</span>
        </div>
      )}

      {/* Top Announcement Bar with Live Delivery Location & Admin Switcher */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-slate-950 px-4 py-2 text-xs font-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[10px] uppercase font-bold flex-shrink-0">
              {ticker?.badge || 'FACTORY DIRECT'}
            </span>
            <span className="truncate">
              {(ticker?.text || 'SAME-DAY FREIGHT DELIVERY ACROSS GREATER ACCRA & TEMA | USE CODE "AKUA2026"').replace(/⚡|📢|🎉|🏬|🛒|🏢|📦/g, '')}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Delivery Location Picker */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] bg-slate-950/20 px-2.5 py-1 rounded-full text-slate-950 font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedLocation}</span>
            </div>

            {/* DIRECT JUMP TO ADMIN BUTTON */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-emerald-400 hover:bg-slate-900 border border-slate-800 text-[11px] font-black transition-all shadow-md active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>D2C Admin Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Storefront Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedHub('All'); setSelectedCategory('All'); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400 font-black">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none">
                AKUA <span className="text-amber-400">MARKET</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">
                Supermarket & Mall Hub
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rice, vegetable oil, Milo, 4K TVs, A4 copy paper..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Track Freight</span>
            </button>

            <button
              onClick={() => setIsRfqOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Pro-Forma RFQ</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black">
                  {cart.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Department Classification Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                setSelectedHub('All');
                setSelectedCategory('All');
              }}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                selectedHub === 'All'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>All Superstore Catalog</span>
            </button>
            <button
              onClick={() => {
                setSelectedHub('Supermarket');
                setSelectedCategory('All');
              }}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                selectedHub === 'Supermarket'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Supermarket Express (Groceries & Fresh)</span>
            </button>
            <button
              onClick={() => {
                setSelectedHub('Mall');
                setSelectedCategory('All');
              }}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                selectedHub === 'Mall'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Online Shopping Mall (Tech & Office)</span>
            </button>
          </div>

          <span className="text-xs font-bold text-slate-400 hidden xl:flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Minimum Order: GH₵ 20.00 • Bulk Rates Available</span>
          </span>
        </div>
      </div>

      {/* Hero Showcase Multi-Slide 60s Carousel */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 py-12 md:py-16 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Call-To-Action Column */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                activeHeroSlide.badgeColor === 'emerald'
                  ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                  : activeHeroSlide.badgeColor === 'indigo'
                  ? 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30'
                  : activeHeroSlide.badgeColor === 'rose'
                  ? 'bg-rose-400/10 text-rose-400 border-rose-400/30'
                  : 'bg-amber-400/10 text-amber-400 border-amber-400/30'
              }`}>
                <Sparkles className="w-3.5 h-3.5" /> {activeHeroSlide.badge || 'Direct Ghana Producer Wholesale Rates'}
              </span>

              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>SLIDE {currentHeroSlideIndex + 1} OF {heroSlides.length}</span>
                <span className="text-emerald-400 ml-1">({heroCountdown}s)</span>
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight transition-all duration-300">
              {activeHeroSlide.headline || 'Fresh Supermarket Groceries & Factory Goods at Wholesale Prices'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl transition-all duration-300">
              {activeHeroSlide.subheadline || 'Skip supermarket markups. Buy single items, wholesale cartons, or distributor pallets with instant Paystack Mobile Money settlement and 2-hour Accra freight dispatch.'}
            </p>

            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <a
                href="#products-section"
                className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xl shadow-amber-400/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>{activeHeroSlide.ctaText || 'Shop Wholesale Catalog'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenAdmin}
                className="px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{activeHeroSlide.ctaSecondaryText || 'Open Admin Portal'}</span>
              </button>
            </div>

            {/* Slide Indicator Dots & Navigation Arrows */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-full border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentHeroSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
                    setHeroCountdown(rotationSeconds);
                  }}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-2">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentHeroSlideIndex(idx);
                        setHeroCountdown(rotationSeconds);
                      }}
                      className={`transition-all rounded-full cursor-pointer ${
                        currentHeroSlideIndex === idx
                          ? 'w-6 h-2 bg-amber-400 shadow-sm'
                          : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      title={`Go to Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
                    setHeroCountdown(rotationSeconds);
                  }}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Auto-cycles every {rotationSeconds}s
              </span>
            </div>
          </div>

          {/* Right Media Frame Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              
              {/* 60s Linear Progress Line */}
              {heroMedia?.autoRotate !== false && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30 overflow-hidden pointer-events-none">
                  <div
                    className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${((rotationSeconds - heroCountdown) / rotationSeconds) * 100}%` }}
                  />
                </div>
              )}

              {/* Video or Image Canvas */}
              {activeHeroSlide.type === 'video' && activeHeroSlide.videoUrl ? (
                <video
                  key={activeHeroSlide.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={activeHeroSlide.posterUrl || ''}
                  src={activeHeroSlide.videoUrl}
                  className="w-full h-80 sm:h-96 object-cover transition-opacity duration-500"
                />
              ) : activeHeroSlide.posterUrl ? (
                <img
                  key={activeHeroSlide.posterUrl}
                  src={activeHeroSlide.posterUrl}
                  alt={activeHeroSlide.headline || 'AkuaMarket Showcase'}
                  className="w-full h-80 sm:h-96 object-cover transition-opacity duration-500"
                />
              ) : (
                <div className="w-full h-80 sm:h-96 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-center border border-slate-800/80">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-4">
                    <Store className="w-8 h-8" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/20">
                    {activeHeroSlide.badge || 'AKUA MARKET DIRECT'}
                  </span>
                  <h3 className="text-xl font-black text-white max-w-sm">
                    {activeHeroSlide.headline || 'Ghana Wholesale & Supermarket Direct'}
                  </h3>
                </div>
              )}

              {/* Dynamic Gradient Overlay */}
              <div
                className="absolute inset-0 transition-opacity pointer-events-none"
                style={{
                  background: activeHeroSlide.tint === 'emerald'
                    ? 'linear-gradient(to top, rgba(2, 44, 34, 0.95), rgba(4, 120, 87, 0.25), transparent)'
                    : activeHeroSlide.tint === 'amber'
                    ? 'linear-gradient(to top, rgba(69, 26, 3, 0.95), rgba(217, 119, 6, 0.25), transparent)'
                    : activeHeroSlide.tint === 'indigo'
                    ? 'linear-gradient(to top, rgba(30, 27, 75, 0.95), rgba(79, 70, 229, 0.25), transparent)'
                    : 'linear-gradient(to top, rgba(2, 6, 23, 0.95), transparent)',
                  opacity: (activeHeroSlide.opacity || 65) / 100
                }}
              />

              {/* In-Frame Next/Prev Arrows on Hover */}
              <button
                type="button"
                onClick={() => {
                  setCurrentHeroSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
                  setHeroCountdown(rotationSeconds);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
                  setHeroCountdown(rotationSeconds);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* In-Frame Bottom Product Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between z-20">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Featured Direct Wholesale</span>
                  <p className="text-xs font-bold text-white">Royal Aroma Fragrant Rice 5kg</p>
                  <p className="text-xs text-amber-400 font-black">GH₵ 115.00 <span className="text-[10px] text-slate-400 line-through">GH₵ 135.00</span></p>
                </div>
                <button
                  onClick={() => addToCart(products[0] || { id: 'p1', title: 'Royal Aroma Rice 5kg', price: 115, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' })}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Departments Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                Ghana Wholesale Taxonomy
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {filteredCategories.length} Departments Available
              </span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Browse Wholesale Departments
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any category to filter factory pricing, carton rates, and pallet bulk discounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'All'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              View All ({products.length})
            </button>
          </div>
        </div>

        {/* Categories Showcase Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredCategories.map(cat => {
            const isSelected = selectedCategory === cat.name;
            const count = cat.count || products.filter(p => p.category === cat.name).length;

            return (
              <button
                key={cat.id || cat.name}
                onClick={() => {
                  setSelectedCategory(isSelected ? 'All' : cat.name);
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative group rounded-2xl p-3.5 text-left border transition-all flex flex-col justify-between overflow-hidden min-h-[135px] ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-amber-400/10'
                    : 'bg-slate-900/90 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Background Banner Preview if present */}
                {cat.banner_img && (
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity">
                    <img src={cat.banner_img} alt={cat.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                  </div>
                )}

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-200 shadow-sm">
                      {renderCategoryIcon(cat.name, "w-4 h-4")}
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono ${
                      cat.hub === 'Supermarket'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {cat.hub}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h4>
                </div>

                <div className="relative z-10 pt-2 border-t border-slate-800/60 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-slate-400 font-bold">
                    {count} {count === 1 ? 'Product' : 'Items'}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Catalog Section */}
      <main id="products-section" className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        
        {/* Category Filters Pill Strip */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categoryPills.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  selectedCategory === cat.name
                    ? 'bg-slate-800 text-amber-400 border border-amber-400/40 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.name === 'All' ? (
                  <LayoutGrid className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                ) : (
                  <span className="text-amber-400 flex-shrink-0">{renderCategoryIcon(cat.name, "w-3.5 h-3.5")}</span>
                )}
                <span>{cat.label}</span>
                {cat.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    selectedCategory === cat.name ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <b className="text-white">{filteredProducts.length}</b> Factory Products
          </span>
        </div>

        {/* Product Cards Grid with Wholesale Tier Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const activeTier = getProductTier(product);
            const tiers = product.tiers || [
              { id: 'unit', label: 'Single Unit', price: product.price || 100, retailPrice: (product.price || 100) * 1.25, savings: '' }
            ];

            return (
              <div
                key={product.id}
                className="group rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-400/40 p-4 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  {/* Image Container */}
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/60">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <span className="absolute top-3 left-3 z-10 text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/30">
                      {product.category}
                    </span>
                    {product.isHot && (
                      <span className="absolute top-3 right-3 z-10 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        HOT SELLER
                      </span>
                    )}
                  </div>

                  {/* Title & Size */}
                  <div>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      {product.factory || 'Ghana Direct Producer'}
                    </span>
                    <h3 className="text-sm font-extrabold text-white leading-snug line-clamp-2 mt-0.5 group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  {/* Pricing Tiers Radio Toggle */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Select Quantity Tier:
                    </span>
                    <div className="space-y-1">
                      {tiers.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSelectTier(product.id, t.id)}
                          className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                            activeTier.id === t.id
                              ? 'bg-amber-400/10 text-amber-400 border-amber-400/50 font-bold shadow-sm'
                              : 'bg-slate-800/50 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate pr-2">{t.label}</span>
                          <span className="font-mono font-black flex-shrink-0">
                            GH₵ {t.price.toFixed(2)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Display & Add Button */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-amber-400">
                        GH₵ {activeTier.price.toFixed(2)}
                      </span>
                      {activeTier.retailPrice && (
                        <span className="text-[10px] text-slate-500 line-through">
                          GH₵ {activeTier.retailPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {activeTier.savings && (
                      <span className="text-[10px] font-black text-emerald-400 block">
                        {activeTier.savings}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-400/10 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between z-50 animate-fadeIn">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">Wholesale Shopping Cart</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-black">
                  {cart.reduce((a, c) => a + c.qty, 0)} Items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List or Checkout Form */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                      <p className="text-sm font-bold text-slate-400">Your wholesale cart is empty.</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                      >
                        Explore Products
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div
                          key={item.key}
                          className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3.5"
                        >
                          <img
                            src={item.image}
                            alt={item.productTitle}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{item.productTitle}</p>
                            <p className="text-[10px] text-amber-400 font-bold">{item.tierLabel}</p>
                            <p className="text-xs font-mono font-black text-slate-200 mt-1">
                              GH₵ {(item.price * item.qty).toFixed(2)}
                            </p>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-700">
                            <button
                              onClick={() => updateCartQty(item.key, -1)}
                              className="p-1 rounded text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-white px-1.5">{item.qty}</span>
                            <button
                              onClick={() => updateCartQty(item.key, 1)}
                              className="p-1 rounded text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {totalSavings > 0 && (
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>Direct Wholesale Savings:</span>
                          </span>
                          <span className="text-emerald-400 font-black">GH₵ {totalSavings.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'checkout' && (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" /> Paystack Mobile Money Checkout
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Your Full Name / Store Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Kwame Mensah Supermarket"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">MoMo Provider</label>
                    <select
                      value={momoProvider}
                      onChange={(e) => setMomoProvider(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="MTN Mobile Money">MTN Mobile Money (*170#)</option>
                      <option value="Telecel Cash">Telecel Cash (*110#)</option>
                      <option value="AT Money">AT Money (*110#)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">MoMo Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="024 XXX XXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Delivery Address / Landmark</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Spintex Road, near Shell Station"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Total Payable via MoMo:</span>
                    <span className="text-amber-400 text-sm font-black">
                      GH₵ {cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20"
                  >
                    Confirm & Send MoMo Prompt
                  </button>
                </form>
              )}

              {checkoutStep === 'success' && (
                <div className="py-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-white">Order Successfully Placed!</h4>
                  <p className="text-xs text-slate-300">
                    A Paystack Mobile Money verification prompt has been sent to your phone.
                  </p>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm text-emerald-400 font-black">
                    #{placedOrderId}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    This order is now live in the <b>AkuaMarket D2C Admin Pipeline</b> for rider dispatch.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => { setCheckoutStep('cart'); setIsCartOpen(false); }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setTrackingId(placedOrderId);
                        setIsTrackingOpen(true);
                        setCheckoutStep('cart');
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
                    >
                      Track Delivery
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {checkoutStep === 'cart' && cart.length > 0 && (
              <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-extrabold text-white">GH₵ {cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Delivery ({selectedLocation}):</span>
                  <span className="font-extrabold text-emerald-400">FREE EXPRESS</span>
                </div>
                <div className="flex items-center justify-between text-sm font-black pt-2 border-t border-slate-800">
                  <span className="text-white">Total Amount:</span>
                  <span className="text-amber-400 text-base">GH₵ {cartSubtotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Mobile Money Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-white shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => { setIsTrackingOpen(false); setTrackedOrder(null); }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" /> Live Freight Tracking Engine
              </h3>
              <p className="text-xs text-slate-400">Check live status of your wholesale or express delivery order</p>
            </div>

            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. GH-WH-8831)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg"
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

      {/* Floating Bottom Quick-Action: Switch to D2C Admin */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 border border-emerald-500/40 text-slate-100 font-bold text-xs shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Switch to D2C Admin Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
}
