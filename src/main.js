// Akua Market - Complete Wholesale Hub Engine with Online Mall & Supermarket Categories, Mega Menu & Freight Tracker
import { placeMoMoOrder, trackOrderApi, updateOrderStatusApi, saveRFQQuoteApi } from './api.js';

// --- Department Hub Classification ---
const DEPARTMENT_HUBS = [
  { id: "All", name: "All Superstore", icon: "fa-store", color: "#f7c119" },
  { id: "Supermarket", name: "Supermarket Express", icon: "fa-cart-shopping", color: "#10b981", badge: "GROCERIES & FRESH" },
  { id: "Mall", name: "Online Shopping Mall", icon: "fa-building-columns", color: "#3b82f6", badge: "TECH, FASHION & HOME" }
];

// --- Comprehensive Supermarket & Mall Categories Database ---
const CATEGORIES = [
  // Supermarket Departments
  {
    name: "Groceries & Food Staples",
    hub: "Supermarket",
    icon: "fa-basket-shopping",
    count: 420,
    badge: "Supermarket Essential",
    subcategories: ["Rice & Grains", "Cooking Oils & Fats", "Pasta & Noodles", "Spices & Seasoning", "Flour & Sugar"],
    bannerImg: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Fresh Produce & Bakery",
    hub: "Supermarket",
    icon: "fa-carrot",
    count: 210,
    badge: "Daily Fresh",
    subcategories: ["Fresh Fruits", "Vegetables", "Artisanal Bread", "Dairy & Eggs"],
    bannerImg: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Beverages & Cold Drinks",
    hub: "Supermarket",
    icon: "fa-wine-bottle",
    count: 310,
    badge: "Chilled & Bulk",
    subcategories: ["Juices & Smoothies", "Mineral Water", "Tea & Coffee", "Energy & Soda Drinks", "Malt Drinks"],
    bannerImg: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Household & Cleaning",
    hub: "Supermarket",
    icon: "fa-broom",
    count: 240,
    badge: "Hygiene Pack",
    subcategories: ["Laundry Detergents", "Toilet & Tissue Papers", "Surface Cleaners", "Dishwashing & Soaps"],
    bannerImg: "https://images.unsplash.com/photo-1584555613497-9ecf7e3d0a4a?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Baby & Infant Essentials",
    hub: "Supermarket",
    icon: "fa-baby",
    count: 155,
    badge: "Gentle Care",
    subcategories: ["Diapers & Wipes", "Baby Food & Formula", "Skincare & Bath"],
    bannerImg: "https://images.unsplash.com/photo-1604917019112-7d8f8d7c5c9f?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Snacks & Confectionery",
    hub: "Supermarket",
    icon: "fa-cookie-bite",
    count: 195,
    badge: "Sweet Treats",
    subcategories: ["Biscuits & Crackers", "Chocolates & Candy", "Nuts & Dried Fruits", "Chips & Popcorn"],
    bannerImg: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Frozen & Chilled Foods",
    hub: "Supermarket",
    icon: "fa-snowflake",
    count: 120,
    badge: "Cold Chain Logistics",
    subcategories: ["Frozen Poultry & Meat", "Seafood & Fish", "Ice Cream & Desserts"],
    bannerImg: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?auto=format&fit=crop&w=800&q=80"
  },

  // Online Mall Departments
  {
    name: "Stationery & Office Supplies",
    hub: "Mall",
    icon: "fa-pen-ruler",
    count: 280,
    badge: "Palace Superstore Wholesale",
    subcategories: ["A4 Copy Paper", "Writing & Pens", "Notebooks & Books", "Calculators", "Art & Craft"],
    bannerImg: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Electronics & Tech Mall",
    hub: "Mall",
    icon: "fa-tv",
    count: 185,
    badge: "Mall Outlet",
    subcategories: ["Smart 4K TVs", "Commercial Audio", "Kitchen Appliances", "Mobile Accessories"],
    bannerImg: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Health & Personal Care",
    hub: "Mall",
    icon: "fa-sparkles",
    count: 220,
    badge: "Self Care",
    subcategories: ["Body Wash & Soap", "Haircare & Oils", "Oral Care", "Skincare & Lotions"],
    bannerImg: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Home & Kitchen Living",
    hub: "Mall",
    icon: "fa-couch",
    count: 160,
    badge: "Home Style",
    subcategories: ["Cookware & Sets", "Food Storage Containers", "Bedding & Towels"],
    bannerImg: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Fashion & Lifestyle Mall",
    hub: "Mall",
    icon: "fa-shirt",
    count: 140,
    badge: "Mall Fashion",
    subcategories: ["African Print Apparel", "Footwear & Sandals", "Bags & Luggage"],
    bannerImg: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80"
  }
];

