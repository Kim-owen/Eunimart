// AkuaMarket - D2C E-Commerce Admin & Backend API Client Service
import { createClient } from '@supabase/supabase-js';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5050/api';

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
  return apiRequest('/categories', {}, [
    { id: "c1", name: "Fresh Groceries", hub: "Supermarket", icon: "ShoppingBag", count: 24, badge: "Popular", subcategories: ["Rice & Grains", "Fresh Fruits"] },
    { id: "c2", name: "Beverages & Drinks", hub: "Supermarket", icon: "Coffee", count: 18, badge: "Chilled", subcategories: ["Juices", "Mineral Water"] },
    { id: "c3", name: "Electronics & Tech", hub: "Mall", icon: "Tv", count: 12, badge: "Mall", subcategories: ["Smart TVs", "Audio"] },
    { id: "c4", name: "Household & Baby", hub: "Supermarket", icon: "Home", count: 15, badge: "Essential", subcategories: ["Cleaning", "Diapers"] }
  ]);
}

export async function saveCategoryApi(categoryData) {
  return apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  }, { success: true, id: categoryData.id || `c-${Date.now()}` });
}

export async function deleteCategoryApi(categoryId) {
  return apiRequest(`/categories/${categoryId}`, {
    method: 'DELETE'
  }, { success: true, id: categoryId });
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

export async function dispatchOrderApi(orderId, dispatchData) {
  return apiRequest(`/orders/${encodeURIComponent(orderId)}/dispatch`, {
    method: 'PUT',
    body: JSON.stringify(dispatchData)
  }, { success: true, orderId, status: 'Out for Delivery' });
}

export async function deleteOrderApi(orderId) {
  return apiRequest(`/orders/${encodeURIComponent(orderId)}`, {
    method: 'DELETE'
  }, { success: true, id: orderId });
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

export async function deleteDeliveryZoneApi(zoneId) {
  return apiRequest(`/delivery-zones/${zoneId}`, {
    method: 'DELETE'
  }, { success: true, id: zoneId });
}

// 5. STAFF & ACCESS CONTROL API
export async function fetchStaffMembersApi() {
  return apiRequest('/staff', {}, [
    { id: "usr-admin-01", full_name: "Akua Mansa", email: "admin@akuamarket.com", role: "admin", phone: "+233501234567", status: "active", last_active: "Just Now" },
    { id: "usr-staff-02", full_name: "Kofi Mensah", email: "dispatch@akuamarket.com", role: "staff", phone: "+233244889900", status: "active", last_active: "10 mins ago" },
    { id: "usr-staff-03", full_name: "Abena Osei", email: "inventory@akuamarket.com", role: "staff", phone: "+233550112233", status: "active", last_active: "1 hour ago" }
  ]);
}

export async function saveStaffMemberApi(staffData) {
  return apiRequest('/staff', {
    method: 'POST',
    body: JSON.stringify(staffData)
  }, { success: true, id: staffData.id || `usr-staff-${Date.now()}` });
}

export async function deleteStaffMemberApi(staffId) {
  return apiRequest(`/staff/${staffId}`, {
    method: 'DELETE'
  }, { success: true, id: staffId });
}

export async function updateStaffRoleApi(staffId, role, wholesale_tier) {
  return apiRequest(`/staff/${staffId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role, wholesale_tier })
  }, { success: true, id: staffId, role, wholesale_tier });
}

// 6. RFQ / WHOLESALE QUOTES API
export async function fetchRfqQuotesApi() {
  return apiRequest('/rfq', {}, []);
}

export async function deleteRfqQuoteApi(quoteCode) {
  return apiRequest(`/rfq/${quoteCode}`, {
    method: 'DELETE'
  }, { success: true, quoteCode });
}

// 7. ANALYTICS & DASHBOARD KPI API
export async function fetchAnalyticsApi() {
  return apiRequest('/analytics', {}, null);
}

// 8. SITE SETTINGS API
export async function fetchSiteSettingsApi() {
  return apiRequest('/site-settings', {}, null);
}

export async function saveSiteSettingApi(key, value) {
  return apiRequest('/site-settings', {
    method: 'POST',
    body: JSON.stringify({ key, value })
  }, { success: true, key });
}

// 9. MULTI-CHANNEL TRANSACTIONAL NOTIFICATIONS API
export async function triggerNotificationApi(payload) {
  return apiRequest('/notifications/send', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, { success: true, timestamp: new Date().toISOString() });
}
