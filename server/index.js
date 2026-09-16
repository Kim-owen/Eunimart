import express from 'express';
import cors from 'cors';
import { initDb, dbAll, dbGet, dbRun } from './db.js';

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Initialize Database before starting server routes
initDb().then(() => {
  console.log("SQLite Relational Database initialized successfully.");
}).catch((err) => {
  console.error("Failed to initialize database:", err);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Akua Market REST API Backend is running', timestamp: new Date() });
});

// Get all Department Hubs
app.get('/api/hubs', async (req, res) => {
  try {
    const hubs = await dbAll("SELECT * FROM hubs");
    res.json(hubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Categories
app.get('/api/categories', async (req, res) => {
  try {
    const { hub } = req.query;
    let sql = "SELECT * FROM categories";
    let params = [];
    if (hub && hub !== 'All') {
      sql += " WHERE hub = ?";
      params.push(hub);
    }
    const categories = await dbAll(sql, params);
    const parsed = categories.map(c => ({
      ...c,
      subcategories: JSON.parse(c.subcategories || '[]')
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Products with filtering & sorting
app.get('/api/products', async (req, res) => {
  try {
    const { hub, category, subcategory, search, maxPrice, brand, inStock, sortBy } = req.query;

    let sql = `
      SELECT p.*, 
        JSON_GROUP_ARRAY(
          JSON_OBJECT(
            'id', pt.tier_id,
            'label', pt.label,
            'price', pt.price,
            'retailPrice', pt.retail_price,
            'unitCount', pt.unit_count,
            'savings', pt.savings
          )
        ) as tiers_json
      FROM products p
      LEFT JOIN product_tiers pt ON p.id = pt.product_id
      WHERE 1=1
    `;
    let params = [];

    if (hub && hub !== 'All') {
      sql += " AND p.hub = ?";
      params.push(hub);
    }

    if (category && category !== 'All') {
      sql += " AND p.category = ?";
      params.push(category);
    }

    if (subcategory && subcategory !== 'All') {
      sql += " AND p.subcategory = ?";
      params.push(subcategory);
    }

    if (search) {
      const q = `%${search.toLowerCase()}%`;
      sql += " AND (LOWER(p.title) LIKE ? OR LOWER(p.category) LIKE ? OR LOWER(p.factory) LIKE ?)";
      params.push(q, q, q);
    }

    if (brand && brand !== 'All') {
      sql += " AND LOWER(p.factory) LIKE ?";
      params.push(`%${brand.toLowerCase()}%`);
    }

    if (inStock === 'true') {
      sql += " AND p.stock > 0";
    }

    sql += " GROUP BY p.id";

    const rows = await dbAll(sql, params);
    
    let products = rows.map(r => ({
      ...r,
      isHot: Boolean(r.is_hot),
      tiers: JSON.parse(r.tiers_json || '[]')
    }));

    if (maxPrice) {
      const limit = Number(maxPrice);
      products = products.filter(p => p.tiers.some(t => t.price <= limit));
    }

    if (sortBy === 'price-low') {
      products.sort((a, b) => (a.tiers[0]?.price || 0) - (b.tiers[0]?.price || 0));
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => (b.tiers[0]?.price || 0) - (a.tiers[0]?.price || 0));
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const prod = await dbGet("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    
    const tiers = await dbAll("SELECT tier_id as id, label, price, retail_price as retailPrice, unit_count as unitCount, savings FROM product_tiers WHERE product_id = ?", [req.params.id]);
    
    res.json({
      ...prod,
      isHot: Boolean(prod.is_hot),
      tiers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Place New MoMo Order
app.post('/api/orders', async (req, res) => {
  try {
    const { buyerName, location, totalAmount, items, momoNumber, momoProvider } = req.body;
    const orderId = `GH-WH-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toISOString().split('T')[0];

    await dbRun(`
      INSERT INTO orders (id, buyer_name, location, total_amount, items_json, status, date, momo_number, momo_provider)
      VALUES (?, ?, ?, ?, ?, 'Factory Processing', ?, ?, ?)
    `, [orderId, buyerName || 'Merchant Buyer', location || 'Accra', totalAmount || 0, JSON.stringify(items || []), dateStr, momoNumber || '', momoProvider || 'MTN MoMo']);

    res.json({ success: true, orderId, status: 'Factory Processing', date: dateStr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Track Order Endpoint
app.get('/api/orders/track/:id', async (req, res) => {
  try {
    const order = await dbGet("SELECT * FROM orders WHERE LOWER(id) = LOWER(?)", [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({
      id: order.id,
      buyer: order.buyer_name,
      location: order.location,
      total: order.total_amount,
      items: JSON.parse(order.items_json || '[]'),
      status: order.status,
      date: order.date
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status (Supplier Portal)
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await dbRun("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true, orderId: req.params.id, newStatus: status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save Pro-Forma RFQ Quote
app.post('/api/rfq', async (req, res) => {
  try {
    const { buyerName, deliveryZone, items, grandTotal } = req.body;
    const quoteCode = `QUOTE-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toLocaleDateString('en-GH');

    await dbRun(`
      INSERT INTO rfq_quotes (quote_code, buyer_name, delivery_zone, items_json, grand_total, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [quoteCode, buyerName || 'Wholesale Buyer', deliveryZone || 'Greater Accra', JSON.stringify(items || []), grandTotal || 0, dateStr]);

    res.json({ success: true, quoteCode, grandTotal, date: dateStr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Delivery Zones
app.get('/api/delivery-zones', async (req, res) => {
  try {
    const zones = await dbAll("SELECT * FROM delivery_zones");
    if (zones.length === 0) {
      // Return default zones if table empty
      return res.json([
        { id: "1", zone_name: "Central Accra Metro", delivery_fee: 25.00, estimated_hours: "Same Day (2-4 Hrs)", is_active: 1 },
        { id: "2", zone_name: "Tema & Spintex Corridor", delivery_fee: 35.00, estimated_hours: "Same Day (4-6 Hrs)", is_active: 1 },
        { id: "3", zone_name: "East Legon & Madina Hub", delivery_fee: 30.00, estimated_hours: "Same Day (3-5 Hrs)", is_active: 1 },
        { id: "4", zone_name: "Kumasi & Regional Cities", delivery_fee: 60.00, estimated_hours: "Next Day (24 Hrs)", is_active: 1 }
      ]);
    }
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save / Update Delivery Zone
app.post('/api/delivery-zones', async (req, res) => {
  try {
    const { id, zone_name, delivery_fee, estimated_hours, is_active } = req.body;
    const zoneId = id || `zone-${Date.now()}`;
    await dbRun(`
      CREATE TABLE IF NOT EXISTS delivery_zones (
        id TEXT PRIMARY KEY,
        zone_name TEXT NOT NULL,
        delivery_fee REAL DEFAULT 0,
        estimated_hours TEXT,
        is_active INTEGER DEFAULT 1
      )
    `);
    await dbRun(`
      INSERT OR REPLACE INTO delivery_zones (id, zone_name, delivery_fee, estimated_hours, is_active)
      VALUES (?, ?, ?, ?, ?)
    `, [zoneId, zone_name, delivery_fee || 0, estimated_hours || '24-48 Hours', is_active ? 1 : 0]);
    res.json({ success: true, id: zoneId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Site Settings by Key
app.get('/api/site-settings', async (req, res) => {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL
      )
    `);
    const rows = await dbAll("SELECT * FROM site_settings");
    const settings = {};
    rows.forEach(r => {
      try { settings[r.key] = JSON.parse(r.value_json); } catch(e) { settings[r.key] = r.value_json; }
    });
    // Defaults if missing
    if (!settings.theme) settings.theme = { preset: "emerald", radius: "1rem", fontFamily: "Inter", darkMode: true };
    if (!settings.homepage_sections) settings.homepage_sections = [
      { id: "announcement", label: "Announcement Bar", visible: true },
      { id: "hero", label: "Hero Showcase", visible: true },
      { id: "categories", label: "Categories Grid", visible: true },
      { id: "featured", label: "Featured Products", visible: true },
      { id: "promo", label: "Promo Banners", visible: true },
      { id: "trust", label: "Value Propositions", visible: true }
    ];
    if (!settings.hero_media) settings.hero_media = {
      type: "video",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-shopping-cart-in-a-supermarket-42907-large.mp4",
      posterUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      headline: "Direct from Ghana Producers to Your Door",
      badge: "Express 2-Hour Delivery",
      autoplay: true,
      muted: true,
      loop: true
    };
    if (!settings.store_policies) settings.store_policies = { minOrderAmount: 50, businessHours: "8:00 AM - 10:00 PM GMT", maintenanceMode: false, maintenanceMessage: "Store is currently undergoing routine inventory refresh." };
    if (!settings.notifications) settings.notifications = { adminPhone: "+233501234567", adminEmail: "alerts@akuamarket.com", customerSmsEnabled: true, customerEmailEnabled: true, staffAlertsEnabled: true };
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Site Settings
app.post('/api/site-settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    await dbRun(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL
      )
    `);
    await dbRun(`
      INSERT OR REPLACE INTO site_settings (key, value_json)
      VALUES (?, ?)
    `, [key, JSON.stringify(value)]);
    res.json({ success: true, key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Product Create/Update Route
app.post('/api/products/manage', async (req, res) => {
  try {
    const { id, title, category, subcategory, hub, size, factory, stock, price, image, is_hot, sku } = req.body;
    const prodId = id || `p-${Date.now()}`;
    const productSku = sku || `SKU-${Math.floor(10000 + Math.random() * 90000)}`;

    await dbRun(`
      INSERT OR REPLACE INTO products (id, title, category, subcategory, hub, size, factory, stock, rating, reviews, image, is_hot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 4.8, 10, ?, ?)
    `, [prodId, title, category || 'Groceries & Food Staples', subcategory || 'Staples', hub || 'Supermarket', size || 'Pack', factory || 'Akua Direct', Number(stock) || 50, image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', is_hot ? 1 : 0]);

    // Handle Tier pricing
    if (price) {
      await dbRun("DELETE FROM product_tiers WHERE product_id = ?", [prodId]);
      await dbRun(`
        INSERT INTO product_tiers (product_id, tier_id, label, price, retail_price, unit_count, savings)
        VALUES (?, 'unit', 'Single Unit', ?, ?, 1, '')
      `, [prodId, Number(price), Number(price) * 1.2]);
    }

    res.json({ success: true, id: prodId, sku: productSku });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Product Delete Route
app.delete('/api/products/:id', async (req, res) => {
  try {
    await dbRun("DELETE FROM products WHERE id = ?", [req.params.id]);
    await dbRun("DELETE FROM product_tiers WHERE product_id = ?", [req.params.id]);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payment Gateway Webhook Callback Handler (Paystack / Stripe)
app.post('/api/webhooks/paystack', async (req, res) => {
  try {
    const event = req.body;
    console.log("Received Payment Webhook Event:", event?.event || 'charge.success');
    
    // Auto-update order if reference present
    if (event?.data?.reference) {
      await dbRun("UPDATE orders SET status = 'Factory Processing' WHERE id = ?", [event.data.reference]);
    }
    
    res.json({ status: 'success', message: 'Webhook event processed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multi-Channel Notification Trigger (SMS / Email Simulation)
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { channel, recipient, message, subject } = req.body;
    console.log(`[TRANSACTIONAL ALERT] ${channel?.toUpperCase()} Sent to ${recipient}: "${subject || 'Notification'}" - ${message}`);
    res.json({ success: true, timestamp: new Date().toISOString(), channel, recipient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Depots
app.get('/api/depots', async (req, res) => {
  try {
    const depots = await dbAll("SELECT id, name, area, top_pos as top, left_pos as left, eta FROM depots");
    res.json(depots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Akua Market Express REST API Server running on http://localhost:${PORT}`);
});