// --- Product Database with Supermarket & Mall Categorization & Subcategories ---
const PRODUCTS = [
  // Stationery Category Items (Inspired by Palace Superstores)
  {
    id: "s1",
    title: "Chamex Premium A4 Copy Paper 80GSM",
    category: "Stationery & Office Supplies",
    subcategory: "A4 Copy Paper",
    hub: "Mall",
    size: "5 Reams Box (2,500 Sheets)",
    factory: "Sylvamo International Paper",
    stock: 520,
    rating: 4.9,
    reviews: 184,
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Ream (500 Sheets)", price: 48.00, retailPrice: 58.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (5 Reams)", price: 220.00, retailPrice: 290.00, unitCount: 5, savings: "SAVE 24%" },
      { id: "pallet", label: "Factory Pallet (50 Boxes)", price: 9800.00, retailPrice: 14500.00, unitCount: 50, savings: "SAVE 32% (FACTORY RATE)" }
    ]
  },
  {
    id: "s2",
    title: "Bic Cristal Medium Point Blue Ballpoint Pens",
    category: "Stationery & Office Supplies",
    subcategory: "Writing & Pens",
    hub: "Mall",
    size: "Box of 50 Pens",
    factory: "BIC Ghana Factory Direct",
    stock: 890,
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1585336261026-9136355599f8?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Pack of 10 Pens", price: 20.00, retailPrice: 25.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (50 Pens)", price: 85.00, retailPrice: 125.00, unitCount: 5, savings: "SAVE 32%" },
      { id: "pallet", label: "Factory Carton (20 Boxes / 1000 Pens)", price: 1550.00, retailPrice: 2500.00, unitCount: 20, savings: "SAVE 38% (FACTORY RATE)" }
    ]
  },
  {
    id: "s3",
    title: "Hardcover A4 Feint 200 Pages Exercise Books",
    category: "Stationery & Office Supplies",
    subcategory: "Notebooks & Books",
    hub: "Mall",
    size: "Pack of 10 Books",
    factory: "Speedy Press Ghana",
    stock: 640,
    rating: 4.8,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    isHot: false,
    tiers: [
      { id: "unit", label: "Single Book", price: 12.00, retailPrice: 15.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Pack of 10 Books", price: 95.00, retailPrice: 150.00, unitCount: 10, savings: "SAVE 36%" },
      { id: "pallet", label: "Factory Bundle (100 Books)", price: 850.00, retailPrice: 1500.00, unitCount: 100, savings: "SAVE 43% (FACTORY RATE)" }
    ]
  },
  {
    id: "s4",
    title: "Casio FX-991ES Plus II Non-Programmable Scientific Calculator",
    category: "Stationery & Office Supplies",
    subcategory: "Calculators",
    hub: "Mall",
    size: "Pack of 2 Calculators",
    factory: "Casio Electronics Outlet",
    stock: 150,
    rating: 5.0,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Calculator", price: 210.00, retailPrice: 250.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Pack of 2 Calculators", price: 380.00, retailPrice: 500.00, unitCount: 2, savings: "SAVE 24%" },
      { id: "pallet", label: "Factory Carton (20 Calculators)", price: 3450.00, retailPrice: 5000.00, unitCount: 20, savings: "SAVE 31% (FACTORY RATE)" }
    ]
  },
  {
    id: "s5",
    title: "Faber-Castell Multimark Waterproof Permanent Markers",
    category: "Stationery & Office Supplies",
    subcategory: "Art & Craft",
    hub: "Mall",
    size: "Box of 12 Assorted",
    factory: "Faber-Castell Direct",
    stock: 410,
    rating: 4.7,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
    isHot: false,
    tiers: [
      { id: "unit", label: "Pack of 4 Markers", price: 26.00, retailPrice: 32.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (12 Markers)", price: 64.00, retailPrice: 96.00, unitCount: 12, savings: "SAVE 33%" },
      { id: "pallet", label: "Factory Case (120 Markers)", price: 580.00, retailPrice: 960.00, unitCount: 120, savings: "SAVE 39% (FACTORY RATE)" }
    ]
  },

  // Groceries & Food Staples (Supermarket)
  {
    id: "p1",
    title: "Royal Aroma Premium Long Grain Fragrant Rice",
    category: "Groceries & Food Staples",
    subcategory: "Rice & Grains",
    hub: "Supermarket",
    size: "5 KG Bag",
    factory: "Ghana Agro Mills Direct",
    stock: 450,
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Bag", price: 115.00, retailPrice: 135.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Carton (10 Bags)", price: 920.00, retailPrice: 1350.00, unitCount: 10, savings: "SAVE 20%" },
      { id: "pallet", label: "Factory Pallet (50 Bags)", price: 4100.00, retailPrice: 6750.00, unitCount: 50, savings: "SAVE 32% (FACTORY RATE)" }
    ]
  },
  {
    id: "p2",
    title: "SunGold Pure Refined Vegetable Cooking Oil",
    category: "Groceries & Food Staples",
    subcategory: "Cooking Oils & Fats",
    hub: "Supermarket",
    size: "5 Litres Container",
    factory: "Wilmar Africa Factory Direct",
    stock: 320,
    rating: 4.8,
    reviews: 164,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Container", price: 145.00, retailPrice: 170.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Carton Box (4 Packs)", price: 520.00, retailPrice: 680.00, unitCount: 4, savings: "SAVE 18%" },
      { id: "pallet", label: "Factory Bulk (20 Cartons)", price: 2350.00, retailPrice: 3400.00, unitCount: 20, savings: "SAVE 30% (FACTORY RATE)" }
    ]
  },
  {
    id: "p10",
    title: "Gino Max Double Concentrated Tomato Paste",
    category: "Groceries & Food Staples",
    subcategory: "Spices & Seasoning",
    hub: "Supermarket",
    size: "Box of 50 Sachets (70g)",
    factory: "GB Foods Ghana Factory",
    stock: 710,
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Pack of 10 Sachets", price: 18.00, retailPrice: 22.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (50 Sachets)", price: 78.00, retailPrice: 110.00, unitCount: 5, savings: "SAVE 29%" },
      { id: "pallet", label: "Factory Master Crate (20 Boxes)", price: 1420.00, retailPrice: 2200.00, unitCount: 20, savings: "SAVE 35% (FACTORY RATE)" }
    ]
  },
  {
    id: "p12",
    title: "Indomie Super Pack Instant Noodles Chicken",
    category: "Groceries & Food Staples",
    subcategory: "Pasta & Noodles",
    hub: "Supermarket",
    size: "Carton Box of 40 Packs (120g)",
    factory: "De United Foods Ghana",
    stock: 950,
    rating: 4.9,
    reviews: 580,
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Pack of 5 Indomie", price: 22.00, retailPrice: 28.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Carton (40 Packs)", price: 155.00, retailPrice: 224.00, unitCount: 40, savings: "SAVE 30%" },
      { id: "pallet", label: "Factory Pallet (60 Cartons)", price: 8900.00, retailPrice: 13440.00, unitCount: 60, savings: "SAVE 34% (FACTORY RATE)" }
    ]
  },

  // Fresh Produce & Bakery (Supermarket)
  {
    id: "f1",
    title: "Ghanaian Local Fresh Sweet Golden Bananas",
    category: "Fresh Produce & Bakery",
    subcategory: "Fresh Fruits",
    hub: "Supermarket",
    size: "Comb Bundle (approx 3kg)",
    factory: "Volta Green Agro Farms",
    stock: 310,
    rating: 4.8,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    isHot: false,
    tiers: [
      { id: "unit", label: "Single Comb", price: 25.00, retailPrice: 32.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Farm Crate (5 Combs / 15kg)", price: 110.00, retailPrice: 160.00, unitCount: 5, savings: "SAVE 31%" },
      { id: "pallet", label: "Wholesale Pickup (25 Crates)", price: 2450.00, retailPrice: 4000.00, unitCount: 25, savings: "SAVE 38% (FACTORY RATE)" }
    ]
  },
  {
    id: "f2",
    title: "Golden Crust Butter Loaf Bread",
    category: "Fresh Produce & Bakery",
    subcategory: "Artisanal Bread",
    hub: "Supermarket",
    size: "Pack of 4 Large Loaves",
    factory: "Accra Central Bakery Direct",
    stock: 220,
    rating: 4.9,
    reviews: 130,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Loaf", price: 18.00, retailPrice: 22.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Bakery Tray (6 Loaves)", price: 96.00, retailPrice: 132.00, unitCount: 6, savings: "SAVE 27%" },
      { id: "pallet", label: "Commercial Crate (30 Loaves)", price: 450.00, retailPrice: 660.00, unitCount: 30, savings: "SAVE 32% (FACTORY RATE)" }
    ]
  },

  // Beverages & Cold Drinks (Supermarket)
  {
    id: "p5",
    title: "Milo Energy Cocoa Food Drink Powder",
    category: "Beverages & Cold Drinks",
    subcategory: "Tea & Coffee",
    hub: "Supermarket",
    size: "800g Refill Tin",
    factory: "Nestlé Ghana Direct",
    stock: 500,
    rating: 4.9,
    reviews: 420,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Tin", price: 68.00, retailPrice: 82.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Carton Case (12 Tins)", price: 720.00, retailPrice: 984.00, unitCount: 12, savings: "SAVE 20%" },
      { id: "pallet", label: "Factory Pallet (40 Cases)", price: 2150.00, retailPrice: 3280.00, unitCount: 40, savings: "SAVE 34% (FACTORY RATE)" }
    ]
  },
  {
    id: "b1",
    title: "Bel-Aqua Purified Natural Mineral Water",
    category: "Beverages & Cold Drinks",
    subcategory: "Mineral Water",
    hub: "Supermarket",
    size: "Pack of 12 Bottles (750ml)",
    factory: "Blow Chem Industries Ghana",
    stock: 1200,
    rating: 5.0,
    reviews: 640,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Pack (12 Bottles)", price: 24.00, retailPrice: 30.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Bundle (5 Packs / 60 Bottles)", price: 105.00, retailPrice: 150.00, unitCount: 5, savings: "SAVE 30%" },
      { id: "pallet", label: "Factory Truckload (50 Bundles)", price: 4800.00, retailPrice: 7500.00, unitCount: 50, savings: "SAVE 36% (FACTORY RATE)" }
    ]
  },
  {
    id: "b2",
    title: "Don Simon 100% Pure Premium Orange Juice",
    category: "Beverages & Cold Drinks",
    subcategory: "Juices & Smoothies",
    hub: "Supermarket",
    size: "1 Litre Tetra Pack",
    factory: "J. Garcia Carrion Outlet",
    stock: 480,
    rating: 4.8,
    reviews: 190,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80",
    isHot: false,
    tiers: [
      { id: "unit", label: "Single Pack", price: 28.00, retailPrice: 35.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Carton Case (12 Packs)", price: 300.00, retailPrice: 420.00, unitCount: 12, savings: "SAVE 28%" },
      { id: "pallet", label: "Factory Pallet (40 Cases)", price: 9500.00, retailPrice: 14000.00, unitCount: 40, savings: "SAVE 32% (FACTORY RATE)" }
    ]
  },

  // Household & Cleaning (Supermarket)
  {
    id: "p3",
    title: "SoftCare Ultra Soft Double Layer Toilet Tissue",
    category: "Household & Cleaning",
    subcategory: "Toilet & Tissue Papers",
    hub: "Supermarket",
    size: "12 Rolls Pack",
    factory: "Sunda International Ghana",
    stock: 600,
    rating: 4.7,
    reviews: 125,
    image: "https://images.unsplash.com/photo-1584555613497-9ecf7e3d0a4a?auto=format&fit=crop&w=800&q=80",
    isHot: false,
    tiers: [
      { id: "unit", label: "Single Pack (12 Rolls)", price: 52.00, retailPrice: 65.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Bale (10 Packs)", price: 420.00, retailPrice: 650.00, unitCount: 10, savings: "SAVE 22%" },
      { id: "pallet", label: "Factory Pallet (50 Bales)", price: 1850.00, retailPrice: 3250.00, unitCount: 50, savings: "SAVE 35% (FACTORY RATE)" }
    ]
  },
  {
    id: "h1",
    title: "Omo Multi-Active Laundry Washing Powder Detergent",
    category: "Household & Cleaning",
    subcategory: "Laundry Detergents",
    hub: "Supermarket",
    size: "2 KG Bucket / Pack",
    factory: "Unilever Ghana Factory Direct",
    stock: 430,
    rating: 4.9,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Pack (2kg)", price: 42.00, retailPrice: 52.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (6 Packs)", price: 225.00, retailPrice: 312.00, unitCount: 6, savings: "SAVE 28%" },
      { id: "pallet", label: "Factory Pallet (30 Boxes)", price: 6200.00, retailPrice: 9360.00, unitCount: 30, savings: "SAVE 34% (FACTORY RATE)" }
    ]
  },

  // Baby & Infant Essentials (Supermarket)
  {
    id: "p4",
    title: "BabySoft Premium Elastic Comfort Diapers",
    category: "Baby & Infant Essentials",
    subcategory: "Diapers & Wipes",
    hub: "Supermarket",
    size: "Size 4 · 44 Pcs",
    factory: "BabyCare Ghana Factory",
    stock: 280,
    rating: 4.9,
    reviews: 310,
    image: "https://images.unsplash.com/photo-1604917019112-7d8f8d7c5c9f?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Pack", price: 128.00, retailPrice: 155.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (6 Packs)", price: 680.00, retailPrice: 930.00, unitCount: 6, savings: "SAVE 21%" },
      { id: "pallet", label: "Factory Pallet (30 Boxes)", price: 3150.00, retailPrice: 4650.00, unitCount: 30, savings: "SAVE 32% (FACTORY RATE)" }
    ]
  },
  {
    id: "ba1",
    title: "Nestlé Cerelac Infant Cereal Wheat & Milk 400g",
    category: "Baby & Infant Essentials",
    subcategory: "Baby Food & Formula",
    hub: "Supermarket",
    size: "400g Tin",
    factory: "Nestlé Ghana Direct",
    stock: 390,
    rating: 4.9,
    reviews: 180,
    image: "https://images.unsplash.com/photo-1598043652876-0f9c2d1b091f?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Tin", price: 46.00, retailPrice: 56.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (12 Tins)", price: 490.00, retailPrice: 672.00, unitCount: 12, savings: "SAVE 27%" },
      { id: "pallet", label: "Factory Pallet (40 Boxes)", price: 18400.00, retailPrice: 26880.00, unitCount: 40, savings: "SAVE 31% (FACTORY RATE)" }
    ]
  },

  // Snacks & Confectionery (Supermarket)
  {
    id: "sn1",
    title: "McVitie's Original Digestive Whole Wheat Biscuits",
    category: "Snacks & Confectionery",
    subcategory: "Biscuits & Crackers",
    hub: "Supermarket",
    size: "Box of 24 Packs (200g)",
    factory: "pladis Global Ghana",
    stock: 620,
    rating: 4.8,
    reviews: 155,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
    isHot: false,
    tiers: [
      { id: "unit", label: "Pack of 3 Biscuits", price: 24.00, retailPrice: 30.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (24 Packs)", price: 175.00, retailPrice: 240.00, unitCount: 24, savings: "SAVE 27%" },
      { id: "pallet", label: "Factory Pallet (50 Boxes)", price: 8200.00, retailPrice: 12000.00, unitCount: 50, savings: "SAVE 31% (FACTORY RATE)" }
    ]
  },
  {
    id: "sn2",
    title: "Golden Tree Kingsbite Premium Milk Chocolate Box",
    category: "Snacks & Confectionery",
    subcategory: "Chocolates & Candy",
    hub: "Supermarket",
    size: "Box of 12 Bars (100g)",
    factory: "Cocoa Processing Company (CPC) Tema",
    stock: 450,
    rating: 5.0,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Bar (100g)", price: 16.00, retailPrice: 20.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (12 Bars)", price: 160.00, retailPrice: 240.00, unitCount: 12, savings: "SAVE 33%" },
      { id: "pallet", label: "Factory Pallet (40 Boxes)", price: 5800.00, retailPrice: 9600.00, unitCount: 40, savings: "SAVE 39% (FACTORY RATE)" }
    ]
  },

  // Frozen & Chilled Foods (Supermarket)
  {
    id: "fr1",
    title: "Frozen Grade A Prime Whole Chicken Box",
    category: "Frozen & Chilled Foods",
    subcategory: "Frozen Poultry & Meat",
    hub: "Supermarket",
    size: "Wholesale Box (10 Birds / 12kg)",
    factory: "ColdStore Logistics Tema Port",
    stock: 180,
    rating: 4.8,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Bird (1.2kg)", price: 45.00, retailPrice: 55.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Cold Box (10 Birds)", price: 390.00, retailPrice: 550.00, unitCount: 10, savings: "SAVE 29%" },
      { id: "pallet", label: "Reefer Pallet (30 Boxes)", price: 10800.00, retailPrice: 16500.00, unitCount: 30, savings: "SAVE 34% (FACTORY RATE)" }
    ]
  },

  // Electronics & Tech Mall (Mall)
  {
    id: "p7",
    title: "Smart 4K Ultra HD Commercial Display TV 55\"",
    category: "Electronics & Tech Mall",
    subcategory: "Smart 4K TVs",
    hub: "Mall",
    size: "55 Inch Display",
    factory: "Hisense Ghana Factory Outlet",
    stock: 45,
    rating: 4.9,
    reviews: 74,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single TV Unit", price: 3850.00, retailPrice: 4500.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Crate (3 Units)", price: 10600.00, retailPrice: 13500.00, unitCount: 3, savings: "SAVE 21%" },
      { id: "pallet", label: "Factory Distributor Lot (10 Units)", price: 32500.00, retailPrice: 45000.00, unitCount: 10, savings: "SAVE 28% (FACTORY RATE)" }
    ]
  },
  {
    id: "e1",
    title: "Nasco Digital Stainless Microwave Oven 20L",
    category: "Electronics & Tech Mall",
    subcategory: "Kitchen Appliances",
    hub: "Mall",
    size: "20 Litres Capacity",
    factory: "Electromart Ghana Direct",
    stock: 85,
    rating: 4.7,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80",
    isHot: false,
    tiers: [
      { id: "unit", label: "Single Microwave", price: 850.00, retailPrice: 1050.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Master Box (4 Units)", price: 3100.00, retailPrice: 4200.00, unitCount: 4, savings: "SAVE 26%" },
      { id: "pallet", label: "Factory Pallet (20 Units)", price: 14500.00, retailPrice: 21000.00, unitCount: 20, savings: "SAVE 31% (FACTORY RATE)" }
    ]
  },

  // Health & Personal Care (Mall)
  {
    id: "hp1",
    title: "Geisha Herbal Glow Natural Beauty Bar Soap",
    category: "Health & Personal Care",
    subcategory: "Body Wash & Soap",
    hub: "Mall",
    size: "Box of 36 Soaps (225g)",
    factory: "Unilever Ghana Factory Direct",
    stock: 580,
    rating: 4.8,
    reviews: 290,
    image: "https://images.unsplash.com/photo-1607006482602-76ca7bfac553?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Pack of 3 Soaps", price: 28.00, retailPrice: 36.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (36 Soaps)", price: 290.00, retailPrice: 432.00, unitCount: 36, savings: "SAVE 32%" },
      { id: "pallet", label: "Factory Pallet (40 Boxes)", price: 10500.00, retailPrice: 17280.00, unitCount: 40, savings: "SAVE 39% (FACTORY RATE)" }
    ]
  },
  {
    id: "hp2",
    title: "Pepsodent Triple Protection Toothpaste Family Pack",
    category: "Health & Personal Care",
    subcategory: "Oral Care",
    hub: "Mall",
    size: "Box of 24 Tubes (175g)",
    factory: "Unilever Ghana Factory Direct",
    stock: 640,
    rating: 4.9,
    reviews: 310,
    image: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=800&q=80",
    isHot: true,
    tiers: [
      { id: "unit", label: "Single Tube", price: 16.00, retailPrice: 20.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Wholesale Box (24 Tubes)", price: 320.00, retailPrice: 480.00, unitCount: 24, savings: "SAVE 33%" },
      { id: "pallet", label: "Factory Pallet (50 Boxes)", price: 14800.00, retailPrice: 24000.00, unitCount: 50, savings: "SAVE 38% (FACTORY RATE)" }
    ]
  },

  // Home & Kitchen Living (Mall)
  {
    id: "hk1",
    title: "Tefal Non-Stick Cookware Set 7-Piece Premium",
    category: "Home & Kitchen Living",
    subcategory: "Cookware & Sets",
    hub: "Mall",
    size: "7 Pieces Set Box",
    factory: "Palace Superstore Outlet",
    stock: 95,
    rating: 4.9,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    isHot: false,
    tiers: [
      { id: "unit", label: "Single 7-Piece Set", price: 680.00, retailPrice: 850.00, unitCount: 1, savings: "" },
      { id: "carton", label: "Master Box (4 Sets)", price: 2450.00, retailPrice: 3400.00, unitCount: 4, savings: "SAVE 28%" },
      { id: "pallet", label: "Factory Lot (20 Sets)", price: 11500.00, retailPrice: 17000.00, unitCount: 20, savings: "SAVE 32% (FACTORY RATE)" }
    ]
  }
];

