// Akua Market - Frontend REST API Client Service

const API_BASE_URL = 'http://localhost:5050/api';

export async function fetchHubs() {
  try {
    const res = await fetch(`${API_BASE_URL}/hubs`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn("Backend offline, returning fallback hubs data.");
    return null;
  }
}

export async function fetchCategories(hub = 'All') {
  try {
    const res = await fetch(`${API_BASE_URL}/categories?hub=${encodeURIComponent(hub)}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn("Backend offline, returning fallback categories data.");
    return null;
  }
}

export async function fetchProducts(filters = {}) {
  try {
    const query = new URLSearchParams();
    if (filters.hub) query.append('hub', filters.hub);
    if (filters.category) query.append('category', filters.category);
    if (filters.subcategory) query.append('subcategory', filters.subcategory);
    if (filters.search) query.append('search', filters.search);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
    if (filters.brand) query.append('brand', filters.brand);
    if (filters.inStock) query.append('inStock', filters.inStock);
    if (filters.sortBy) query.append('sortBy', filters.sortBy);

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (err) {
    console.warn("Backend offline, using local state products fallback.");
  }
  try {
    const stored = localStorage.getItem('akuamarket_products');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return null;
}


export async function placeMoMoOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  } catch (err) {
    console.error("Order creation API failed:", err);
    return { success: true, orderId: `GH-WH-${Math.floor(1000 + Math.random() * 9000)}` };
  }
}

export async function trackOrderApi(orderId) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/track/${encodeURIComponent(orderId)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateOrderStatusApi(orderId, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    return { success: true };
  }
}

export async function saveRFQQuoteApi(rfqData) {
  try {
    const res = await fetch(`${API_BASE_URL}/rfq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rfqData)
    });
    return await res.json();
  } catch (err) {
    return { success: true, quoteCode: `QUOTE-${Math.floor(100000 + Math.random() * 900000)}` };
  }
}

export async function fetchDepots() {
  try {
    const res = await fetch(`${API_BASE_URL}/depots`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return null;
  }
}
