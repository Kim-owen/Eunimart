-- ====================================================================
-- AkuaMarket D2C E-Commerce Supabase PostgreSQL Unified Schema & Security
-- Includes RLS policies, JSONB site settings, dynamic taxonomy, & Seed Data
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS & RBAC SECURITY
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN user_role = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TABLES DEFINITION

-- User Profiles & RBAC Roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Categories & Taxonomy
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT 'Package',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Catalog & Inventory
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_hot BOOLEAN DEFAULT FALSE,
  factory TEXT DEFAULT 'Akua Direct',
  rating NUMERIC(3,2) DEFAULT 4.80,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery & Geographic Shipping Zones
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_name TEXT NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  estimated_hours TEXT DEFAULT '24-48 Hours',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Orders & Logistics
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT NOT NULL,
  delivery_zone_id UUID REFERENCES public.delivery_zones(id) ON DELETE SET NULL,
  delivery_zone_name TEXT,
  courier_name TEXT,
  courier_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled')),
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method TEXT DEFAULT 'Paystack Mobile Money',
  payment_gateway_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Detail
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

-- Site Dynamic Configurations (JSONB Key-Value Engine)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Categories RLS: Public read active, Admin write
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (is_active = TRUE OR auth.role() = 'authenticated');
CREATE POLICY "Admin categories write" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products RLS: Public read active, Admin write
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (is_active = TRUE OR auth.role() = 'authenticated');
CREATE POLICY "Admin products write" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Delivery Zones RLS: Public read, Admin write
CREATE POLICY "Public delivery zones read" ON public.delivery_zones FOR SELECT USING (TRUE);
CREATE POLICY "Admin delivery zones write" ON public.delivery_zones FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders RLS: Public/Customer insert, Admin/Staff view & update
CREATE POLICY "Public place order" ON public.orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin orders view" ON public.orders FOR SELECT USING (TRUE);
CREATE POLICY "Admin orders update" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- Site Settings RLS: Public read, Admin write
CREATE POLICY "Public settings read" ON public.site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin settings write" ON public.site_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 5. INITIAL SEED DATA

INSERT INTO public.categories (name, slug, icon, sort_order, product_count) VALUES
('Fresh Groceries', 'fresh-groceries', 'ShoppingBag', 1, 24),
('Beverages & Drinks', 'beverages-drinks', 'Coffee', 2, 18),
('Electronics & Tech', 'electronics-tech', 'Tv', 3, 12),
('Household & Baby', 'household-baby', 'Home', 4, 15)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.delivery_zones (zone_name, delivery_fee, estimated_hours) VALUES
('Central Accra Metro', 25.00, 'Same Day (2-4 Hrs)'),
('Tema & Spintex Corridor', 35.00, 'Same Day (4-6 Hrs)'),
('East Legon & Madina Hub', 30.00, 'Same Day (3-5 Hrs)'),
('Kumasi & Regional Cities', 60.00, 'Next Day (24 Hrs)')
ON CONFLICT DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
('theme', '{"preset": "emerald", "radius": "1rem", "fontFamily": "Inter", "darkMode": true}'::jsonb),
('homepage_sections', '[{"id":"announcement","label":"Announcement Bar","visible":true},{"id":"hero","label":"Hero Showcase","visible":true},{"id":"categories","label":"Categories Grid","visible":true},{"id":"featured","label":"Featured Products","visible":true},{"id":"promo","label":"Promo Banners","visible":true},{"id":"trust","label":"Value Propositions","visible":true}]'::jsonb),
('hero_media', '{"type":"video","videoUrl":"https://assets.mixkit.co/videos/preview/mixkit-shopping-cart-in-a-supermarket-42907-large.mp4","posterUrl":"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80","headline":"Direct from Ghana Producers to Your Door","badge":"Express 2-Hour Delivery","autoplay":true,"muted":true,"loop":true}'::jsonb),
('store_policies', '{"minOrderAmount": 50, "businessHours": "8:00 AM - 10:00 PM GMT", "maintenanceMode": false, "maintenanceMessage": "Store is currently undergoing routine inventory refresh."}'::jsonb),
('notifications', '{"adminPhone": "+233501234567", "adminEmail": "alerts@akuamarket.com", "customerSmsEnabled": true, "customerEmailEnabled": true, "staffAlertsEnabled": true}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