const HERO_SLIDES = [
  {
    tag: "ONLINE SUPERMARKET & MALL HUB",
    title: "Shop Supermarket & Mall Essentials.<br><span class='highlight'>Direct Factory Wholesale.</span>",
    description: "Groceries, Beverages, Household Cleaners, Electronics & Palace Superstore Stationery delivered across Ghana.",
    cta: "EXPLORE SUPERSTORE DEPARTMENTS",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
  },
  {
    tag: "SUPERMARKET GROCERY EXPRESS",
    title: "Rice, Cooking Oils & Beverages <br><span class='highlight'>At Wholesale Prices</span>",
    description: "Royal Aroma Rice, SunGold Oil, Nestlé Milo, Bel-Aqua Water & Gino Tomato Paste direct from factories.",
    cta: "SHOP GROCERY EXPRESS",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80"
  },
  {
    tag: "STATIONERY & MALL OUTLET",
    title: "Palace Superstore Paper & Pens <br><span class='highlight'>Direct Distributor Hub</span>",
    description: "Chamex A4 Paper reams, Bic Pens, Hardcover Notebooks & Casio Calculators at factory wholesale rates.",
    cta: "SHOP MALL STATIONERY",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=80"
  }
];

const POPULAR_LOCATIONS = [
  "Greater Accra", "Tema", "Adenta", "Cantonments", "Spintex Road", "East Legon", "Kumasi Central", "Takoradi"
];

const FACTORY_DEPOTS = [
  { id: "depot1", name: "Accra Central Depot", area: "Greater Accra", top: "45%", left: "48%", eta: "Same-Day Freight" },
  { id: "depot2", name: "Tema Port Logistics Warehouse", area: "Tema", top: "52%", left: "58%", eta: "Same-Day Freight" },
  { id: "depot3", name: "Kumasi Commercial Wholesale Depot", area: "Kumasi Central", top: "35%", left: "38%", eta: "Next-Day Freight" },
  { id: "depot4", name: "Takoradi Harbor Distribution Hub", area: "Takoradi", top: "68%", left: "28%", eta: "1-2 Days Freight" },
  { id: "depot5", name: "Tamale Northern Warehouse", area: "Tamale", top: "18%", left: "42%", eta: "2 Days Freight" }
];

const INITIAL_SUPPLIER_ORDERS = [
  { id: "GH-WH-9482", buyer: "Kwame & Sons Supermarket", location: "Greater Accra", total: 4620.00, items: "5x Royal Aroma Cartons", status: "In Transit", date: "2026-08-26" },
  { id: "GH-WH-8831", buyer: "East Legon Mart", location: "East Legon", total: 2150.00, items: "2x SunGold Oil Cartons", status: "Factory Processing", date: "2026-08-26" },
  { id: "GH-WH-7210", buyer: "Asante Wholesale Ltd", location: "Kumasi Central", total: 10600.00, items: "1x Commercial Display TV Crate", status: "Delivered", date: "2026-08-25" }
];

// App State
const state = {
  theme: localStorage.getItem('akua_theme') || 'dark',
  activeView: 'storefront',
  selectedHub: 'All', // 'All', 'Supermarket', 'Mall'
  category: 'All',
  subcategory: 'All',
  searchQuery: '',
  catSearchSidebar: '',
  sortBy: 'default', // 'default', 'price-low', 'price-high', 'rating'
  viewMode: 'grid', // 'grid' or 'list'
  activeTab: 'All',
  priceRange: 15000,
  inStockOnly: false,
  selectedBrand: 'All',
  megaMenuOpen: false,
  selectedLocation: localStorage.getItem('akua_location') || 'Greater Accra',
  locationModalOpen: !localStorage.getItem('akua_location'),
  mapModalOpen: false,
  rfqModalOpen: false,
  checkoutModal: { open: false, step: 1, method: 'momo', phone: '', provider: 'mtn', orderId: '', buyerName: '' },
  trackingModal: { open: false, trackingId: 'GH-WH-9482', activeOrder: INITIAL_SUPPLIER_ORDERS[0] },
  selectedTiers: {},
  cart: JSON.parse(localStorage.getItem('akua_cart') || '{}'),
  wishlist: new Set(JSON.parse(localStorage.getItem('akua_wishlist') || '[]')),
  supplierOrders: INITIAL_SUPPLIER_ORDERS,
  currentSlideIndex: 0,
  cartOpen: false,
  quickViewProduct: null,
  authModal: { open: false, mode: 'login' },
  barcodeScannerOpen: false
};

// Theme init
document.documentElement.className = state.theme;

