import { products } from '../data/products';
import { preferences as defaultPreferences } from '../data/account';

const apiCache = new Map();
const apiUrl = import.meta.env.VITE_API_URL;
const authApiUrl = import.meta.env.VITE_AUTH_API_URL
  || (import.meta.env.DEV ? 'http://localhost:5000/api/auth' : '/api/auth');
const ADDRESS_KEY = 'price-buster-addresses';
const PREFERENCES_KEY = 'price-buster-preferences';
const WISHLIST_KEY = 'price-buster-wishlist';

async function fetchJson(url, options = {}) {
  const { headers: extraHeaders, ...requestOptions } = options;
  const response = await fetch(url, {
    ...requestOptions,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(extraHeaders || {}),
    },
  });

  let data = null;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      if (response.ok) throw new Error('The server returned an invalid response.');
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function readLocal(key, fallback) {
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}

function writeLocal(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export async function login(email, password, rememberMe) {
  return fetchJson(`${authApiUrl}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  });
}

export async function registerAccount({ name, email, password }) {
  return fetchJson(`${authApiUrl}/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getCurrentUser() {
  return fetchJson(`${authApiUrl}/me`);
}

export async function logout() {
  return fetchJson(`${authApiUrl}/logout`, { method: 'POST' });
}

export async function getProfile() {
  const response = await getCurrentUser();
  return response.user;
}

export async function updateProfile(profile) {
  const response = await fetchJson(`${authApiUrl}/me`, {
    method: 'PUT',
    body: JSON.stringify({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth,
    }),
  });
  return response.user;
}

export async function updatePassword({ currentPassword, newPassword }) {
  return fetchJson(`${authApiUrl}/password`, {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function getOrders() {
  if (apiUrl) return fetchJson(`${apiUrl}/account/orders`);
  return [];
}

export async function getAddresses() {
  if (apiUrl) return fetchJson(`${apiUrl}/account/addresses`);
  return readLocal(ADDRESS_KEY, []);
}

export async function saveAddress(address) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/addresses${address.id ? `/${address.id}` : ''}`, {
      method: address.id ? 'PUT' : 'POST',
      body: JSON.stringify(address),
    });
  }
  const current = await getAddresses();
  const savedAddress = address.id ? address : { ...address, id: `address-${Date.now()}` };
  const updated = address.id
    ? current.map((item) => (item.id === address.id ? savedAddress : item))
    : [...current, savedAddress];
  if (savedAddress.isDefault || !updated.some((item) => item.isDefault)) {
    return writeLocal(ADDRESS_KEY, updated.map((item) => ({ ...item, isDefault: item.id === savedAddress.id })));
  }
  return writeLocal(ADDRESS_KEY, updated);
}

export async function deleteAddress(id) {
  if (apiUrl) {
    await fetchJson(`${apiUrl}/account/addresses/${id}`, { method: 'DELETE' });
    return getAddresses();
  }
  const updated = (await getAddresses()).filter((address) => address.id !== id);
  if (!updated.some((address) => address.isDefault) && updated.length) updated[0].isDefault = true;
  return writeLocal(ADDRESS_KEY, updated);
}

export async function setDefaultAddress(id) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/addresses/${id}/default`, { method: 'PUT' });
  }
  return writeLocal(ADDRESS_KEY, (await getAddresses()).map((address) => ({ ...address, isDefault: address.id === id })));
}

export async function getPreferences() {
  if (apiUrl) return fetchJson(`${apiUrl}/account/preferences`);
  return readLocal(PREFERENCES_KEY, { ...defaultPreferences });
}

export async function savePreferences(preferences) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }
  return writeLocal(PREFERENCES_KEY, preferences);
}

export async function getWishlist() {
  if (apiUrl) {
    const response = await fetchJson(`${apiUrl}/account/wishlist`);
    return response.productIds || response;
  }
  return readLocal(WISHLIST_KEY, []);
}

export async function saveWishlist(productIds) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/wishlist`, {
      method: 'PUT',
      body: JSON.stringify({ productIds }),
    });
  }
  return writeLocal(WISHLIST_KEY, productIds);
}

async function getLocalProducts() {
  return [...products];
}

export async function getProducts() {
  if (apiCache.has('products')) {
    return apiCache.get('products');
  }

  const request = apiUrl
    ? fetchJson(`${apiUrl}/products`).catch(() => getLocalProducts())
    : getLocalProducts();

  const result = await request;
  apiCache.set('products', result);
  return result;
}

export async function getProduct(id) {
  const cacheKey = `product:${id}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const product = (await getProducts()).find((item) => item.id === id || item.slug === id);
  if (!product) {
    throw new Error('Product not found');
  }

  apiCache.set(cacheKey, product);
  return product;
}

export async function getRelatedProducts(id) {
  const product = await getProduct(id);
  const cacheKey = `related:${product.id}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const related = (await getProducts()).filter((item) =>
    product.relatedIds?.includes(item.id) || (product.category && item.category === product.category && item.id !== product.id),
  ).slice(0, 3);

  const result = related.length ? related : (await getProducts()).filter((item) => item.id !== product.id).slice(0, 3);
  apiCache.set(cacheKey, result);
  return result;
}

export async function getReviews(id) {
  const product = await getProduct(id);
  const cacheKey = `reviews:${product.id}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  apiCache.set(cacheKey, reviews);
  return reviews;
}

export async function submitReview(id, review) {
  const product = await getProduct(id);
  const nextReview = {
    name: review.name || 'Anonymous',
    title: review.title || 'Verified buyer',
    text: review.text || review.comment || '',
    rating: Number(review.rating) || 5,
    date: 'Just now',
  };

  const reviews = Array.isArray(product.reviews) ? [...product.reviews, nextReview] : [nextReview];
  product.reviews = reviews;
  product.reviewCount = reviews.length;
  product.rating = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length;

  apiCache.set(`reviews:${product.id}`, reviews);
  apiCache.set(`product:${product.id}`, product);
  return reviews;
}

export async function searchProducts(query = '') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return getProducts();
  }

  const allProducts = await getProducts();
  return allProducts.filter((product) => product.name.toLowerCase().includes(normalized));
}

export async function submitOrder(payload) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/orders`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  return {
    ok: true,
    orderId: `PB-${Date.now()}`,
    message: 'Order submitted locally',
  };
}
