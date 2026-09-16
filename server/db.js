import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'akuamarket.db');

const db = new sqlite3.Database(dbPath);

// Helper for promise-based queries
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export async function initDb() {
  console.log("Initializing SQLite Database at:", dbPath);

  // Enable foreign keys
  await dbRun("PRAGMA foreign_keys = ON");

  // Create Hubs table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS hubs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      badge TEXT
    )
  `);

  // Create Categories table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      hub TEXT NOT NULL,
      icon TEXT,
      count INTEGER DEFAULT 0,
      badge TEXT,
      subcategories TEXT,
      banner_img TEXT
    )
  `);

  // Create Products table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      hub TEXT NOT NULL,
      size TEXT,
      factory TEXT,
      stock INTEGER DEFAULT 100,
      rating REAL DEFAULT 5.0,
      reviews INTEGER DEFAULT 0,
      image TEXT,
      is_hot INTEGER DEFAULT 0
    )
  `);

  // Create Product Wholesale Tiers table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS product_tiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      tier_id TEXT NOT NULL,
      label TEXT NOT NULL,
      price REAL NOT NULL,
      retail_price REAL,
      unit_count INTEGER DEFAULT 1,
      savings TEXT,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    )
  `);

  // Create Orders table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      buyer_name TEXT,
      location TEXT,
      total_amount REAL,
      items_json TEXT,
      status TEXT,
      date TEXT,
      momo_number TEXT,
      momo_provider TEXT
    )
  `);

  // Create RFQ Quotes table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS rfq_quotes (
      quote_code TEXT PRIMARY KEY,
      buyer_name TEXT,
      delivery_zone TEXT,
      items_json TEXT,
      grand_total REAL,
      date TEXT
    )
  `);

  // Create Depots table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS depots (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      area TEXT NOT NULL,
      top_pos TEXT,
      left_pos TEXT,
      eta TEXT
    )
  `);

  await seedData();
}

async function seedData() {
  const existingProducts = await dbAll("SELECT COUNT(*) as count FROM products");
  if (existingProducts[0].count > 0) {
    console.log("Database already seeded with products.");
    return;
  }

  console.log("Seeding database with Supermarket & Online Mall initial dataset...");

  // Seed Hubs
  const hubs = [
    { id: "All", name: "All Superstore", icon: "fa-store", color: "#f7c119", badge: "" },
    { id: "Supermarket", name: "Supermarket Express", icon: "fa-cart-shopping", color: "#10b981", badge: "GROCERIES & FRESH" },
    { id: "Mall", name: "Online Shopping Mall", icon: "fa-building-columns", color: "#3b82f6", badge: "TECH, FASHION & HOME" }
  ];

  for (const h of hubs) {
    await dbRun("INSERT OR REPLACE INTO hubs (id, name, icon, color, badge) VALUES (?, ?, ?, ?, ?)", [h.id, h.name, h.icon, h.color, h.badge]);
  }

  // Seed Categories
  const categories = [
    { name: "Groceries & Food Staples", hub: "Supermarket", icon: "fa-basket-shopping", count: 420, badge: "Supermarket Essential", subcategories: JSON.stringify(["Rice & Grains", "Cooking Oils & Fats", "Pasta & Noodles", "Spices & Seasoning", "Flour & Sugar"]), banner_img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" },
    { name: "Fresh Produce & Bakery", hub: "Supermarket", icon: "fa-carrot", count: 210, badge: "Daily Fresh", subcategories: JSON.stringify(["Fresh Fruits", "Vegetables", "Artisanal Bread", "Dairy & Eggs"]), banner_img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80" },
    { name: "Beverages & Cold Drinks", hub: "Supermarket", icon: "fa-wine-bottle", count: 310, badge: "Chilled & Bulk", subcategories: JSON.stringify(["Juices & Smoothies", "Mineral Water", "Tea & Coffee", "Energy & Soda Drinks", "Malt Drinks"]), banner_img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80" },
    { name: "Household & Cleaning", hub: "Supermarket", icon: "fa-broom", count: 240, badge: "Hygiene Pack", subcategories: JSON.stringify(["Laundry Detergents", "Toilet & Tissue Papers", "Surface Cleaners", "Dishwashing & Soaps"]), banner_img: "https://images.unsplash.com/photo-1584555613497-9ecf7e3d0a4a?auto=format&fit=crop&w=800&q=80" },
    { name: "Baby & Infant Essentials", hub: "Supermarket", icon: "fa-baby", count: 155, badge: "Gentle Care", subcategories: JSON.stringify(["Diapers & Wipes", "Baby Food & Formula", "Skincare & Bath"]), banner_img: "https://images.unsplash.com/photo-1604917019112-7d8f8d7c5c9f?auto=format&fit=crop&w=800&q=80" },
    { name: "Snacks & Confectionery", hub: "Supermarket", icon: "fa-cookie-bite", count: 195, badge: "Sweet Treats", subcategories: JSON.stringify(["Biscuits & Crackers", "Chocolates & Candy", "Nuts & Dried Fruits", "Chips & Popcorn"]), banner_img: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80" },
    { name: "Frozen & Chilled Foods", hub: "Supermarket", icon: "fa-snowflake", count: 120, badge: "Cold Chain Logistics", subcategories: JSON.stringify(["Frozen Poultry & Meat", "Seafood & Fish", "Ice Cream & Desserts"]), banner_img: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?auto=format&fit=crop&w=800&q=80" },
    { name: "Stationery & Office Supplies", hub: "Mall", icon: "fa-pen-ruler", count: 280, badge: "Palace Superstore Wholesale", subcategories: JSON.stringify(["A4 Copy Paper", "Writing & Pens", "Notebooks & Books", "Calculators", "Art & Craft"]), banner_img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80" },
    { name: "Electronics & Tech Mall", hub: "Mall", icon: "fa-tv", count: 185, badge: "Mall Outlet", subcategories: JSON.stringify(["Smart 4K TVs", "Commercial Audio", "Kitchen Appliances", "Mobile Accessories"]), banner_img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80" },
    { name: "Health & Personal Care", hub: "Mall", icon: "fa-sparkles", count: 220, badge: "Self Care", subcategories: JSON.stringify(["Body Wash & Soap", "Haircare & Oils", "Oral Care", "Skincare & Lotions"]), banner_img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80" },
    { name: "Home & Kitchen Living", hub: "Mall", icon: "fa-couch", count: 160, badge: "Home Style", subcategories: JSON.stringify(["Cookware & Sets", "Food Storage Containers", "Bedding & Towels"]), banner_img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    { name: "Fashion & Lifestyle Mall", hub: "Mall", icon: "fa-shirt", count: 140, badge: "Mall Fashion", subcategories: JSON.stringify(["African Print Apparel", "Footwear & Sandals", "Bags & Luggage"]), banner_img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80" }
  ];

  for (const c of categories) {
    await dbRun("INSERT OR REPLACE INTO categories (name, hub, icon, count, badge, subcategories, banner_img) VALUES (?, ?, ?, ?, ?, ?, ?)", [c.name, c.hub, c.icon, c.count, c.badge, c.subcategories, c.banner_img]);
  }

  // Seed Products & Tiers
  const products = [
    {
      id: "s1", title: "Chamex Premium A4 Copy Paper 80GSM", category: "Stationery & Office Supplies", subcategory: "A4 Copy Paper", hub: "Mall", size: "5 Reams Box (2,500 Sheets)", factory: "Sylvamo International Paper", stock: 520, rating: 4.9, reviews: 184, image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80", is_hot: 1,
      tiers: [
        { tier_id: "unit", label: "Single Ream (500 Sheets)", price: 48.00, retail_price: 58.00, unit_count: 1, savings: "" },
        { tier_id: "carton", label: "Wholesale Box (5 Reams)", price: 220.00, retail_price: 290.00, unit_count: 5, savings: "SAVE 24%" },
        { tier_id: "pallet", label: "Factory Pallet (50 Boxes)", price: 9800.00, retail_price: 14500.00, unit_count: 50, savings: "SAVE 32% (FACTORY RATE)" }
      ]
    },
    {
      id: "s2", title: "Bic Cristal Medium Point Blue Ballpoint Pens", category: "Stationery & Office Supplies", subcategory: "Writing & Pens", hub: "Mall", size: "Box of 50 Pens", factory: "BIC Ghana Factory Direct", stock: 890, rating: 4.9, reviews: 320, image: "https://images.unsplash.com/photo-1585336261026-9136355599f8?auto=format&fit=crop&w=800&q=80", is_hot: 1,
      tiers: [
        { tier_id: "unit", label: "Pack of 10 Pens", price: 20.00, retail_price: 25.00, unit_count: 1, savings: "" },
        { tier_id: "carton", label: "Wholesale Box (50 Pens)", price: 85.00, retail_price: 125.00, unit_count: 5, savings: "SAVE 32%" },
        { tier_id: "pallet", label: "Factory Carton (20 Boxes / 1000 Pens)", price: 1550.00, retail_price: 2500.00, unit_count: 20, savings: "SAVE 38% (FACTORY RATE)" }
      ]
    },
    {
      id: "p1", title: "Royal Aroma Premium Long Grain Fragrant Rice", category: "Groceries & Food Staples", subcategory: "Rice & Grains", hub: "Supermarket", size: "5 KG Bag", factory: "Ghana Agro Mills Direct", stock: 450, rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", is_hot: 1,
      tiers: [
        { tier_id: "unit", label: "Single Bag", price: 115.00, retail_price: 135.00, unit_count: 1, savings: "" },
        { tier_id: "carton", label: "Wholesale Carton (10 Bags)", price: 920.00, retail_price: 1350.00, unit_count: 10, savings: "SAVE 20%" },
        { tier_id: "pallet", label: "Factory Pallet (50 Bags)", price: 4100.00, retail_price: 6750.00, unit_count: 50, savings: "SAVE 32% (FACTORY RATE)" }
      ]
    },
    {
      id: "p2", title: "SunGold Pure Refined Vegetable Cooking Oil", category: "Groceries & Food Staples", subcategory: "Cooking Oils & Fats", hub: "Supermarket", size: "5 Litres Container", factory: "Wilmar Africa Factory Direct", stock: 320, rating: 4.8, reviews: 164, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80", is_hot: 1,
      tiers: [
        { tier_id: "unit", label: "Single Container", price: 145.00, retail_price: 170.00, unit_count: 1, savings: "" },
        { tier_id: "carton", label: "Carton Box (4 Packs)", price: 520.00, retail_price: 680.00, unit_count: 4, savings: "SAVE 18%" },
        { tier_id: "pallet", label: "Factory Bulk (20 Cartons)", price: 2350.00, retail_price: 3400.00, unit_count: 20, savings: "SAVE 30% (FACTORY RATE)" }
      ]
    },
    {
      id: "p5", title: "Milo Energy Cocoa Food Drink Powder", category: "Beverages & Cold Drinks", subcategory: "Tea & Coffee", hub: "Supermarket", size: "800g Refill Tin", factory: "Nestlé Ghana Direct", stock: 500, rating: 4.9, reviews: 420, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80", is_hot: 1,
      tiers: [
        { tier_id: "unit", label: "Single Tin", price: 68.00, retail_price: 82.00, unit_count: 1, savings: "" },
        { tier_id: "carton", label: "Carton Case (12 Tins)", price: 720.00, retail_price: 984.00, unit_count: 12, savings: "SAVE 20%" },
        { tier_id: "pallet", label: "Factory Pallet (40 Cases)", price: 2150.00, retail_price: 3280.00, unit_count: 40, savings: "SAVE 34% (FACTORY RATE)" }
      ]
    },
    {
      id: "b1", title: "Bel-Aqua Purified Natural Mineral Water", category: "Beverages & Cold Drinks", subcategory: "Mineral Water", hub: "Supermarket", size: "Pack of 12 Bottles (750ml)", factory: "Blow Chem Industries Ghana", stock: 1200, rating: 5.0, reviews: 640, image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80", is_hot: 1,
      tiers: [
        { tier_id: "unit", label: "Single Pack (12 Bottles)", price: 24.00, retail_price: 30.00, unit_count: 1, savings: "" },
        { tier_id: "carton", label: "Wholesale Bundle (5 Packs / 60 Bottles)", price: 105.00, retail_price: 150.00, unit_count: 5, savings: "SAVE 30%" },
        { tier_id: "pallet", label: "Factory Truckload (50 Bundles)", price: 4800.00, retail_price: 7500.00, unit_count: 50, savings: "SAVE 36% (FACTORY RATE)" }
      ]
    },
    {
      id: "p7", title: "Smart 4K Ultra HD Commercial Display TV 55\"", category: "Electronics & Tech Mall", subcategory: "Smart 4K TVs", hub: "Mall", size: "55 Inch Display", factory: "Hisense Ghana Factory Outlet", stock: 45, rating: 4.9, reviews: 74, image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80", is_hot: 1,
      tiers: [
        { tier_id: "unit", label: "Single TV Unit", price: 3850.00, retail_price: 4500.00, unit_count: 1, savings: "" },
        { tier_id: "carton", label: "Wholesale Crate (3 Units)", price: 10600.00, retail_price: 13500.00, unit_count: 3, savings: "SAVE 21%" },
        { tier_id: "pallet", label: "Factory Distributor Lot (10 Units)", price: 32500.00, retail_price: 45000.00, unit_count: 10, savings: "SAVE 28% (FACTORY RATE)" }
      ]
    }
  ];

  for (const p of products) {
    await dbRun(`
      INSERT OR REPLACE INTO products (id, title, category, subcategory, hub, size, factory, stock, rating, reviews, image, is_hot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [p.id, p.title, p.category, p.subcategory, p.hub, p.size, p.factory, p.stock, p.rating, p.reviews, p.image, p.is_hot]);

    for (const t of p.tiers) {
      await dbRun(`
        INSERT INTO product_tiers (product_id, tier_id, label, price, retail_price, unit_count, savings)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [p.id, t.tier_id, t.label, t.price, t.retail_price, t.unit_count, t.savings]);
    }
  }

  // Seed Initial Orders
  const initialOrders = [
    { id: "GH-WH-9482", buyer_name: "Kwame & Sons Supermarket", location: "Greater Accra", total_amount: 4620.00, items_json: JSON.stringify([{ title: "Royal Aroma Rice Carton", qty: 5 }]), status: "In Transit", date: "2026-08-26", momo_number: "0244112233", momo_provider: "MTN MoMo" },
    { id: "GH-WH-8831", buyer_name: "East Legon Mart", location: "East Legon", total_amount: 2150.00, items_json: JSON.stringify([{ title: "SunGold Oil Carton", qty: 2 }]), status: "Factory Processing", date: "2026-08-26", momo_number: "0200998877", momo_provider: "Telecel Cash" },
    { id: "GH-WH-7210", buyer_name: "Asante Wholesale Ltd", location: "Kumasi Central", total_amount: 10600.00, items_json: JSON.stringify([{ title: "Hisense 55 Inch TV Crate", qty: 1 }]), status: "Delivered", date: "2026-08-25", momo_number: "0277334455", momo_provider: "AT Money" }
  ];

  for (const o of initialOrders) {
    await dbRun(`
      INSERT OR REPLACE INTO orders (id, buyer_name, location, total_amount, items_json, status, date, momo_number, momo_provider)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [o.id, o.buyer_name, o.location, o.total_amount, o.items_json, o.status, o.date, o.momo_number, o.momo_provider]);
  }

  // Seed Depots
  const depots = [
    { id: "depot1", name: "Accra Central Depot", area: "Greater Accra", top_pos: "45%", left_pos: "48%", eta: "Same-Day Freight" },
    { id: "depot2", name: "Tema Port Logistics Warehouse", area: "Tema", top_pos: "52%", left_pos: "58%", eta: "Same-Day Freight" },
    { id: "depot3", name: "Kumasi Commercial Wholesale Depot", area: "Kumasi Central", top_pos: "35%", left_pos: "38%", eta: "Next-Day Freight" },
    { id: "depot4", name: "Takoradi Harbor Distribution Hub", area: "Takoradi", top_pos: "68%", left_pos: "28%", eta: "1-2 Days Freight" },
    { id: "depot5", name: "Tamale Northern Warehouse", area: "Tamale", top_pos: "18%", left_pos: "42%", eta: "2 Days Freight" }
  ];

  for (const d of depots) {
    await dbRun("INSERT OR REPLACE INTO depots (id, name, area, top_pos, left_pos, eta) VALUES (?, ?, ?, ?, ?, ?)", [d.id, d.name, d.area, d.top_pos, d.left_pos, d.eta]);
  }

  console.log("Database successfully seeded with initial supermarket & mall records.");
}