const formatPrice = (amount) => `GH₵ ${Number(amount).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function renderStars(rating) {
  const full = Math.round(rating);
  const starsHtml = Array.from({ length: 5 }, (_, i) => `<i class="fa-solid fa-star" style="opacity: ${i < full ? 1 : 0.25}"></i>`).join('');
  return starsHtml;
}

function saveState() {
  localStorage.setItem('akua_cart', JSON.stringify(state.cart));
  localStorage.setItem('akua_wishlist', JSON.stringify(Array.from(state.wishlist)));
  localStorage.setItem('akua_theme', state.theme);
  localStorage.setItem('akua_location', state.selectedLocation);
}

function getActiveTier(productId) {
  const tierId = state.selectedTiers[productId] || "carton";
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return null;
  return prod.tiers.find(t => t.id === tierId) || prod.tiers[0];
}

// Main Render
function render() {
  const app = document.querySelector("#app");
  if (!app) return;

  if (state.activeView === 'merchantPortal') {
    renderMerchantPortalView(app);
    return;
  }

  // Calculate cart counts & savings
  let cartCount = 0;
  let cartSubtotal = 0;
  let totalSavings = 0;

  Object.entries(state.cart).forEach(([cartKey, qty]) => {
    const [prodId, tierId] = cartKey.split('_');
    const prod = PRODUCTS.find(p => p.id === prodId);
    if (prod) {
      const tier = prod.tiers.find(t => t.id === tierId) || prod.tiers[0];
      cartCount += qty;
      cartSubtotal += tier.price * qty;
      const retailVal = (tier.retailPrice || tier.price * 1.25) * qty;
      totalSavings += Math.max(0, retailVal - (tier.price * qty));
    }
  });

  // Filter & Sort products
  let filteredProducts = PRODUCTS.filter(p => {
    const matchesHub = state.selectedHub === 'All' || p.hub === state.selectedHub;
    const matchesCat = state.category === 'All' || p.category === state.category;
    const matchesSubcat = state.subcategory === 'All' || p.subcategory === state.subcategory;
    
    const matchesQuery = p.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                         (p.subcategory && p.subcategory.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
                         p.factory.toLowerCase().includes(state.searchQuery.toLowerCase());
    
    const activeTier = getActiveTier(p.id);
    const matchesPrice = activeTier ? activeTier.price <= state.priceRange : true;
    const matchesStock = !state.inStockOnly || p.stock > 0;
    const matchesBrand = state.selectedBrand === 'All' || p.factory.toLowerCase().includes(state.selectedBrand.toLowerCase());

    if (state.activeTab === 'Hot Deals') return matchesHub && matchesCat && matchesSubcat && matchesQuery && matchesPrice && matchesStock && matchesBrand && p.isHot;
    return matchesHub && matchesCat && matchesSubcat && matchesQuery && matchesPrice && matchesStock && matchesBrand;
  });

  // Sort logic
  if (state.sortBy === 'price-low') {
    filteredProducts.sort((a, b) => getActiveTier(a.id).price - getActiveTier(b.id).price);
  } else if (state.sortBy === 'price-high') {
    filteredProducts.sort((a, b) => getActiveTier(b.id).price - getActiveTier(a.id).price);
  } else if (state.sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  const heroSlide = HERO_SLIDES[state.currentSlideIndex];
  const activeCategoryObj = CATEGORIES.find(c => c.name === state.category);

  app.innerHTML = `
    <!-- Top Announcement Bar -->
    <div class="top-banner">
      <div>
        <span class="top-banner-badge">FACTORY DIRECT</span>
        <span>AKUA MARKET — Online Supermarket & Mall Factory Wholesale Hub Delivered Across Ghana</span>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <button class="location-picker-btn" onclick="window.openLocationModal()">
          <i class="fa-solid fa-location-dot"></i>
          <span>Delivery: <b>${state.selectedLocation}</b></span>
          <i class="fa-solid fa-chevron-down" style="font-size: 10px;"></i>
        </button>
      </div>
    </div>

    <!-- Header Navbar -->
    <header>
      <div class="container">
        <div class="header-main">
          <button class="brand-logo" onclick="window.setHub('All')">
            <i class="fa-solid fa-industry"></i>
            <div>
              AKUA <span class="gold-text">MARKET</span>
              <small>SUPERMARKET & MALL HUB</small>
            </div>
          </button>

          <div class="search-wrapper">
            <div class="search-input-group">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                id="global-search" 
                placeholder="Search supermarket groceries, paper, pens, Milo, TVs..." 
                value="${state.searchQuery}"
              />
              <button class="scan-btn" onclick="window.openBarcodeScanner()" title="Scan Barcode">
                <i class="fa-solid fa-barcode"></i>
              </button>
            </div>
          </div>

          <div class="header-actions">
            <button class="portal-switch-btn" onclick="window.switchView('merchantPortal')" title="Merchant & Supplier Portal">
              <i class="fa-solid fa-chart-line"></i>
              <span>Merchant Portal</span>
            </button>

            <button class="icon-btn" onclick="window.toggleTheme()" title="Toggle Theme">
              <i class="fa-solid ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
            </button>

            <button class="icon-btn" onclick="window.openTrackingModal()" title="Track Freight Order">
              <i class="fa-solid fa-truck-fast"></i>
            </button>

            <button class="icon-btn" onclick="window.toggleCart(true)" title="Wholesale Order Cart">
              <i class="fa-solid fa-truck-ramp-box"></i>
              ${cartCount > 0 ? `<span class="badge-count">${cartCount}</span>` : ''}
            </button>

            <button class="auth-btn" onclick="window.openAuthModal('login')">
              <i class="fa-solid fa-user"></i>
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Department Hub Switcher Tabs (Supermarket vs Mall) -->
      <div class="hub-tabs-wrapper">
        <div class="container">
          <div class="hub-tabs-container">
            ${DEPARTMENT_HUBS.map(h => `
              <button 
                class="hub-tab-btn ${state.selectedHub === h.id ? 'active' : ''}" 
                onclick="window.setHub('${h.id}')"
              >
                <i class="fa-solid ${h.icon}"></i>
                <span>${h.name}</span>
                ${h.badge ? `<small class="hub-pill-badge">${h.badge}</small>` : ''}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Navigation Bar with Mega Menu Toggle -->
      <div class="nav-bar">
        <div class="container">
          <div class="nav-container">
            <button class="nav-link mega-menu-trigger ${state.megaMenuOpen ? 'active' : ''}" onclick="window.toggleMegaMenu()">
              <i class="fa-solid fa-bars-staggered"></i> Shop All Departments <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-left: 4px;"></i>
            </button>
            
            ${CATEGORIES.filter(c => state.selectedHub === 'All' || c.hub === state.selectedHub).slice(0, 6).map(c => `
              <button class="nav-link ${state.category === c.name ? 'active' : ''}" onclick="window.setCategory('${c.name}')">
                <i class="fa-solid ${c.icon}" style="margin-right: 5px; opacity: 0.85;"></i> ${c.name}
              </button>
            `).join('')}

            <button class="rfq-btn-link" onclick="window.openRFQModal()">
              <i class="fa-solid fa-file-invoice-dollar"></i> Pro-Forma RFQ Quote
            </button>
          </div>
        </div>
      </div>

      <!-- Interactive Supermarket & Mall Mega Menu Dropdown -->
      ${state.megaMenuOpen ? `
        <div class="mega-menu-overlay" onclick="window.toggleMegaMenu(false)">
          <div class="container" onclick="event.stopPropagation()">
            <div class="mega-menu-card">
              <div class="mega-menu-header">
                <div>
                  <h3><i class="fa-solid fa-shapes" style="color: var(--gold-primary);"></i> Explore Online Supermarket & Mall Departments</h3>
                  <p>Browse by department, subcategory, or factory brand</p>
                </div>
                <button class="close-btn" onclick="window.toggleMegaMenu(false)"><i class="fa-solid fa-xmark"></i></button>
              </div>

              <div class="mega-menu-grid">
                <!-- Column 1: Supermarket Departments -->
                <div class="mega-col">
                  <div class="mega-col-title" style="color: #10b981;">
                    <i class="fa-solid fa-cart-shopping"></i> SUPERMARKET DEPARTMENTS
                  </div>
                  <ul class="mega-cat-list">
                    ${CATEGORIES.filter(c => c.hub === 'Supermarket').map(c => `
                      <li onclick="window.setCategory('${c.name}'); window.toggleMegaMenu(false);">
                        <div class="mega-cat-item">
                          <i class="fa-solid ${c.icon} icon"></i>
                          <div>
                            <b>${c.name}</b>
                            <small>${c.subcategories.slice(0, 3).join(', ')}</small>
                          </div>
                        </div>
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <!-- Column 2: Online Mall Departments -->
                <div class="mega-col">
                  <div class="mega-col-title" style="color: #3b82f6;">
                    <i class="fa-solid fa-building-columns"></i> ONLINE MALL DEPARTMENTS
                  </div>
                  <ul class="mega-cat-list">
                    ${CATEGORIES.filter(c => c.hub === 'Mall').map(c => `
                      <li onclick="window.setCategory('${c.name}'); window.toggleMegaMenu(false);">
                        <div class="mega-cat-item">
                          <i class="fa-solid ${c.icon} icon"></i>
                          <div>
                            <b>${c.name}</b>
                            <small>${c.subcategories.slice(0, 3).join(', ')}</small>
                          </div>
                        </div>
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <!-- Column 3: Featured Superstore Brands & Quick Links -->
                <div class="mega-col promo-col">
                  <div class="mega-col-title" style="color: var(--gold-primary);">
                    <i class="fa-solid fa-crown"></i> FACTORY BRANDS & PROMOS
                  </div>
                  <div class="mega-brands-grid">
                    <button class="brand-pill-btn" onclick="window.setSelectedBrand('Bic'); window.toggleMegaMenu(false);">
                      <i class="fa-solid fa-pen"></i> BIC Ghana
                    </button>
                    <button class="brand-pill-btn" onclick="window.setSelectedBrand('Nestlé'); window.toggleMegaMenu(false);">
                      <i class="fa-solid fa-mug-hot"></i> Nestlé Ghana
                    </button>
                    <button class="brand-pill-btn" onclick="window.setSelectedBrand('Sylvamo'); window.toggleMegaMenu(false);">
                      <i class="fa-solid fa-file"></i> Chamex Paper
                    </button>
                    <button class="brand-pill-btn" onclick="window.setSelectedBrand('Wilmar'); window.toggleMegaMenu(false);">
                      <i class="fa-solid fa-bottle-droplet"></i> SunGold Oil
                    </button>
                    <button class="brand-pill-btn" onclick="window.setSelectedBrand('Unilever'); window.toggleMegaMenu(false);">
                      <i class="fa-solid fa-soap"></i> Unilever Omo
                    </button>
                    <button class="brand-pill-btn" onclick="window.setSelectedBrand('Hisense'); window.toggleMegaMenu(false);">
                      <i class="fa-solid fa-tv"></i> Hisense Mall
                    </button>
                  </div>

                  <div class="mega-promo-banner" onclick="window.setHub('Supermarket'); window.toggleMegaMenu(false);">
                    <div style="font-size: 11px; font-weight: 700; color: #10b981;">WEEKLY SUPERMARKET DEALS</div>
                    <h4>Groceries up to 35% OFF Wholesale</h4>
                    <span>Shop Fresh Produce, Rice & Beverages →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}
    </header>

    <main class="container">
      <!-- Hero Slider -->
      <section class="hero-section">
        <div class="hero-slider">
          <div class="hero-slide">
            <div class="hero-content">
              <small><i class="fa-solid fa-building-circle-check"></i> ${heroSlide.tag}</small>
              <h1>${heroSlide.title}</h1>
              <p>${heroSlide.description}</p>
              <button class="hero-cta" onclick="window.scrollToProducts()">
                <span>${heroSlide.cta}</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div class="hero-image-wrapper">
              <img src="${heroSlide.image}" alt="Hero Promo" class="hero-image" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=70';" />
              <div class="hero-float-card">
                <div class="hero-float-icon"><i class="fa-solid fa-star"></i></div>
                <div>
                  <b>4.9/5 Rated</b>
                  <span>by 1,200+ Wholesale Merchants</span>
                </div>
              </div>
            </div>
          </div>

          <div class="slider-controls">
            ${HERO_SLIDES.map((_, idx) => `
              <div class="slider-dot ${state.currentSlideIndex === idx ? 'active' : ''}" onclick="window.setSlide(${idx})"></div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Benefits Bar -->
      <section class="benefits-bar">
        <div class="benefit-item">
          <div class="benefit-icon"><i class="fa-solid fa-cart-shopping" style="color: #10b981;"></i></div>
          <div class="benefit-info">
            <h4>Supermarket & Mall Hub</h4>
            <p>Groceries, Stationery, Tech & Home under one roof</p>
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon"><i class="fa-solid fa-boxes-packing" style="color: var(--gold-primary);"></i></div>
          <div class="benefit-info">
            <h4>Wholesale Tier Pricing</h4>
            <p>Save up to 35% buying cartons or pallets</p>
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon"><i class="fa-solid fa-truck-moving" style="color: #3b82f6;"></i></div>
          <div class="benefit-info">
            <h4>Freight Logistics</h4>
            <p>Direct dispatch to ${state.selectedLocation}</p>
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon"><i class="fa-solid fa-shield-check" style="color: #ec4899;"></i></div>
          <div class="benefit-info">
            <h4>Genuine Sealed Stock</h4>
            <p>100% manufacturer warranty & quality</p>
          </div>
        </div>
      </section>

      <!-- Interactive Category Chips Carousel / Row -->
      <section class="category-carousel-section">
        <div class="section-header">
          <div class="section-title">
            <small>POPULAR DEPARTMENTS</small>
            <h2>${state.selectedHub === 'Supermarket' ? 'Supermarket Grocery Aisles' : state.selectedHub === 'Mall' ? 'Shopping Mall Outlets' : 'All Superstore Departments'}</h2>
          </div>
          <button class="view-all-btn" onclick="window.setCategory('All')">
            <span>View All</span> <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div class="category-chips-row">
          <div class="category-chip ${state.category === 'All' ? 'active' : ''}" onclick="window.setCategory('All')">
            <div class="chip-icon"><i class="fa-solid fa-border-all"></i></div>
            <div class="chip-info">
              <b>All Items</b>
              <small>${PRODUCTS.length} Lines</small>
            </div>
          </div>

          ${CATEGORIES.filter(c => state.selectedHub === 'All' || c.hub === state.selectedHub).map(c => `
            <div class="category-chip ${state.category === c.name ? 'active' : ''}" onclick="window.setCategory('${c.name}')">
              <div class="chip-icon"><i class="fa-solid ${c.icon}"></i></div>
              <div class="chip-info">
                <b>${c.name}</b>
                <small>${c.count}+ Lines</small>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Active Subcategories Quick Bar (If a specific category is selected) -->
      ${activeCategoryObj && activeCategoryObj.subcategories ? `
        <div class="subcat-bar">
          <span class="subcat-label"><i class="fa-solid fa-filter"></i> ${activeCategoryObj.name} Subcategories:</span>
          <button class="subcat-pill ${state.subcategory === 'All' ? 'active' : ''}" onclick="window.setSubcategory('All')">
            All ${activeCategoryObj.name}
          </button>
          ${activeCategoryObj.subcategories.map(sub => `
            <button class="subcat-pill ${state.subcategory === sub ? 'active' : ''}" onclick="window.setSubcategory('${sub}')">
              ${sub}
            </button>
          `).join('')}
        </div>
      ` : ''}

      <!-- Category Page Layout with Left Filter Sidebar (Matching Palace Superstores & Online Mall Layout) -->
      <div class="category-page-layout" id="products-section">
        <!-- Left Filter Sidebar -->
        <aside class="category-sidebar">
          <div class="sidebar-header">
            <div class="sidebar-title">
              <i class="fa-solid fa-sliders" style="color: var(--gold-primary);"></i> Filter Departments
            </div>
            <button class="reset-filters-btn" onclick="window.resetFilters()" title="Reset All Filters">Reset</button>
          </div>

          <!-- Search Category Input -->
          <div class="sidebar-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Search departments..." 
              value="${state.catSearchSidebar}"
              oninput="window.updateCatSearchSidebar(this.value)"
            />
          </div>

          <!-- Department Hub Filter -->
          <div class="sidebar-section">
            <div class="sidebar-subtitle">Superstore Hubs</div>
            <div class="sidebar-hub-pills">
              ${DEPARTMENT_HUBS.map(h => `
                <button class="sidebar-hub-btn ${state.selectedHub === h.id ? 'active' : ''}" onclick="window.setHub('${h.id}')">
                  <i class="fa-solid ${h.icon}"></i> ${h.name}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Supermarket Accordion Group -->
          <div class="sidebar-section">
            <div class="sidebar-subtitle" style="color: #10b981;">
              <i class="fa-solid fa-cart-shopping"></i> Supermarket Departments
            </div>
            <ul class="sidebar-cat-tree">
              ${CATEGORIES.filter(c => c.hub === 'Supermarket' && c.name.toLowerCase().includes(state.catSearchSidebar.toLowerCase())).map(c => `
                <li class="sidebar-cat-item ${state.category === c.name ? 'active' : ''}" onclick="window.setCategory('${c.name}')">
                  <span><i class="fa-solid ${c.icon}" style="margin-right: 6px;"></i> ${c.name}</span>
                  <span class="count-badge">${c.count}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Online Mall Accordion Group -->
          <div class="sidebar-section">
            <div class="sidebar-subtitle" style="color: #3b82f6;">
              <i class="fa-solid fa-building-columns"></i> Online Mall Departments
            </div>
            <ul class="sidebar-cat-tree">
              ${CATEGORIES.filter(c => c.hub === 'Mall' && c.name.toLowerCase().includes(state.catSearchSidebar.toLowerCase())).map(c => `
                <li class="sidebar-cat-item ${state.category === c.name ? 'active' : ''}" onclick="window.setCategory('${c.name}')">
                  <span><i class="fa-solid ${c.icon}" style="margin-right: 6px;"></i> ${c.name}</span>
                  <span class="count-badge">${c.count}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Price Range Slider -->
          <div class="sidebar-section">
            <div class="sidebar-subtitle">
              <i class="fa-solid fa-tags"></i> Max Tier Price
            </div>
            <div class="price-slider-box">
              <input 
                type="range" 
                min="50" 
                max="15000" 
                step="50" 
                value="${state.priceRange}" 
                oninput="window.setPriceRange(this.value)"
              />
              <div class="price-slider-value">
                <span>GH₵ 50.00</span>
                <b>Up to ${formatPrice(state.priceRange)}</b>
              </div>
            </div>
          </div>

          <!-- Manufacturer Brand Filter -->
          <div class="sidebar-section">
            <div class="sidebar-subtitle">
              <i class="fa-solid fa-building-user"></i> Factory Brand
            </div>
            <select class="brand-select" onchange="window.setSelectedBrand(this.value)">
              <option value="All" ${state.selectedBrand === 'All' ? 'selected' : ''}>All Factory Brands</option>
              <option value="Bic" ${state.selectedBrand === 'Bic' ? 'selected' : ''}>BIC Ghana</option>
              <option value="Nestlé" ${state.selectedBrand === 'Nestlé' ? 'selected' : ''}>Nestlé Ghana</option>
              <option value="Sylvamo" ${state.selectedBrand === 'Sylvamo' ? 'selected' : ''}>Sylvamo (Chamex Paper)</option>
              <option value="Wilmar" ${state.selectedBrand === 'Wilmar' ? 'selected' : ''}>Wilmar Africa (SunGold)</option>
              <option value="Unilever" ${state.selectedBrand === 'Unilever' ? 'selected' : ''}>Unilever Ghana</option>
              <option value="Hisense" ${state.selectedBrand === 'Hisense' ? 'selected' : ''}>Hisense Outlet</option>
            </select>
          </div>

          <!-- Stock Availability Checkbox -->
          <div class="sidebar-section">
            <label class="toggle-checkbox-label">
              <input type="checkbox" ${state.inStockOnly ? 'checked' : ''} onchange="window.toggleInStockOnly()" />
              <span>In-Stock Items Only</span>
            </label>
          </div>

          <div class="sidebar-warehouse-box">
            <div class="sidebar-title" style="font-size: 13px;">
              <i class="fa-solid fa-location-dot" style="color: var(--gold-primary);"></i> Active Warehouse
            </div>
            <p style="font-size: 12px; color: var(--text-muted);">${state.selectedLocation} Regional Depot</p>
            <button class="map-outline-btn" style="margin-top: 10px; font-size: 11px; padding: 6px 12px;" onclick="window.openLocationModal()">
              Change Warehouse Region
            </button>
          </div>
        </aside>

        <!-- Right Main Products View -->
        <div>
          <!-- Products Top Toolbar -->
          <div class="products-top-toolbar">
            <div style="font-size: 13px; font-weight: 700;">
              Showing <span style="color: var(--gold-primary);">${filteredProducts.length}</span> items in 
              <span style="color: var(--gold-primary);">${state.category}</span>
              ${state.subcategory !== 'All' ? ` > <span style="color: var(--gold-primary);">${state.subcategory}</span>` : ''}
            </div>

            <div style="display: flex; gap: 16px; align-items: center;">
              <div>
                <span style="font-size: 12px; color: var(--text-muted); margin-right: 6px;">Sort by:</span>
                <select class="sort-select" onchange="window.setSortBy(this.value)">
                  <option value="default" ${state.sortBy === 'default' ? 'selected' : ''}>Featured Tiers</option>
                  <option value="price-low" ${state.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                  <option value="price-high" ${state.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                  <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>Top Rated</option>
                </select>
              </div>

              <!-- View Mode Toggle -->
              <div class="view-mode-toggle">
                <button class="view-btn ${state.viewMode === 'grid' ? 'active' : ''}" onclick="window.setViewMode('grid')" title="Grid View">
                  <i class="fa-solid fa-border-all"></i>
                </button>
                <button class="view-btn ${state.viewMode === 'list' ? 'active' : ''}" onclick="window.setViewMode('list')" title="List View">
                  <i class="fa-solid fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Product Grid / List -->
          <div class="products-grid ${state.viewMode === 'list' ? 'list-view' : ''}">
            ${filteredProducts.length === 0 ? `
              <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
                <i class="fa-solid fa-box-open" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                <h3>No supermarket or mall items found matching your filter</h3>
                <button class="hero-cta" style="margin-top: 20px;" onclick="window.resetFilters()">Reset Filters</button>
              </div>
            ` : filteredProducts.map(p => {
              const activeTier = getActiveTier(p.id);
              const cartKey = `${p.id}_${activeTier.id}`;
              const qtyInCart = state.cart[cartKey] || 0;
              const isWish = state.wishlist.has(p.id);

              return `
                <article class="product-card">
                  <div class="product-image-box">
                    ${activeTier.savings ? `<span class="discount-tag">${activeTier.savings}</span>` : ''}
                    <span class="factory-tag ${p.hub === 'Supermarket' ? 'tag-supermarket' : 'tag-mall'}">
                      <i class="fa-solid ${p.hub === 'Supermarket' ? 'fa-cart-shopping' : 'fa-building-columns'}"></i> ${p.hub.toUpperCase()}
                    </span>
                    
                    <button class="wishlist-btn ${isWish ? 'active' : ''}" onclick="window.toggleWishlist('${p.id}')">
                      <i class="fa-${isWish ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                    
                    <img src="${p.image}" alt="${p.title}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=70';" />
                    
                    <div class="quick-view-overlay">
                      <button class="quick-view-btn" onclick="window.openQuickView('${p.id}')">
                        <i class="fa-regular fa-eye"></i> Quick View
                      </button>
                    </div>
                  </div>

                  <div class="product-details">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <div class="factory-name"><i class="fa-solid fa-building"></i> ${p.factory}</div>
                      ${p.subcategory ? `<span class="subcat-badge-tag">${p.subcategory}</span>` : ''}
                    </div>
                    <h3 class="product-title" title="${p.title}">${p.title}</h3>

                    <div class="rating-row">
                      <span class="stars">${renderStars(p.rating)}</span>
                      <span class="review-count">${p.rating.toFixed(1)} (${p.reviews})</span>
                    </div>

                    <div class="tier-selector">
                      ${p.tiers.map(t => `
                        <button 
                          class="tier-btn ${t.id === activeTier.id ? 'active' : ''}" 
                          onclick="window.selectTier('${p.id}', '${t.id}')"
                        >
                          ${t.id === 'unit' ? 'Unit' : t.id === 'carton' ? 'Carton' : 'Pallet'}
                        </button>
                      `).join('')}
                    </div>

                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px; font-weight: 600;">
                      ${activeTier.label} (${p.size})
                    </div>

                    <div class="product-price-row">
                      <div class="price-box">
                        <span class="current-price">${formatPrice(activeTier.price)}</span>
                        ${activeTier.retailPrice ? `<span class="retail-price">Retail: ${formatPrice(activeTier.retailPrice)}</span>` : ''}
                      </div>

                      ${qtyInCart > 0 ? `
                        <div class="qty-control">
                          <button onclick="window.updateCart('${p.id}', '${activeTier.id}', -1)">−</button>
                          <span>${qtyInCart}</span>
                          <button onclick="window.updateCart('${p.id}', '${activeTier.id}', 1)">+</button>
                        </div>
                      ` : `
                        <button class="add-cart-btn" onclick="window.updateCart('${p.id}', '${activeTier.id}', 1)">
                          <i class="fa-solid fa-cart-plus"></i> ADD TIER
                        </button>
                      `}
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    ${renderModalsHtml(cartCount, cartSubtotal, totalSavings)}

    <!-- Toast Notifications -->
    <div id="toast-container" class="toast-container"></div>

    <!-- Footer -->
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <button class="brand-logo" onclick="window.setHub('All')">
              <i class="fa-solid fa-industry"></i>
              <div>AKUA <span class="gold-text">MARKET</span></div>
            </button>
            <p>Ghana's Premier Online Supermarket & Shopping Mall Hub — Direct factory rates on groceries, stationery, tech, and everyday essentials delivered nationwide.</p>
            <div style="display: flex; gap: 10px;">
              <span class="payment-badge"><i class="fa-solid fa-mobile-screen" style="color: #eab308;"></i> MTN MoMo</span>
              <span class="payment-badge"><i class="fa-solid fa-mobile-screen" style="color: #ef4444;"></i> Telecel Cash</span>
              <span class="payment-badge"><i class="fa-solid fa-credit-card" style="color: #3b82f6;"></i> Visa / Mastercard</span>
            </div>
          </div>

          <div class="footer-col">
            <h4>Supermarket Hub</h4>
            <ul class="footer-links">
              <li><a href="#" onclick="window.setCategory('Groceries & Food Staples')">Groceries & Food Staples</a></li>
              <li><a href="#" onclick="window.setCategory('Fresh Produce & Bakery')">Fresh Produce & Bakery</a></li>
              <li><a href="#" onclick="window.setCategory('Beverages & Cold Drinks')">Beverages & Cold Drinks</a></li>
              <li><a href="#" onclick="window.setCategory('Household & Cleaning')">Household & Cleaning Supplies</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Online Shopping Mall</h4>
            <ul class="footer-links">
              <li><a href="#" onclick="window.setCategory('Stationery & Office Supplies')">Stationery & Office Supplies</a></li>
              <li><a href="#" onclick="window.setCategory('Electronics & Tech Mall')">Electronics & Tech Outlet</a></li>
              <li><a href="#" onclick="window.setCategory('Health & Personal Care')">Health & Personal Care</a></li>
              <li><a href="#" onclick="window.openRFQModal()">Request Pro-Forma Quote</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Factory Logistics</h4>
            <ul class="footer-links">
              <li><a href="#" onclick="window.openMapModal()">Accra Central Depot</a></li>
              <li><a href="#" onclick="window.openMapModal()">Tema Port Logistics Hub</a></li>
              <li><a href="#" onclick="window.openMapModal()">Kumasi Wholesale Hub</a></li>
              <li><a href="#" onclick="window.openTrackingModal()">Track Freight Order</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2026 Akua Market Direct Factory Supermarket & Shopping Mall Ltd. All rights reserved.</div>
          <div style="display: flex; gap: 15px;">
            <a href="#">Merchant Terms</a>
            <a href="#">Factory Pricing Policy</a>
            <a href="#">Freight Logistics</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  // Search input listener
  const searchInput = document.querySelector("#global-search");
  if (searchInput) {
    searchInput.oninput = (e) => {
      state.searchQuery = e.target.value;
      render();
      const newSearchInput = document.querySelector("#global-search");
      if (newSearchInput) {
        newSearchInput.focus();
        newSearchInput.setSelectionRange(newSearchInput.value.length, newSearchInput.value.length);
      }
    };
  }
}

// Render All Interactive Modals
function renderModalsHtml(cartCount, cartSubtotal, totalSavings) {
  return `
    <!-- Interactive Map Modal -->
    ${state.mapModalOpen ? `
      <div class="modal-overlay active" onclick="window.closeMapModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 650px;">
          <button class="close-btn" style="position: absolute; top: 15px; right: 15px;" onclick="window.closeMapModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 6px;">
            <i class="fa-solid fa-map-location-dot" style="color: var(--gold-primary);"></i> Select Factory Depot Location on Map
          </h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
            Click any factory depot marker across Ghana to set your freight delivery zone.
          </p>

          <div class="ghana-map-container">
            ${FACTORY_DEPOTS.map(depot => `
              <div 
                class="depot-marker ${state.selectedLocation === depot.area ? 'active' : ''}" 
                style="top: ${depot.top}; left: ${depot.left};"
                onclick="window.selectDepot('${depot.area}')"
                title="${depot.name} (${depot.eta})"
              >
                <i class="fa-solid fa-warehouse"></i>
                <span>${depot.area}</span>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <small style="color: var(--text-muted); font-size: 11px;">ACTIVE FREIGHT ZONE:</small>
              <h4 style="color: var(--gold-primary); font-size: 16px;">${state.selectedLocation}</h4>
            </div>
            <button class="hero-cta" onclick="window.closeMapModal()">Confirm Freight Location</button>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Pro-Forma RFQ Quotation Modal -->
    ${state.rfqModalOpen ? `
      <div class="modal-overlay active" onclick="window.closeRFQModal()">
        <div class="invoice-paper" onclick="event.stopPropagation()">
          <div class="invoice-header">
            <div>
              <h2 style="color: #0f172a; font-weight: 800;"><i class="fa-solid fa-industry" style="color: #d99b00;"></i> AKUA MARKET WHOLESALE</h2>
              <small style="color: #64748b;">OFFICIAL B2B PRO-FORMA QUOTATION INVOICE</small>
            </div>
            <div style="text-align: right;">
              <b style="color: #d99b00; font-size: 16px;">QUOTE #${Math.floor(100000 + Math.random() * 900000)}</b>
              <div style="font-size: 12px; color: #64748b;">Date: ${new Date().toLocaleDateString('en-GH')}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 12px; margin-bottom: 20px;">
            <div>
              <b>SUPPLIER DETAILS:</b><br/>
              Akua Market Factory Hub Ghana Ltd<br/>
              Spintex Industrial Zone, Accra<br/>
              TIN: C0004928104
            </div>
            <div>
              <b>BUYER DETAILS:</b><br/>
              Merchant Wholesale Buyer<br/>
              Delivery Zone: <b>${state.selectedLocation}</b><br/>
              Payment Terms: Mobile Money / Bank Transfer
            </div>
          </div>

          <table class="invoice-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Tier</th>
                <th>Qty</th>
                <th>Unit Factory Rate</th>
                <th>Total (GH₵)</th>
              </tr>
            </thead>
            <tbody>
              ${cartCount === 0 ? `
                <tr><td colspan="5" style="text-align: center; color: #64748b; padding: 20px;">No items selected in wholesale cart. Add cartons to generate quote.</td></tr>
              ` : Object.entries(state.cart).map(([cartKey, qty]) => {
                const [prodId, tierId] = cartKey.split('_');
                const prod = PRODUCTS.find(p => p.id === prodId);
                if (!prod) return '';
                const tier = prod.tiers.find(t => t.id === tierId) || prod.tiers[0];

                return `
                  <tr>
                    <td><b>${prod.title}</b><br/><small style="color: #64748b;">${prod.factory}</small></td>
                    <td>${tier.label}</td>
                    <td>${qty}</td>
                    <td>${formatPrice(tier.price)}</td>
                    <td><b>${formatPrice(tier.price * qty)}</b></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px;">
            <div style="font-size: 11px; color: #64748b;">
              * Valid for 14 days. Prices include factory VAT & NHIL tags.<br/>
              Authorized Stamp: <b style="color: #0f172a;">AKUA MARKET DIRECT DISPATCH</b>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 13px; color: #64748b;">Estimated Freight: GH₵ 50.00</div>
              <h3 style="font-size: 20px; color: #0f172a;">Grand Total: <span style="color: #d99b00;">${formatPrice(cartSubtotal + (cartCount > 0 ? 50 : 0))}</span></h3>
            </div>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 30px; justify-content: flex-end;">
            <button class="map-outline-btn" style="color: #0f172a; border-color: #cbd5e1; width: auto;" onclick="window.closeRFQModal()">Close Quote</button>
            <button class="submit-btn" style="width: auto; padding: 12px 24px;" onclick="window.printRFQ()">
              <i class="fa-solid fa-print"></i> Print Pro-Forma Invoice
            </button>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Ghana Mobile Money & Checkout Gateway Modal -->
    ${state.checkoutModal.open ? `
      <div class="modal-overlay active" onclick="window.closeCheckoutModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 520px;">
          <button class="close-btn" style="position: absolute; top: 15px; right: 15px;" onclick="window.closeCheckoutModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>

          ${state.checkoutModal.step === 1 ? `
            <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">
              <i class="fa-solid fa-truck-ramp-box" style="color: var(--gold-primary);"></i> Step 1: Merchant & Shipping Info
            </h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px;">Enter recipient details for factory freight delivery.</p>
            
            <form onsubmit="event.preventDefault(); window.setCheckoutStep(2);">
              <div class="form-group">
                <label>Merchant / Shop Name</label>
                <input type="text" id="chk-name" placeholder="e.g. Kwame Enterprise" value="${state.checkoutModal.buyerName || ''}" required />
              </div>
              <div class="form-group">
                <label>Freight Delivery Address (${state.selectedLocation})</label>
                <input type="text" placeholder="e.g. Store 42, Spintex Road, Accra" required />
              </div>
              <button type="submit" class="submit-btn">CONTINUE TO PAYMENT METHOD →</button>
            </form>
          ` : state.checkoutModal.step === 2 ? `
            <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">
              <i class="fa-solid fa-mobile-screen-button" style="color: var(--gold-primary);"></i> Step 2: Select Ghana Payment Method
            </h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px;">Total Payable: <b style="color: var(--gold-primary);">${formatPrice(cartSubtotal + 50.00)}</b></p>
            
            <div class="momo-provider-grid">
              <div class="provider-card ${state.checkoutModal.provider === 'mtn' ? 'active' : ''}" onclick="window.setMoMoProvider('mtn')">
                <i class="fa-solid fa-mobile-screen" style="font-size: 24px; color: #f59e0b;"></i>
                <b style="display: block; font-size: 12px; margin-top: 6px;">MTN MoMo</b>
              </div>
              <div class="provider-card ${state.checkoutModal.provider === 'telecel' ? 'active' : ''}" onclick="window.setMoMoProvider('telecel')">
                <i class="fa-solid fa-mobile-screen" style="font-size: 24px; color: #ef4444;"></i>
                <b style="display: block; font-size: 12px; margin-top: 6px;">Telecel Cash</b>
              </div>
              <div class="provider-card ${state.checkoutModal.provider === 'at' ? 'active' : ''}" onclick="window.setMoMoProvider('at')">
                <i class="fa-solid fa-mobile-screen" style="font-size: 24px; color: #3b82f6;"></i>
                <b style="display: block; font-size: 12px; margin-top: 6px;">AT Money</b>
              </div>
            </div>

            <form onsubmit="event.preventDefault(); window.triggerMoMoPrompt();">
              <div class="form-group">
                <label>${state.checkoutModal.provider.toUpperCase()} Mobile Money Number</label>
                <input type="text" placeholder="e.g. 0244123456" required />
              </div>
              <button type="submit" class="submit-btn">AUTHORIZE MOMO PAYMENT →</button>
            </form>
          ` : state.checkoutModal.step === 3 ? `
            <div class="ussd-prompt-box">
              <i class="fa-solid fa-spinner fa-spin" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
              <b style="font-size: 16px; display: block;">USSD PROMPT SENT TO PHONE!</b>
              <p style="font-size: 12px; margin-top: 8px;">Please check your phone and enter your Mobile Money PIN to authorize <b>${formatPrice(cartSubtotal + 50.00)}</b> to Akua Market Factory Hub.</p>
            </div>
            <button class="submit-btn" onclick="window.confirmMoMoPaid()">
              Simulate Customer Entering PIN (*170#)
            </button>
          ` : `
            <div style="text-align: center; padding: 10px 0;">
              <i class="fa-solid fa-circle-check" style="font-size: 54px; color: #10b981; margin-bottom: 12px; display: block;"></i>
              <h3 style="font-size: 20px; font-weight: 800;">WHOLESALE ORDER CONFIRMED!</h3>
              <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px;">Order ID: <b style="color: var(--gold-primary);">${state.checkoutModal.orderId}</b></p>
              
              <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 20px; border-radius: var(--radius-md); margin-bottom: 20px; text-align: left; font-size: 13px;">
                <div><b>Freight Location:</b> ${state.selectedLocation}</div>
                <div><b>Payment Status:</b> <span style="color: #10b981; font-weight: 800;">PAID VIA MOMO</span></div>
                <div><b>Dispatch Status:</b> Factory Loading</div>
              </div>

              <button class="submit-btn" onclick="window.closeCheckoutModal()">Done & Track Order</button>
            </div>
          `}
        </div>
      </div>
    ` : ''}

    <!-- Real-Time Wholesale Freight Tracker -->
    ${state.trackingModal.open ? `
      <div class="modal-overlay active" onclick="window.closeTrackingModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 600px;">
          <button class="close-btn" style="position: absolute; top: 15px; right: 15px;" onclick="window.closeTrackingModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">
            <i class="fa-solid fa-truck-fast" style="color: var(--gold-primary);"></i> Wholesale Freight Order Tracker
          </h3>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px;">Track real-time factory loading and delivery progress across Ghana.</p>

          <div style="display: flex; gap: 10px; margin-bottom: 24px;">
            <input type="text" id="track-input" placeholder="Enter Order ID e.g. GH-WH-9482" value="${state.trackingModal.trackingId}" style="flex: 1; background: var(--bg-primary); border: 1px solid var(--border-color); padding: 10px 14px; border-radius: var(--radius-md); color: white;" />
            <button class="hero-cta" style="padding: 10px 20px;" onclick="window.searchTrackingOrder()">Track</button>
          </div>

          ${state.trackingModal.activeOrder ? `
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between;">
                <b>ORDER #${state.trackingModal.activeOrder.id}</b>
                <span style="color: var(--gold-primary); font-weight: 700;">${state.trackingModal.activeOrder.status}</span>
              </div>
              <div style="color: var(--text-muted); font-size: 12px; margin-top: 4px;">
                Merchant: ${state.trackingModal.activeOrder.buyer} · Destination: ${state.trackingModal.activeOrder.location}
              </div>
            </div>

            <div class="tracker-stepper">
              <div class="tracker-step completed">
                <div class="step-icon"><i class="fa-solid fa-check"></i></div>
                <small style="font-size: 10px; font-weight: 700;">Order Approved</small>
              </div>
              <div class="tracker-step ${state.trackingModal.activeOrder.status !== 'Delivered' ? 'active' : 'completed'}">
                <div class="step-icon"><i class="fa-solid fa-boxes-packing"></i></div>
                <small style="font-size: 10px; font-weight: 700;">Factory Loading</small>
              </div>
              <div class="tracker-step ${state.trackingModal.activeOrder.status === 'In Transit' ? 'active' : state.trackingModal.activeOrder.status === 'Delivered' ? 'completed' : ''}">
                <div class="step-icon"><i class="fa-solid fa-truck"></i></div>
                <small style="font-size: 10px; font-weight: 700;">Freight En Route</small>
              </div>
              <div class="tracker-step ${state.trackingModal.activeOrder.status === 'Delivered' ? 'completed' : ''}">
                <div class="step-icon"><i class="fa-solid fa-house-circle-check"></i></div>
                <small style="font-size: 10px; font-weight: 700;">Delivered</small>
              </div>
            </div>
          ` : `
            <div style="text-align: center; color: var(--text-muted); padding: 30px 0;">No order found for ID entered.</div>
          `}
        </div>
      </div>
    ` : ''}

    <!-- Barcode Scanner Modal -->
    ${state.barcodeScannerOpen ? `
      <div class="modal-overlay active" onclick="window.closeBarcodeScanner()">
        <div class="modal-content" onclick="event.stopPropagation()" style="text-align: center;">
          <button class="close-btn" style="position: absolute; top: 15px; right: 15px;" onclick="window.closeBarcodeScanner()">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 10px;">
            <i class="fa-solid fa-barcode" style="color: var(--gold-primary);"></i> Wholesale Barcode Scanner
          </h3>
          <div style="background: var(--bg-primary); border: 2px dashed var(--gold-primary); border-radius: var(--radius-md); padding: 40px; margin-bottom: 20px;">
            <i class="fa-solid fa-qrcode" style="font-size: 64px; color: var(--gold-primary); animation: pulse 2s infinite;"></i>
            <div style="margin-top: 15px; font-size: 12px; font-weight: 700; color: var(--gold-primary);">SCANNER ACTIVE...</div>
          </div>
          <button class="submit-btn" onclick="window.simulateBarcodeMatch()">Simulate Scan "Chamex A4 Paper"</button>
        </div>
      </div>
    ` : ''}

    <!-- Location Modal -->
    ${state.locationModalOpen ? `
      <div class="modal-overlay active" onclick="window.closeLocationModal()">
        <div class="location-modal-card" onclick="event.stopPropagation()">
          <button class="close-btn" style="position: absolute; top: 20px; right: 20px;" onclick="window.closeLocationModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="location-modal-icon-glow">
            <i class="fa-solid fa-location-dot"></i>
          </div>

          <h2 class="location-modal-title">Set Your Delivery Location</h2>
          <p class="location-modal-sub">We'll show you available products & delivery options in your area</p>

          <button class="gps-primary-btn" onclick="window.useGpsLocation()">
            <i class="fa-solid fa-crosshairs" style="font-size: 18px;"></i>
            <span>USE MY CURRENT LOCATION</span>
          </button>

          <div class="or-divider">OR CHOOSE MANUALLY</div>

          <button class="map-outline-btn" onclick="window.selectOnMap()">
            <i class="fa-solid fa-map" style="color: var(--gold-primary);"></i>
            <span>Select Location on Interactive Map</span>
          </button>

          <div style="font-size: 11px; font-weight: 700; color: var(--gold-primary); letter-spacing: 1px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fa-solid fa-location-crosshairs"></i> POPULAR DELIVERY AREAS
          </div>

          <div class="popular-locations-grid">
            ${POPULAR_LOCATIONS.map(loc => `
              <button class="location-chip" onclick="window.setLocation('${loc}')">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-location-dot pin"></i>
                  <span>${loc}</span>
                </div>
                <i class="fa-solid fa-chevron-right" style="font-size: 11px; color: #64748b;"></i>
              </button>
            `).join('')}
          </div>

          <div style="font-size: 11px; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fa-solid fa-lock"></i> Your location is only used to calculate accurate delivery options.
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Quick View Modal -->
    ${state.quickViewProduct ? `
      <div class="modal-overlay active" onclick="window.closeQuickView()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 680px;">
          <button class="close-btn" style="position: absolute; top: 15px; right: 15px;" onclick="window.closeQuickView()">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center;">
            <img src="${state.quickViewProduct.image}" style="width: 100%; border-radius: var(--radius-md); height: 280px; object-fit: cover;" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=70';" />
            <div>
              <div style="color: var(--gold-primary); font-weight: 700; font-size: 12px;">
                <i class="fa-solid fa-industry"></i> ${state.quickViewProduct.factory}
              </div>
              <h2 style="font-size: 18px; margin: 6px 0;">${state.quickViewProduct.title}</h2>
              <div class="rating-row">
                <span class="stars">${renderStars(state.quickViewProduct.rating)}</span>
                <span class="review-count">${state.quickViewProduct.rating.toFixed(1)} (${state.quickViewProduct.reviews} reviews)</span>
              </div>
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                Factory direct inventory. Guaranteed sealed manufacturer stock available for delivery in ${state.selectedLocation}.
              </p>
              
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                ${state.quickViewProduct.tiers.map(t => `
                  <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <b style="font-size: 12px; display: block;">${t.label}</b>
                      <small style="color: var(--text-muted);">${t.savings || 'Standard Unit Rate'}</small>
                    </div>
                    <b style="color: var(--gold-primary);">${formatPrice(t.price)}</b>
                  </div>
                `).join('')}
              </div>

              <button class="checkout-btn" onclick="window.updateCart('${state.quickViewProduct.id}', 'carton', 1); window.closeQuickView(); window.toggleCart(true);">
                <i class="fa-solid fa-cart-plus"></i> Add Wholesale Carton
              </button>
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Auth Modal -->
    ${state.authModal.open ? `
      <div class="modal-overlay active" onclick="window.closeAuthModal()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <button class="close-btn" style="position: absolute; top: 15px; right: 15px;" onclick="window.closeAuthModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <div class="auth-tabs">
            <button class="auth-tab ${state.authModal.mode === 'login' ? 'active' : ''}" onclick="window.setAuthMode('login')">Wholesale Sign In</button>
            <button class="auth-tab ${state.authModal.mode === 'register' ? 'active' : ''}" onclick="window.setAuthMode('register')">Register Merchant</button>
          </div>
          <form onsubmit="event.preventDefault(); window.handleAuthSubmit();">
            <div class="form-group"><label>Email or Phone</label><input type="text" placeholder="e.g. kwame@merchant.com" required /></div>
            <div class="form-group"><label>Password</label><input type="password" placeholder="••••••••" required /></div>
            <button type="submit" class="submit-btn">SIGN IN TO ACCOUNT</button>
          </form>
        </div>
      </div>
    ` : ''}

    <!-- Cart Drawer -->
    <div class="cart-drawer-overlay ${state.cartOpen ? 'active' : ''}" onclick="window.toggleCart(false)"></div>
    <aside class="cart-drawer ${state.cartOpen ? 'active' : ''}">
      <div class="drawer-header">
        <h3><i class="fa-solid fa-truck-ramp-box" style="color: var(--gold-primary);"></i> Wholesale Order Cart</h3>
        <button class="close-btn" onclick="window.toggleCart(false)"><i class="fa-solid fa-xmark"></i></button>
      </div>

      ${totalSavings > 0 ? `
        <div class="wholesale-savings-banner">
          <i class="fa-solid fa-piggy-bank" style="font-size: 18px;"></i>
          <span>You saved ${formatPrice(totalSavings)} buying at Factory Direct Rates!</span>
        </div>
      ` : ''}

      <div class="drawer-body">
        ${cartCount === 0 ? `
          <div style="text-align: center; padding: 60px 0; color: var(--text-muted);">
            <i class="fa-solid fa-boxes-packing" style="font-size: 54px; color: var(--border-color); margin-bottom: 16px; display: block;"></i>
            <h4>Wholesale cart is empty</h4>
          </div>
        ` : Object.entries(state.cart).map(([cartKey, qty]) => {
          const [prodId, tierId] = cartKey.split('_');
          const prod = PRODUCTS.find(p => p.id === prodId);
          if (!prod) return '';
          const tier = prod.tiers.find(t => t.id === tierId) || prod.tiers[0];

          return `
            <div class="cart-item">
              <img src="${prod.image}" alt="${prod.title}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=70';" />
              <div class="cart-item-info">
                <div>
                  <h4>${prod.title}</h4>
                  <small><i class="fa-solid fa-industry"></i> ${tier.label}</small>
                </div>
                <div class="cart-item-price-row">
                  <span style="font-weight: 800; color: var(--gold-primary);">${formatPrice(tier.price * qty)}</span>
                  <div class="qty-control">
                    <button onclick="window.updateCart('${prod.id}', '${tier.id}', -1)">−</button>
                    <span>${qty}</span>
                    <button onclick="window.updateCart('${prod.id}', '${tier.id}', 1)">+</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${cartCount > 0 ? `
        <div class="drawer-footer">
          <div class="subtotal-row">
            <span>Wholesale Subtotal</span>
            <span>${formatPrice(cartSubtotal)}</span>
          </div>
          <div class="total-row">
            <span>Total Payable</span>
            <span>${formatPrice(cartSubtotal + 50.00)}</span>
          </div>
          <button class="checkout-btn" onclick="window.startCheckoutFlow()">
            <span>PROCEED TO MOMO CHECKOUT</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      ` : ''}
    </aside>
  `;
}

// Supplier Portal View
function renderMerchantPortalView(app) {
  app.innerHTML = `
    <div class="top-banner">
      <div><span class="top-banner-badge">SUPPLIER PORTAL</span> <span>Akua Market Factory Console</span></div>
      <button class="portal-switch-btn" onclick="window.switchView('storefront')" style="background: #0b0d10; border-color: #f7c119;">
        <i class="fa-solid fa-store"></i> Return To Wholesale Storefront
      </button>
    </div>

    <div class="container merchant-dashboard">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
        <div>
          <h2 style="font-size: 28px; font-weight: 800;">Factory Supplier Dashboard</h2>
          <p style="color: var(--text-muted); font-size: 13px;">Manage bulk inventory, approve wholesale orders, and track freight dispatches across Ghana.</p>
        </div>
        <button class="hero-cta" onclick="window.showToast('Inventory Synced with Factory Warehouse', 'fa-rotate')">
          <i class="fa-solid fa-rotate"></i> Sync Warehouse Inventory
        </button>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-sack-dollar"></i></div>
          <div>
            <h3>GH₵ 128,450</h3>
            <p>Total Monthly Factory Sales</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-truck-loading"></i></div>
          <div>
            <h3>42 Cartons</h3>
            <p>Dispatched Today</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-boxes-stacked"></i></div>
          <div>
            <h3>3,175 Units</h3>
            <p>Active Warehouse Stock</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
          <div>
            <h3>148 Merchants</h3>
            <p>Registered B2B Buyers</p>
          </div>
        </div>
      </div>

      <div class="merchant-table-wrapper">
        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 12px;">
          <i class="fa-solid fa-list-check" style="color: var(--gold-primary);"></i> Wholesale Orders Processing
        </h3>

        <table class="merchant-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer Merchant</th>
              <th>Delivery Zone</th>
              <th>Items Ordered</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.supplierOrders.map(ord => `
              <tr>
                <td><b>${ord.id}</b></td>
                <td>${ord.buyer}</td>
                <td>${ord.location}</td>
                <td>${ord.items}</td>
                <td><b>${formatPrice(ord.total)}</b></td>
                <td><span class="status-pill ${ord.status === 'Delivered' ? 'approved' : 'pending'}">${ord.status}</span></td>
                <td>
                  <button style="color: var(--gold-primary); font-weight: 700; font-size: 12px;" onclick="window.updateOrderStatus('${ord.id}')">
                    Update Status
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Global Interaction Helpers
window.switchView = (viewName) => { state.activeView = viewName; render(); };
window.updateCatSearchSidebar = (val) => { state.catSearchSidebar = val; render(); };
window.setSortBy = (val) => { state.sortBy = val; render(); };
window.setViewMode = (mode) => { state.viewMode = mode; render(); };

window.setHub = (hubId) => {
  state.selectedHub = hubId;
  state.category = 'All';
  state.subcategory = 'All';
  render();
  window.scrollToProducts();
};

window.setSubcategory = (subcatName) => {
  state.subcategory = subcatName;
  render();
  window.scrollToProducts();
};

window.toggleMegaMenu = (override) => {
  state.megaMenuOpen = typeof override === 'boolean' ? override : !state.megaMenuOpen;
  render();
};

window.setPriceRange = (val) => {
  state.priceRange = Number(val);
  render();
};

window.toggleInStockOnly = () => {
  state.inStockOnly = !state.inStockOnly;
  render();
};

window.setSelectedBrand = (brand) => {
  state.selectedBrand = brand;
  render();
};

window.openMapModal = () => { state.mapModalOpen = true; render(); };
window.closeMapModal = () => { state.mapModalOpen = false; render(); };
window.selectDepot = (areaName) => {
  state.selectedLocation = areaName;
  saveState();
  render();
  window.showToast(`Selected Depot: ${areaName}`, 'fa-warehouse');
};

window.openLocationModal = () => { state.locationModalOpen = true; render(); };
window.closeLocationModal = () => { state.locationModalOpen = false; render(); };
window.setLocation = (locationName) => {
  state.selectedLocation = locationName;
  state.locationModalOpen = false;
  saveState();
  render();
  window.showToast(`Delivery location set to ${locationName}`, 'fa-location-dot');
};

window.useGpsLocation = () => {
  state.selectedLocation = "Greater Accra (GPS)";
  state.locationModalOpen = false;
  saveState();
  render();
  window.showToast("GPS Location set to Greater Accra", "fa-crosshairs");
};

window.selectOnMap = () => {
  state.locationModalOpen = false;
  state.mapModalOpen = true;
  render();
};

window.openRFQModal = () => { state.rfqModalOpen = true; render(); };
window.closeRFQModal = () => { state.rfqModalOpen = false; render(); };
window.printRFQ = async () => {
  await saveRFQQuoteApi({
    buyerName: 'Merchant Buyer',
    deliveryZone: state.selectedLocation,
    items: state.cart,
    grandTotal: cartSubtotal + (cartCount > 0 ? 50 : 0)
  });
  window.showToast("Generating PDF Invoice & Saving RFQ in DB...", "fa-file-arrow-down");
  setTimeout(() => window.print(), 500);
};

window.startCheckoutFlow = () => {
  state.cartOpen = false;
  state.checkoutModal = {
    open: true,
    step: 1,
    method: 'momo',
    phone: '',
    provider: 'mtn',
    orderId: `GH-WH-${Math.floor(1000 + Math.random() * 9000)}`,
    buyerName: ''
  };
  render();
};

window.closeCheckoutModal = () => { state.checkoutModal.open = false; render(); };
window.setCheckoutStep = (stepNum) => { state.checkoutModal.step = stepNum; render(); };
window.setMoMoProvider = (prov) => { state.checkoutModal.provider = prov; render(); };
window.triggerMoMoPrompt = () => { state.checkoutModal.step = 3; render(); };
window.confirmMoMoPaid = async () => {
  const nameInput = document.querySelector("#chk-name")?.value || 'Merchant Buyer';
  const orderRes = await placeMoMoOrder({
    buyerName: nameInput,
    location: state.selectedLocation,
    totalAmount: cartSubtotal + 50.00,
    items: Object.entries(state.cart).map(([key, qty]) => {
      const [pId, tId] = key.split('_');
      const p = PRODUCTS.find(prod => prod.id === pId);
      return { id: pId, title: p ? p.title : '', tier: tId, qty };
    }),
    momoNumber: '0244123456',
    momoProvider: state.checkoutModal.provider
  });
  
  if (orderRes && orderRes.orderId) {
    state.checkoutModal.orderId = orderRes.orderId;
    state.supplierOrders.unshift({
      id: orderRes.orderId,
      buyer: nameInput,
      location: state.selectedLocation,
      total: cartSubtotal + 50.00,
      items: `${Object.keys(state.cart).length} Cart Items`,
      status: 'Factory Processing',
      date: new Date().toISOString().split('T')[0]
    });
  }

  state.checkoutModal.step = 4;
  state.cart = {};
  saveState();
  render();
  window.showToast("Payment Authorized & Saved to DB!", "fa-circle-check");
};

window.openTrackingModal = () => { state.trackingModal.open = true; render(); };
window.closeTrackingModal = () => { state.trackingModal.open = false; render(); };
window.searchTrackingOrder = async () => {
  const inputVal = document.querySelector("#track-input")?.value || state.trackingModal.trackingId;
  state.trackingModal.trackingId = inputVal;
  
  const apiOrder = await trackOrderApi(inputVal);
  if (apiOrder) {
    state.trackingModal.activeOrder = apiOrder;
  } else {
    const found = state.supplierOrders.find(o => o.id.toLowerCase() === inputVal.trim().toLowerCase());
    state.trackingModal.activeOrder = found || null;
  }
  render();
};

window.updateOrderStatus = async (ordId) => {
  const ord = state.supplierOrders.find(o => o.id === ordId);
  if (ord) {
    if (ord.status === 'Factory Processing') ord.status = 'In Transit';
    else if (ord.status === 'In Transit') ord.status = 'Delivered';
    else ord.status = 'Factory Processing';
    
    await updateOrderStatusApi(ordId, ord.status);
    render();
    window.showToast(`Order ${ordId} updated in DB to ${ord.status}`, 'fa-truck-check');
  }
};

window.toggleTheme = () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.className = state.theme;
  saveState();
  render();
  window.showToast(`Switched to ${state.theme.toUpperCase()} mode`, 'fa-circle-half-stroke');
};

window.selectTier = (productId, tierId) => {
  state.selectedTiers[productId] = tierId;
  render();
};

window.setCategory = (catName) => {
  state.category = catName;
  state.subcategory = 'All';
  state.activeTab = 'All';
  render();
  window.scrollToProducts();
};

window.setSlide = (idx) => {
  state.currentSlideIndex = idx;
  render();
};

window.scrollToProducts = () => {
  document.querySelector("#products-section")?.scrollIntoView({ behavior: 'smooth' });
};

window.updateCart = (productId, tierId, change) => {
  const cartKey = `${productId}_${tierId}`;
  const currentQty = state.cart[cartKey] || 0;
  const newQty = currentQty + change;
  
  if (newQty <= 0) {
    delete state.cart[cartKey];
    window.showToast('Item removed from cart', 'fa-trash-can');
  } else {
    state.cart[cartKey] = newQty;
    if (change > 0) window.showToast('Wholesale item added!', 'fa-truck-ramp-box');
  }

  saveState();
  render();
};

window.toggleWishlist = (productId) => {
  if (state.wishlist.has(productId)) {
    state.wishlist.delete(productId);
    window.showToast('Removed from Wishlist', 'fa-heart-crack');
  } else {
    state.wishlist.add(productId);
    window.showToast('Added to Wishlist!', 'fa-heart');
  }
  saveState();
  render();
};

window.toggleCart = (open) => { state.cartOpen = open; render(); };
window.openQuickView = (productId) => {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (prod) {
    state.quickViewProduct = prod;
    render();
  }
};

window.closeQuickView = () => { state.quickViewProduct = null; render(); };
window.openAuthModal = (mode = 'login') => { state.authModal = { open: true, mode }; render(); };
window.closeAuthModal = () => { state.authModal.open = false; render(); };
window.setAuthMode = (mode) => { state.authModal.mode = mode; render(); };
window.handleAuthSubmit = () => { window.closeAuthModal(); window.showToast('Account logged in!', 'fa-circle-check'); };
window.openBarcodeScanner = () => { state.barcodeScannerOpen = true; render(); };
window.closeBarcodeScanner = () => { state.barcodeScannerOpen = false; render(); };
window.simulateBarcodeMatch = () => {
  state.barcodeScannerOpen = false;
  state.searchQuery = "Chamex A4";
  render();
  window.showToast('Stationery barcode matched!', 'fa-barcode');
};

window.resetFilters = () => {
  state.selectedHub = 'All';
  state.searchQuery = '';
  state.catSearchSidebar = '';
  state.category = 'All';
  state.subcategory = 'All';
  state.activeTab = 'All';
  state.priceRange = 15000;
  state.inStockOnly = false;
  state.selectedBrand = 'All';
  render();
};

window.showToast = (msg, icon = 'fa-info-circle') => {
  const container = document.querySelector("#toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--gold-primary);"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => { toast.remove(); }, 3000);
};

// Hero slider timer
setInterval(() => {
  state.currentSlideIndex = (state.currentSlideIndex + 1) % HERO_SLIDES.length;
  if (!state.cartOpen && !state.quickViewProduct && !state.authModal.open && !state.barcodeScannerOpen && !state.locationModalOpen && !state.mapModalOpen && !state.rfqModalOpen && !state.checkoutModal.open && !state.trackingModal.open && !state.megaMenuOpen) {
    render();
  }
}, 5000);

// Initial render
render();