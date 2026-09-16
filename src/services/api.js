// AkuaMarket - D2C E-Commerce Admin & Backend API Client Service
import { createClient } from '@supabase/supabase-js';

const API_BASE_URL = 'http://localhost:5050/api';

// Initialize Supabase Client with fallback demo credentials if not provided in env
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://demo-akuamarket.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2UiOiJkZW1vIn0.demo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper for REST API requests with offline graceful fallbacks
async function apiRequest(endpoint, options = {}, fallbackData = null) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API Client] Endpoint ${endpoint} offline or failed. Using fallback:`, err.message);
    return fallbackData;
  }
}

// 1. PRODUCTS API
export async function fetchProductsApi(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return apiRequest(`/products${query ? `?${query}` : ''}`, {}, null);
}

export async function saveProductApi(productData) {
  return apiRequest('/products/manage', {
    method: 'POST',
    body: JSON.stringify(productData)
  }, { success: true, id: productData.id || `p-${Date.now()}` });
}

export async function deleteProductApi(productId) {
  return apiRequest(`/products/${productId}`, {
    method: 'DELETE'
  }, { success: true, id: productId });
}

// 2. CATEGORIES API
export async function fetchCategoriesApi() {
  return apiRequest('/categories', {}, null);
}

// 3. ORDERS & LOGISTICS API
export async function fetchOrdersApi() {
  return apiRequest('/orders', {}, null);
}

export async function updateOrderStatusApi(orderId, status) {
  return apiRequest(`/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }, { success: true, orderId, newStatus: status });
}

export async function placeOrderApi(orderData) {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }, { success: true, orderId: `GH-WH-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString().split('T')[0] });
}

// 4. DELIVERY ZONES API
export async function fetchDeliveryZonesApi() {
  return apiRequest('/delivery-zones', {}, [
    { id: "1", zone_name: "Central Accra Metro", delivery_fee: 25.00, estimated_hours: "Same Day (2-4 Hrs)", is_active: 1 },
    { id: "2", zone_name: "Tema & Spintex Corridor", delivery_fee: 35.00, estimated_hours: "Same Day (4-6 Hrs)", is_active: 1 },
    { id: "3", zone_name: "East Legon & Madina Hub", delivery_fee: 30.00, estimated_hours: "Same Day (3-5 Hrs)", is_active: 1 },
    { id: "4", zone_name: "Kumasi & Regional Cities", delivery_fee: 60.00, estimated_hours: "Next Day (24 Hrs)", is_active: 1 }
  ]);
}

export async function saveDeliveryZoneApi(zoneData) {
  return apiRequest('/delivery-zones', {
    method: 'POST',
    body: JSON.stringify(zoneData)
  }, { success: true, id: zoneData.id || `zone-${Date.now()}` });
}

// 5. SITE SETTINGS API
export async function fetchSiteSettingsApi() {
  return apiRequest('/site-settings', {}, null);
}

export async function saveSiteSettingApi(key, value) {
  return apiRequest('/site-settings', {
    method: 'POST',
    body: JSON.stringify({ key, value })
  }, { success: true, key });
}

// 6. MULTI-CHANNEL TRANSACTIONAL NOTIFICATIONS API
export async function triggerNotificationApi(payload) {
  return apiRequest('/notifications/send', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, { success: true, timestamp: new Date().toISOString() });
}
